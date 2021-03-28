<template>
	<div
		class="cl-upload-space-category"
		:class="{
			'is-position': browser.isMini,
			'is-show': space.category.visible
		}"
	>
		<div class="cl-upload-space-category__search">
			<el-button type="primary" size="mini" @click="edit()">添加分类</el-button>

			<el-input v-model="keyword" placeholder="输入关键字过滤" size="mini"></el-input>
		</div>

		<div class="cl-upload-space-category__list">
			<ul class="scroller1">
				<li
					v-for="(item, index) in flist"
					:key="index"
					:class="{
						'is-active': item.id == current
					}"
					@click="select(item.id)"
					@contextmenu.stop.prevent="openContextMenu($event, item)"
				>
					{{ item.name }}
				</li>
			</ul>
		</div>

		<cl-form ref="form"></cl-form>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { isEmpty } from "@/core/utils";

export default {
	name: "cl-upload-space-category",

	props: {
		modelValue: [Number]
	},

	inject: ["space"],

	data() {
		return {
			list: [],
			current: undefined,
			keyword: ""
		};
	},

	computed: {
		...mapGetters(["browser"]),

		flist() {
			return this.list.filter(e => e.name.includes(this.keyword));
		}
	},

	watch: {
		current: {
			handler(id) {
				this.$emit("update:modelValue", id);
				this.$emit("change", id);
			}
		}
	},

	created() {
		this.refresh();
	},

	methods: {
		// 刷新分类
		refresh() {
			return this.$service.space.type.list().then(res => {
				res.unshift({
					name: "全部文件",
					id: null
				});

				this.list = res;

				if (!isEmpty(res)) {
					if (!this.current) {
						this.current = res[0].id;
					}
				}
			});
		},

		// 编辑分类
		edit(item = {}) {
			this.$refs.form.open({
				title: "添加分类",
				width: "400px",
				items: [
					{
						label: "分类名称",
						prop: "name",
						value: item.name,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写分类名称"
							}
						},
						rules: {
							required: true,
							message: "分类名称不能为空"
						}
					}
				],
				on: {
					submit: (data, { done, close }) => {
						let next = null;

						if (!item.id) {
							next = this.$service.space.type.add(data);
						} else {
							next = this.$service.space.type.update({
								...data,
								id: item.id
							});
						}

						next.then(() => {
							this.refresh();
							close();
						}).catch(err => {
							this.$message.error(err);
							done();
						});
					}
				}
			});
		},

		// 选择类目
		select(id) {
			this.current = id;

			// 小屏幕下收起左侧类目
			if (this.browser.isMini) {
				this.space.category.visible = false;
			}
		},

		// 打开类目列表右键菜单
		openContextMenu(e, { id, name }) {
			if (!id) {
				return false;
			}

			this.$crud.openContextMenu(e, {
				list: [
					{
						label: "刷新",
						"suffix-icon": "el-icon-edit",
						callback: (_, done) => {
							this.refresh();
							done();
						}
					},
					{
						label: "编辑",
						"suffix-icon": "el-icon-edit",
						callback: (_, done) => {
							this.edit({ id, name });
							done();
						}
					},
					{
						label: "删除",
						"suffix-icon": "el-icon-delete",
						callback: (_, done) => {
							this.$confirm(`此操作将删除【${name}】下的文件, 是否继续?`, "提示", {
								type: "warning"
							})
								.then(() => {
									this.$service.space.type
										.delete({
											ids: [id]
										})
										.then(() => {
											this.$message.success("删除成功");

											if (id == this.current) {
												this.current = null;
											}

											this.refresh();
										})
										.catch(err => {
											this.$message.error(err);
										});
								})
								.catch(() => null);

							done();
						}
					}
				]
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-upload-space-category {
	height: 100%;
	width: 0;
	background-color: #fff;
	overflow: hidden;
	transition: width 0.2s ease-in-out;
	border-radius: 5px;

	&.is-show {
		width: 250px;
		margin-right: 5px;
	}

	&.is-position {
		position: absolute;
		left: 5px;
		top: 51px;
		height: calc(100% - 56px);
		z-index: 3000;

		&.is-show {
			width: calc(100% - 10px);
		}
	}

	&__search {
		display: flex;
		align-items: center;
		padding: 10px;

		.el-button {
			margin-right: 10px;
		}
	}

	&__list {
		height: calc(100% - 48px);
		padding: 0 10px;

		ul {
			height: 100%;

			li {
				list-style: none;
				font-size: 14px;
				height: 40px;
				line-height: 40px;
				border-bottom: 1px dashed #eee;
				padding: 0 10px;
				cursor: pointer;

				&.is-active {
					color: $color-primary;
				}

				&:hover {
					background-color: #f7f7f7;
				}
			}
		}
	}
}
</style>
