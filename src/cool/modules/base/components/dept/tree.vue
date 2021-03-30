<template>
	<div class="cl-dept-tree">
		<div class="cl-dept-tree__header">
			<div>组织架构</div>

			<ul class="cl-dept-tree__op">
				<li>
					<el-tooltip content="刷新">
						<i class="el-icon-refresh" @click="refresh()"></i>
					</el-tooltip>
				</li>

				<li v-if="drag && !isMini">
					<el-tooltip content="拖动排序">
						<i class="el-icon-s-operation" @click="isDrag = true"></i>
					</el-tooltip>
				</li>

				<li class="no" v-show="isDrag">
					<el-button type="text" size="mini" @click="treeOrder(true)">保存</el-button>
					<el-button type="text" size="mini" @click="treeOrder(false)">取消</el-button>
				</li>
			</ul>
		</div>

		<div class="cl-dept-tree__container" @contextmenu.prevent="openCM">
			<el-tree
				node-key="id"
				highlight-current
				default-expand-all
				:data="list"
				:props="{
					label: 'name'
				}"
				:draggable="isDrag"
				:allow-drag="allowDrag"
				:allow-drop="allowDrop"
				:expand-on-click-node="false"
				v-loading="loading"
				@node-contextmenu="openCM"
			>
				<template #default="{ node, data }">
					<div class="cl-dept-tree__node">
						<span class="cl-dept-tree__node-label" @click="rowClick(data)">{{
							node.label
						}}</span>
						<span
							class="cl-dept-tree__node-icon"
							v-if="isMini"
							@click="openCM($event, data, node)"
						>
							<i class="el-icon-more"></i>
						</span>
					</div>
				</template>
			</el-tree>
		</div>

		<cl-form :ref="setRefs('form')"></cl-form>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ContextMenu } from "@/crud";
import { useRefs } from "@/core";
import { deepTree, isArray, revDeepTree, isPc } from "@/core/utils";

