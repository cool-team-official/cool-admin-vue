import { useCool } from "/@/cool";
import { deepTree } from "/@/cool/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { defineComponent, h, ref } from "vue";
import { useCrud, useForm } from "@cool-vue/crud";

export default defineComponent({
	name: "dept-move",

	setup() {
		const { service } = useCool();

		// cl-form
		const Form = useForm();

		// cl-crud
		const Crud = useCrud();

		// 树形列表
		const list = ref<any[]>([]);

		// 刷新列表
		async function refresh() {
			return await service.base.sys.department.list().then(deepTree);
		}

		// 转移
		async function toMove(ids: any[]) {
			list.value = await refresh();

			Form.value?.open({
				title: "部门转移",
				width: "600px",

				props: {
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

						ElMessageBox.confirm(`是否将用户转移到部门 “${name}” 下`, "提示", {
							type: "warning"
						})
							.then(() => {
								service.base.sys.user
									.move({
										departmentId: id,
										userIds: ids
									})
									.then(() => {
										ElMessage.success("转移成功");
										Crud.value?.refresh();
										close();
									})
									.catch((err) => {
										ElMessage.error(err.message);
										done();
									});
							})
							.catch(() => null);
					}
				}
			});
		}

		return {
			Form,
			list,
			refresh,
			toMove
		};
	},

	render(ctx: any) {
		return (
			<div class="cl-dept-move">
				{h(
					<cl-form ref="Form"></cl-form>,
					{},
					{
						"slot-move"({ scope }: any) {
							return (
								<div
									style={{
										border: "1px solid #eee",
										borderRadius: "3px",
										padding: "2px"
									}}
								>
									<el-tree
										data={ctx.list}
										props={{
											label: "name"
										}}
										node-key="id"
										highlight-current
										onNodeClick={(e: any) => {
											scope["dept"] = e;
										}}
									></el-tree>
								</div>
							);
						}
					}
				)}
			</div>
		);
	}
});
