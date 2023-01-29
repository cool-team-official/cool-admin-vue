<template>
	<div class="item-category">
		<div class="item-category__head">
			<span>类型</span>
			<el-button type="success" bg size="small" @click="edit()">添加</el-button>
		</div>

		<div class="item-category__list">
			<el-scrollbar>
				<ul>
					<li
						v-for="(item, index) in flist"
						:key="index"
						:class="{
							'is-active': item.id == ViewGroup?.selected?.id
						}"
						@click="select(item)"
						@contextmenu.stop.prevent="onContextMenu($event, item)"
					>
						<el-icon class="icon">
							<folder-opened v-if="ViewGroup?.selected?.id == item.id" />
							<folder v-else />
						</el-icon>
						<span>{{ item.name }}</span>
					</li>

					<el-empty v-if="flist.length == 0" :image-size="80" />
				</ul>
			</el-scrollbar>
		</div>
	</div>

	<cl-form ref="Form" />
</template>

<script lang="ts" setup name="item-category">
import { ElMessage, ElMessageBox } from "element-plus";
import { Folder, FolderOpened } from "@element-plus/icons-vue";
import { computed, onMounted, ref } from "vue";
import { useCool } from "/@/cool";
import { ContextMenu, useForm } from "@cool-vue/crud";
import { useViewGroup } from "/$/base";
import { useSpace } from "../../hooks";

const { service } = useCool();
const { space } = useSpace();
const { ViewGroup } = useViewGroup();
const Form = useForm();

// 数据列表
const list = ref<Eps.SpaceTypeEntity[]>([]);

// 搜索关键字
const keyword = ref("");

// 过滤列表
const flist = computed(() => {
	return list.value.filter((e) => (e.name || "").includes(keyword.value));
});

// 刷新分类
async function refresh() {
	return service.space.type
		.list({
			order: "createTime",
			sort: "asc"
		})
		.then((res) => {
			res.unshift({
				name: "全部文件",
				id: undefined
			});

			list.value = res;

			if (!ViewGroup.value?.selected) {
				select();
			}
		});
}

// 编辑分类
function edit(item: Eps.SpaceTypeEntity = {}) {
	Form.value?.open({
		title: "添加分类",
		width: "400px",
		props: {
			labelPosition: "top"
		},
		dialog: {
			controls: ["close"]
		},
		items: [
			{
				label: "分类名称",
				prop: "name",
				value: "",
				required: true,
				component: {
					name: "el-input",
					props: {
						maxlength: 20,
						clearable: true
					}
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
function select(item?: Eps.SpaceTypeEntity) {
	if (!item) {
		item = list.value[0];
	}

	if (item) {
		space.refresh({ page: 1, classifyId: item.id });

		ViewGroup.value?.select(item);
		ViewGroup.value?.setTitle(item.name);
	}
}

// 打开类目列表右键菜单
function onContextMenu(e: any, { id, name }: Eps.SpaceTypeEntity) {
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
									if (id == ViewGroup.value?.selected?.id) {
										select();
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
.item-category {
	height: 100%;
	width: 100%;

	&__head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 40px;
		font-size: 14px;
		padding: 0 10px;
		white-space: nowrap;
	}

	&__list {
		height: calc(100% - 40px);
		padding: 0 10px;
		box-sizing: border-box;

		ul {
			height: 100%;

			li {
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

				.icon {
					margin-right: 10px;
					font-size: 16px;
				}

				.arrow {
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

			&::after {
				display: block;
				content: "";
				height: 1px;
			}
		}
	}
}
</style>