export default defineComponent({
	name: "cl-dept-tree",

	props: {
		drag: {
			type: Boolean,
			default: true
		},
		level: {
			type: Number,
			default: 99
		}
	},

	setup(props, { emit }) {
		const { refs, setRefs } = useRefs();

		// 树形列表
		const list = ref<any[]>([]);

		// 加载中
		const loading = ref<boolean>(false);

		// 是否能拖动
		const isDrag = ref<boolean>(false);

		// 请求服务
		const $service = inject<any>("service");

		// 允许托的规则
		function allowDrag({ data }: any) {
			return data.parentId;
		}

		// 允许放的规则
		function allowDrop(_: any, dropNode: any) {
			return dropNode.data.parentId;
		}

		// 刷新
		function refresh() {
			isDrag.value = false;
			loading.value = true;

			$service.system.dept
				.list()
				.then((res: any[]) => {
					list.value = deepTree(res);
					emit("list-change", list.value);
				})
				.done(() => {
					loading.value = false;
				});
		}

		// 获取 ids
		function rowClick(e: any) {
			ContextMenu.close();
			const ids = e.children ? revDeepTree(e.children).map(e => e.id) : [];
			ids.unshift(e.id);
			emit("row-click", { item: e, ids });
		}

		// 编辑部门
		function rowEdit(e: any) {
			const method = e.id ? "update" : "add";

			refs.value.form.open({
				title: "编辑部门",
				width: "550px",
				props: {
					labelWidth: "100px"
				},
				items: [
					{
						label: "部门名称",
						prop: "name",
						value: e.name,
						component: {
							name: "el-input",
							props: {
								placeholder: "请填写部门名称"
							}
						},
						rules: {
							required: true,
							message: "部门名称不能为空"
						}
					},
					{
						label: "上级部门",
						prop: "parentId",
						value: e.parentName || "...",
						component: {
							name: "el-input",
							props: {
								disabled: true
							}
						}
					},
					{
						label: "排序",
						prop: "orderNum",
						value: e.orderNum || 0,
						component: {
							name: "el-input-number",
							props: {
								"controls-position": "right",
								min: 0,
								max: 100
							}
						}
					}
				],
				on: {
					submit: (data: any, { done, close }: any) => {
						$service.system.dept[method]({
							id: e.id,
							parentId: e.parentId,
							name: data.name,
							orderNum: data.orderNum
						})
							.then(() => {
								ElMessage.success(`新增部门${data.name}成功`);
								close();
								refresh();
							})
							.catch((err: string) => {
								ElMessage.error(err);
								done();
							});
					}
				}
			});
		}

		// 删除部门
		function rowDel(e: any) {
			const del = (f: boolean) => {
				$service.system.dept
					.delete({
						ids: [e.id],
						deleteUser: f
					})
					.then(() => {
						if (f) {
							ElMessage.success("删除成功");
						} else {
							ElMessageBox.confirm(
								`“${e.name}” 部门的用户已成功转移到 “${e.parentName}” 部门。`,
								"删除成功"
							);
						}
					})
					.done(() => {
						refresh();
					});
			};

			ElMessageBox.confirm(`该操作会删除 “${e.name}” 部门的所有用户，是否确认？`, "提示", {
				type: "warning",
				confirmButtonText: "直接删除",
				cancelButtonText: "保留用户",
				distinguishCancelAndClose: true
			})
				.then(() => {
					del(true);
				})
				.catch((action: string) => {
					if (action == "cancel") {
						del(false);
					}
				});
		}

		// 部门排序
		function treeOrder(f: boolean) {
			if (f) {
				ElMessageBox.confirm("部门架构已发生改变，是否保存？", "提示", {
					type: "warning"
				})
					.then(() => {
						const ids: any[] = [];

						const deep = (list: any[], pid: any) => {
							list.forEach(e => {
								e.parentId = pid;
								ids.push(e);

								if (e.children && isArray(e.children)) {
									deep(e.children, e.id);
								}
							});
						};

						deep(list.value, null);

						$service.system.dept
							.order(
								ids.map((e, i) => {
									return {
										id: e.id,
										parentId: e.parentId,
										orderNum: i
									};
								})
							)
							.then(() => {
								ElMessage.success("更新排序成功");
							})
							.catch((err: string) => {
								ElMessage.error(err);
							})
							.done(() => {
								refresh();
								isDrag.value = false;
							});
					})
					.catch(() => null);
			} else {
				refresh();
			}
		}

		// 右键菜单
		function openCM(e: any, d: any, n: any) {
			if (!d) {
				d = list.value[0] || {};
			}

			ContextMenu.open(e, {
				list: [
					{
						label: "新增",
						"suffix-icon": "el-icon-plus",
						hidden: n && n.level >= props.level,
						callback: (_: any, done: Function) => {
							rowEdit({
								name: "",
								parentName: d.name,
								parentId: d.id
							});
							done();
						}
					},
					{
						label: "编辑",
						"suffix-icon": "el-icon-edit",
						callback: (_: any, done: Function) => {
							rowEdit(d);
							done();
						}
					},
					{
						label: "删除",
						"suffix-icon": "el-icon-delete",
						hidden: !d.parentId,
						callback: (_: any, done: Function) => {
							rowDel(d);
							done();
						}
					},
					{
						label: "新增成员",
						"suffix-icon": "el-icon-user",
						callback: (_: any, done: Function) => {
							emit("user-add", d);
							done();
						}
					}
				]
			});
		}

		onMounted(function() {
			refresh();
		});

		return {
			refs,
			list,
			loading,
			isDrag,
			isMini: !isPc(),
			setRefs,
			openCM,
			allowDrag,
			allowDrop,
			refresh,
			rowClick,
			rowEdit,
			rowDel,
			treeOrder
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-dept-tree {
	height: 100%;
	width: 100%;

	&__header {
		display: flex;
		align-items: center;
		height: 40px;
		padding: 0 10px;
		background-color: #fff;
		letter-spacing: 1px;
		position: relative;

		div {
			font-size: 14px;
			flex: 1;
			white-space: nowrap;
		}

		i {
			font-size: 18px;
			cursor: pointer;
		}
	}

	&__op {
		display: flex;

		li {
			display: flex;
			justify-content: center;
			align-items: center;
			list-style: none;
			margin-left: 5px;
			padding: 5px;
			cursor: pointer;

			&:not(.no):hover {
				background-color: #eee;
			}
		}
	}

	&__container {
		height: calc(100% - 40px);
		overflow-y: auto;
		overflow-x: hidden;

		:deep(.el-tree-node__content) {
			height: 36px;
			margin: 0 5px;
		}
	}

	&__node {
		display: flex;
		align-items: center;
		height: 100%;
		width: 100%;
		box-sizing: border-box;

		&-label {
			display: flex;
			align-items: center;
			flex: 1;
			height: 100%;
			font-size: 14px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		&-icon {
			height: 28px;
			width: 28px;
			line-height: 28px;
			text-align: center;
			margin-right: 5px;
		}
	}
}
</style>
