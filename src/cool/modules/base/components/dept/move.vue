<template>
	<div class="cl-dept-move"></div>
</template>

<script>
import { deepTree } from "cl-admin/utils";

export default {
	name: "cl-dept-move",

	methods: {
		async toMove(ids) {
			this.$crud.openForm({
				title: "部门转移",
				width: "600px",
				props: {
					"label-width": "80px"
				},
				items: [
					{
						label: "选择部门",
						prop: "dept",
						component: {
							name: "system-user__dept-move",

							data() {
								return {
									list: []
								};
							},

							async created() {
								this.list = await this.$service.system.dept.list().then(deepTree);
							},

							methods: {
								selectRow(e) {
									this.$emit("input", e);
								}
							},

							render() {
								return (
									<div
										style={{
											border: "1px solid #eee",
											"border-radius": "3px",
											padding: "2px"
										}}>
										<el-tree
											data={this.list}
											{...{
												props: {
													props: {
														label: "name"
													}
												}
											}}
											node-key="id"
											highlight-current
											on-node-click={this.selectRow}></el-tree>
									</div>
								);
							}
						}
					}
				],
				on: {
					submit: (data, { done, close }) => {
						if (!data.dept) {
							this.$message.warning("请选择部门");
							return done();
						}

						const { name, id } = data.dept;

						this.$confirm(`是否将用户转移到部门 ${name} 下`, "提示", {
							type: "warning"
						})
							.then(() => {
								this.$service.system.user
									.move({
										departmentId: id,
										userIds: ids
									})
									.then(res => {
										this.$message.success("转移成功");
										this.$emit("success", res);
										close();
									})
									.catch(err => {
										this.$message.error(err);
										this.$emit("error", err);
										done();
									});
							})
							.catch(() => {});
					}
				}
			});
		}
	}
};
</script>
