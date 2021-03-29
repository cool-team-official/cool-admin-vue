import { useRefs } from "@/core";
import { deepTree } from "@/core/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { defineComponent, h, inject, ref } from "vue";

export default defineComponent({
	name: "cl-dept-move",

	emits: ["success", "error"],

	setup(_: any, { emit }) {
		const $service = inject<any>("service");
		const { refs, setRefs } = useRefs();

		// 树形列表
		const list = ref<any[]>([]);

		// 刷新列表
		async function refresh() {
			return await $service.system.dept.list().then(deepTree);
		}

		// 转移
		async function toMove(ids: any[]) {
			list.value = await refresh();

			refs.value.form.open({
				props: {
					title: "部门转移",
					width: "600px",
					labelWidth: "80px"
				},
				items: [
					{
						label: "选择部门",
						prop: "dept",
						component: {
							name: "slot-move"
						}
					}
				],
				on: {
					submit: (data: any, { done, close }: any) => {
						if (!data.dept) {
							ElMessage.warning("请选择部门");
							return done();
						}

						const { name, id } = data.dept;

						ElMessageBox.confirm(`是否将用户转移到部门 ${name} 下`, "提示", {
							type: "warning"
						})
							.then(() => {
								$service.system.user
									.move({
										departmentId: id,
										userIds: ids
									})
									.then((res: any) => {
										ElMessage.success("转移成功");
										emit("success", res);
										close();
									})
									.catch((err: any) => {
										console.log(err);
										ElMessage.error(err);
										emit("error", err);
										done();
									});
							})
							.catch(() => null);
					}
				}
			});
		}

		return {
			refs,
			list,
			setRefs,
			refresh,
			toMove
		};
	},

	render(ctx: any) {
		return (
			<div class="cl-dept-move">
				{h(
					<cl-form ref={ctx.setRefs("form")}></cl-form>,
					{},
					{
						"slot-move"({ scope }: any) {
							return (
								<div
									style={{
										border: "1px solid #eee",
										borderRadius: "3px",
										padding: "2px"
									}}>
									<el-tree
										data={ctx.list}
										props={{
											label: "name"
										}}
										node-key="id"
										highlight-current
										onNodeClick={(e: any) => {
											scope["dept"] = e;
										}}></el-tree>
								</div>
							);
						}
					}
				)}
			</div>
		);
	}
});
