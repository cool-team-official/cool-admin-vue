<template>
	<el-button @click="autoCreate" v-if="isDev" style="margin-left: 10px">自动添加</el-button>

	<cl-form ref="Form">
		<template #slot-list="{ scope }">
			<el-scrollbar class="scrollbar">
				<div class="list" v-for="(item, index) in scope.list" :key="index">
					<el-divider content-position="left">{{ item.prefix }}</el-divider>

					<div class="item" v-for="(a, ai) in item.api" :key="ai">
						<!-- 是否开启 -->
						<el-switch v-model="a.checked"></el-switch>

						<!-- 名称 -->
						<el-input
							v-model="a.summary"
							clearable
							placeholder="权限名称"
							:disabled="!a.checked"
						/>

						<!-- 权限 -->
						<cl-menu-perms v-model="a.perms" :disabled="!a.checked" />
					</div>
				</div>
			</el-scrollbar>
		</template>
	</cl-form>
</template>

<script setup name="auto-perms" lang="ts">
import { useForm } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { deepPaths } from "/@/cool/utils";
import { ElMessage } from "element-plus";
import { isDev } from "/@/config";
import { EpsApi, EpsData, EpsModule } from "../../types";

const props = defineProps({
	menuId: [String, Number]
});

const emit = defineEmits(["open", "close"]);

const { service } = useCool();
const Form = useForm();

// 获取实体数据
async function getEntity() {
	return service.base.open.eps().then((eps: EpsData) => {
		const modules: EpsModule[] = [];
		const paths: string[] = [];

		// 遍历实体
		for (const i in eps) {
			eps[i].forEach((e) => {
				e.prefix = e.prefix?.replace("/admin/", "");

				if (e.prefix) {
					paths.push(e.prefix);
				}

				modules.push(e);
			});
		}

		return {
			prop: "entity",
			label: "实体数据",
			component: {
				name: "el-cascader",
				props: {
					options: deepPaths(paths),
					separator: ".",
					props: {
						multiple: true
					},
					onChange(arr: string[][]) {
						const list: any[] = [];

						arr.forEach((v) => {
							const d = modules.find((e) => e.prefix == v.join("/"));

							if (d) {
								d.api.forEach((e) => {
									e.perms = (d.prefix + e.path).replace(/\//g, ":");
									e.checked = true;
								});

								list.push(d);
							}
						});

						// 渲染列表
						Form.value?.setForm("list", list);
					}
				}
			}
		};
	});
}

// 自动创建
async function autoCreate() {
	emit("open");

	Form.value?.open({
		title: "自动添加权限",
		width: "800px",
		dialog: {
			draggable: true,
			controls: ["close"]
		},
		props: {
			labelPosition: "top"
		},
		op: {
			saveButtonText: "一键添加"
		},
		items: [
			await getEntity(),
			{
				prop: "list",
				label: "权限列表",
				value: [],
				hidden({ scope }) {
					return !scope.entity;
				},
				component: {
					name: "slot-list"
				}
			}
		],
		on: {
			submit(data: { list: any[]; entity: any }, { done, close }) {
				if (!data.entity) {
					ElMessage.error("请选择实体数据");
					done();
					return;
				}

				// 选中权限
				const checked: EpsApi[] = data.list
					.map((e) => e.api)
					.flat()
					.filter((e) => e.checked);

				if (checked.find((e) => !e.summary)) {
					ElMessage.error("请填写权限名称");
					done();
					return;
				}

				if (checked.length == 0) {
					ElMessage.error("请至少选择一个权限");
					done();
					return;
				}

				Promise.all(
					checked.map((e) => {
						return service.base.sys.menu.add({
							type: 2,
							parentId: props.menuId,
							name: e.summary,
							perms: e.perms
						});
					})
				)
					.then(() => {
						ElMessage.success("添加权限成功");
						close();
						emit("close");
					})
					.catch((err) => {
						done();
						ElMessage.error(err.message);
					});
			}
		}
	});
}
</script>

<style lang="scss" scoped>
.scrollbar {
	max-height: 500px;

	.list {
		.item {
			display: flex;
			align-items: center;
			margin-bottom: 10px;

			.el-input {
				margin: 0 10px;
				width: 200px;
			}

			.cl-menu-perms {
				flex: 1;
			}
		}
	}
}
</style>
