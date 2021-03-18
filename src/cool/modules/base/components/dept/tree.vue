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

				<li v-if="drag && !browser.isMini">
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
				<template slot-scope="{ node, data }">
					<div class="cl-dept-tree__node">
						<span class="cl-dept-tree__node-label" @click="rowClick(data)">{{
							node.label
						}}</span>
						<span
							class="cl-dept-tree__node-icon"
							v-if="browser.isMini"
							@click="openCM($event, data, node)"
						>
							<i class="el-icon-more"></i>
						</span>
					</div>
				</template>
			</el-tree>
		</div>
	</div>
</template>

<script>
import { deepTree, isArray, revDeepTree } from "cl-admin/utils";
import { ContextMenu, Form } from "cl-admin-crud";
import { mapGetters } from "vuex";

export default {
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

	data() {
		return {
			list: [],
			loading: false,
			isDrag: false
		};
	},

	computed: {
		...mapGetters(["browser"])
	},

	created() {
		this.refresh();
	},

	methods: {
		openCM(e, d, n) {
			if (!d) {
				d = this.list[0] || {};
			}

			ContextMenu.open(e, {
				list: [
					{
						label: "新增",
						"suffix-icon": "el-icon-plus",
						hidden: n && n.level >= this.level,
						callback: (_, done) => {
							this.rowEdit({
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
						callback: (_, done) => {
							this.rowEdit(d);
							done();
						}
					},
					{
						label: "删除",
						"suffix-icon": "el-icon-delete",
						hidden: !Boolean(d.parentId),
						callback: (_, done) => {
							this.rowDel(d);
							done();
						}
					},
					{
						label: "新增成员",
						"suffix-icon": "el-icon-user",
						callback: (_, done) => {
							this.$emit("user-add", d);
							done();
						}
					}
				]
			});
		},

		allowDrag({ data }) {
			return data.parentId;
		},

		allowDrop(_, dropNode) {
			return dropNode.data.parentId;
		},

		refresh() {
			this.isDrag = false;
			this.loading = true;

			this.$service.system.dept
				.list()
				.then(res => {
					this.list = deepTree(res);
					this.$emit("list-change", this.list);
				})
				.done(() => {
					this.loading = false;
				});
		},

		rowClick(e) {
			ContextMenu.close();
			let ids = e.children ? revDeepTree(e.children).map(e => e.id) : [];
			ids.unshift(e.id);
			this.$emit("row-click", { item: e, ids });
		},

		rowEdit(e) {
			const method = e.id ? "update" : "add";

			Form.open({
				title: "编辑部门",
				width: "550px",
				props: {
					"label-width": "100px"
				},
				items: [
					{
						label: "部门名称",
						prop: "name",
						value: e.name,
						component: {
							name: "el-input",
							attrs: {
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
							attrs: {
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
					submit: (data, { done, close }) => {
						this.$service.system.dept[method]({
							id: e.id,
							parentId: e.parentId,
							name: data.name,
							orderNum: data.orderNum
						})
							.then(() => {
								this.$message.success(`新增部门${data.name}成功`);
								close();
								this.refresh();
							})
							.catch(err => {
								this.$message.error(err);
								done();
							});
					}
				}
			});
		},

		rowDel(e) {
			const del = f => {
				this.$service.system.dept
					.delete({
						ids: [e.id],
						deleteUser: f
					})
					.then(() => {
						if (f) {
							this.$message.success("删除成功");
						} else {
							this.$confirm(
								`“${e.name}” 部门的用户已成功转移到 “${e.parentName}” 部门。`,
								"删除成功"
							);
						}
					})
					.done(() => {
						this.refresh();
					});
			};

			this.$confirm(`该操作会删除 “${e.name}” 部门的所有用户，是否确认？`, "提示", {
				type: "warning",
				confirmButtonText: "直接删除",
				cancelButtonText: "保留用户",
				distinguishCancelAndClose: true
			})
				.then(() => {
					del(true);
				})
				.catch(action => {
					if (action == "cancel") {
						del(false);
					}
				});
		},

		treeOrder(f) {
			if (f) {
				this.$confirm("部门架构已发生改变，是否保存？", "提示", {
					type: "warning"
				})
					.then(() => {
						const deep = (list, pid) => {
							list.forEach(e => {
								e.parentId = pid;
								ids.push(e);

								if (e.children && isArray(e.children)) {
									deep(e.children, e.id);
								}
							});
						};

						let ids = [];

						deep(this.list, null);

						this.$service.system.dept
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
								this.$message.success("更新排序成功");
							})
							.catch(err => {
								this.$message.error(err);
							})
							.done(() => {
								this.refresh();
								this.isDrag = false;
							});
					})
					.catch(() => {});
			} else {
				this.refresh();
			}
		}
	}
};
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

	/deep/.el-tree-node__content {
		height: 36px;
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

		/deep/.el-tree-node__content {
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
