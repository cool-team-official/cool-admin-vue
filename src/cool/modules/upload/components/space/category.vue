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

			<el-input v-model="keyword" placeholder="输入关键字过滤" size="mini" />
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

		<cl-form :ref="setRefs('form')" />
	</div>
</template>

<script lang="ts">
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, defineComponent, inject, ref, watch } from "vue";
import { useStore } from "vuex";
import { isEmpty } from "/@/core/utils";
import { ContextMenu } from "cl-admin-crud-vue3";
import { useRefs } from "/@/core";

export default defineComponent({
	name: "cl-upload-space-category",

	props: {
		modelValue: [Number, String]
	},

	emits: ["update:modelValue", "change"],

	setup(_, { emit }) {
		const store = useStore();
		const { refs, setRefs }: any = useRefs();
		const service: any = inject("service");
		const space = inject<any>("space");

		// 数据列表
		const list = ref<any[]>([]);

		// 当前选择
		const current = ref<number | string>("");

		// 搜索关键字
		const keyword = ref<string>("");

		// 过滤列表
		const flist = computed(() => {
			return list.value.filter((e: any) => e.name.includes(keyword.value));
		});

		// 浏览器信息
		const browser = computed(() => store.getters.browser);

		// 监听选择变化
		watch(
			() => current.value,
			(id: number | string) => {
				emit("update:modelValue", id);
				emit("change", id);
			}
		);

		// 刷新分类
		function refresh() {
			return service.upload.type.list().then((res: any) => {
				res.unshift({
					name: "全部文件",
					id: null
				});

				list.value = res;

				if (!isEmpty(res)) {
					if (!current.value) {
						current.value = res[0].id;
					}
				}
			});
		}

		// 编辑分类
		function edit(item: any = {}) {
			refs.value.form.open({
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
					submit: (data: any, { done, close }: any) => {
						let next = null;

						if (!item.id) {
							next = service.upload.type.add(data);
						} else {
							next = service.upload.type.update({
								...data,
								id: item.id
							});
						}

						next.then(() => {
							refresh();
							close();
						}).catch((err: string) => {
							ElMessage.error(err);
							done();
						});
					}
				}
			});
		}

		// 选择类目
		function select(id: number) {
			current.value = id;

			// 小屏幕下收起左侧类目
			if (browser.value.isMini) {
				space.category.visible = false;
			}
		}

		// 打开类目列表右键菜单
		function openContextMenu(e: any, { id, name }: any) {
			if (!id) {
				return false;
			}

			ContextMenu.open(e, {
				list: [
					{
						label: "刷新",
						"suffix-icon": "el-icon-edit",
						callback: (_: any, done: Function) => {
							refresh();
							done();
						}
					},
					{
						label: "编辑",
						"suffix-icon": "el-icon-edit",
						callback: (_: any, done: Function) => {
							edit({ id, name });
							done();
						}
					},
					{
						label: "删除",
						"suffix-icon": "el-icon-delete",
						callback: (_: any, done: Function) => {
							ElMessageBox.confirm(
								`此操作将删除【${name}】下的文件, 是否继续?`,
								"提示",
								{
									type: "warning"
								}
							)
								.then(() => {
									service.upload.type
										.delete({
											ids: [id]
										})
										.then(() => {
											ElMessage.success("删除成功");

											if (id == current.value) {
												current.value = 0;
											}

											refresh();
										})
										.catch((err: string) => {
											ElMessage.error(err);
										});
								})
								.catch(() => null);

							done();
						}
					}
				]
			});
		}

		refresh();

		return {
			refs,
			setRefs,
			browser,
			space,
			list,
			flist,
			current,
			keyword,
			refresh,
			edit,
			select,
			openContextMenu
		};
	}
});
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
