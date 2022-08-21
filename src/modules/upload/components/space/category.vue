<template>
	<div
		class="cl-upload-space-category"
		:class="{
			'is-position': app.browser.isMini,
			'is-show': space.category.visible
		}"
	>
		<div class="cl-upload-space-category__search">
			<el-input v-model="keyword" placeholder="搜索" clearable />
			<el-button type="success" @click="edit()">添加</el-button>
		</div>

		<div class="cl-upload-space-category__list">
			<el-scrollbar>
				<ul>
					<li
						v-for="(item, index) in flist"
						:key="index"
						class="item"
						:class="{
							'is-active': item.id == space.category.id
						}"
						@click="select(item.id)"
						@contextmenu.stop.prevent="onContextMenu($event, item)"
					>
						<span>{{ item.name }}</span>
						<el-icon v-show="space.category.id == item.id"
							><arrow-right-bold
						/></el-icon>
					</li>

					<el-empty v-if="flist.length == 0" :image-size="80" />
				</ul>
			</el-scrollbar>
		</div>
	</div>

	<cl-form ref="Form" />
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowRightBold } from "@element-plus/icons-vue";
import { computed, inject, onMounted, ref } from "vue";
import { isEmpty } from "lodash-es";
import { useCool } from "/@/cool";
import { ContextMenu, useForm } from "@cool-vue/crud";
import { useBase } from "/$/base";

const { service } = useCool();

// 缓存
const { app } = useBase();

// 接收
const space = inject<any>("space");

// 数据列表
const list = ref<any[]>([]);

// 搜索关键字
const keyword = ref<string>("");

// 过滤列表
const flist = computed(() => {
	return list.value.filter((e: any) => e.name.includes(keyword.value));
});

// 刷新分类
async function refresh() {
	return service.space.type.list().then((res) => {
		res.unshift({
			name: "全部文件",
			id: null
		});

		list.value = res;

		if (!isEmpty(res)) {
			if (!space.category.id) {
				space.category.id = res[0].id;
			}
		}
	});
}

const Form = useForm();

// 编辑分类
function edit(item: any = {}) {
	Form.value?.open({
		title: "添加分类",
		width: "400px",
		items: [
			{
				label: "分类名称",
				prop: "name",
				value: "",
				required: true,
				component: {
					name: "el-input"
				}
			}
		],
		form: {
			...item
		},
		on: {
			submit(data, { done, close }) {
				let next = null;

				if (!item.id) {
					next = service.space.type.add(data);
				} else {
					next = service.space.type.update({
						...data,
						id: item.id
					});
				}

				next.then(() => {
					refresh();
					close();
				}).catch((err) => {
					ElMessage.error(err.message);
					done();
				});
			}
		}
	});
}

// 选择类目
function select(id: number) {
	// 小屏幕下收起左侧类目
	if (app.browser.isMini) {
		space.category.visible = false;
	}

	space.category.id = id;
	space.refresh({ page: 1 });
}

// 打开类目列表右键菜单
function onContextMenu(e: any, { id, name }: any) {
	if (!id) {
		return false;
	}

	ContextMenu.open(e, {
		hover: {
			target: "item"
		},
		list: [
			{
				label: "刷新",
				callback(done) {
					refresh();
					done();
				}
			},
			{
				label: "编辑",
				callback(done) {
					edit({ id, name });
					done();
				}
			},
			{
				label: "删除",
				callback(done) {
					ElMessageBox.confirm(`此操作将删除【${name}】下的文件, 是否继续?`, "提示", {
						type: "warning"
					})
						.then(() => {
							service.space.type
								.delete({
									ids: [id]
								})
								.then(() => {
									ElMessage.success("删除成功");

									// 是否删除当前
									if (id == space.category.id) {
										space.category.id = null;
									}

									refresh();
								})
								.catch((err) => {
									ElMessage.error(err.message);
								});
						})
						.catch(() => null);

					done();
				}
			}
		]
	});
}

onMounted(() => {
	refresh();
});
</script>

<style lang="scss" scoped>
.cl-upload-space-category {
	height: 100%;
	width: 0;
	background-color: var(--el-bg-color);
	overflow: hidden;
	transition: width 0.2s ease-in-out;
	border-radius: 5px;

	&.is-show {
		width: 220px;
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
			margin-left: 10px;
		}
	}

	&__list {
		height: calc(100% - 48px);
		padding: 0 10px;

		ul {
			height: 100%;

			.item {
				display: flex;
				align-items: center;
				list-style: none;
				font-size: 13px;
				height: 35px;
				padding: 0 10px;
				cursor: pointer;
				background-color: #f7f7f7;
				margin-bottom: 10px;
				border-radius: 3px;
				color: #666;
				position: relative;

				.el-icon {
					position: absolute;
					right: 10px;
				}

				&.is-active {
					background-color: var(--color-primary);
					color: #fff;
				}

				&:not(.is-active):hover {
					background-color: #f7f7f7;
				}
			}
		}
	}
}
</style>
