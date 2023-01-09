<template>
	<div class="dict-group" v-loading="loading">
		<div class="head">
			<span>类型</span>
			<el-button
				type="success"
				bg
				size="small"
				v-permission="service.dict.type.permission.add"
				@click="edit()"
				>添加</el-button
			>
		</div>

		<div class="list">
			<el-scrollbar>
				<ul>
					<li
						v-for="(item, index) in list"
						:key="index"
						class="item"
						:class="{
							'is-active': ViewGroup?.selected?.id == item.id
						}"
						@click="select(item)"
						@contextmenu="
							(e) => {
								onContextMenu(e, item);
							}
						"
					>
						<span>{{ item.name }} - {{ item.key }}</span>
						<el-icon v-show="ViewGroup?.selected?.id == item.id"
							><arrow-right-bold
						/></el-icon>
					</li>

					<el-empty v-if="list.length == 0" :image-size="80" />
				</ul>
			</el-scrollbar>
		</div>

		<!-- 表单 -->
		<cl-form ref="Form"></cl-form>
	</div>
</template>

<script lang="ts" setup>
import { ContextMenu, useForm } from "@cool-vue/crud";
import { ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref } from "vue";
import { useCool } from "/@/cool";
import { ArrowRightBold } from "@element-plus/icons-vue";
import { checkPerm, useViewGroup } from "/$/base";

const emit = defineEmits(["refresh"]);

const { service } = useCool();
const { ViewGroup } = useViewGroup();
const Form = useForm();

// 列表
const list = ref<Eps.DictTypeEntity[]>([]);

// 加载状态
const loading = ref(false);

// 刷新
async function refresh() {
	loading.value = true;

	await service.dict.type.list({ order: "createTime", sort: "asc" }).then((res) => {
		list.value = res;

		if (!ViewGroup.value?.selected) {
			select();
		}
	});

	loading.value = false;
}

// 选择
function select(item?: Eps.DictTypeEntity) {
	if (!item) {
		item = list.value[0];
	}

	if (item) {
		emit("refresh", {
			typeId: item.id,
			page: 1
		});

		ViewGroup.value?.select(item);
		ViewGroup.value?.setTitle(`字典列表（${item.name}）`);
	}
}

// 编辑
function edit(item?: Eps.DictTypeEntity) {
	Form.value?.open({
		title: item ? "编辑类型" : "添加类型",
		width: "500px",
		props: {
			labelWidth: "60px"
		},
		items: [
			{
				label: "名称",
				prop: "name",
				component: {
					name: "el-input",
					props: {
						maxlength: 20
					}
				},
				required: true
			},
			{
				label: "Key",
				prop: "key",
				component: {
					name: "el-input",
					props: {
						maxlength: 20
					}
				},
				required: true
			}
		],
		form: {
			...item
		},
		on: {
			submit(data, { close, done }) {
				service.dict.type[item ? "update" : "add"](data)
					.then(() => {
						ElMessage.success("保存成功");
						close();
						refresh();
					})
					.catch((err) => {
						ElMessage.error(err.message);
						done();
					});
			}
		}
	});
}

// 右键
function onContextMenu(e: any, item: Eps.DictTypeEntity) {
	ContextMenu.open(e, {
		hover: {
			target: "item"
		},
		list: [
			{
				label: "编辑",
				hidden: !checkPerm(service.dict.type.permission.update),
				callback(done) {
					done();
					edit(item);
				}
			},
			{
				label: "删除",
				hidden: !checkPerm(service.dict.type.permission.delete),
				callback(done) {
					done();

					ElMessageBox.confirm("是否要删除该类型？", "提示", {
						type: "warning"
					})
						.then(() => {
							service.dict.type
								.delete({
									ids: [item.id]
								})
								.then(async () => {
									ElMessage.success("删除成功");

									// 刷新列表
									await refresh();

									// 删除当前
									if (ViewGroup.value?.selected?.id == item.id) {
										select();
									}
								})
								.catch((err) => {
									ElMessage.error(err.message);
								});
						})
						.catch(() => null);
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
.dict-group {
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	white-space: nowrap;

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 40px;
		font-size: 14px;
		padding: 0 10px;
	}

	.list {
		height: calc(100% - 40px);
		padding: 0 10px;
		box-sizing: border-box;

		ul {
			height: 100%;

			li {
				display: flex;
				align-items: center;
				list-style: none;
				box-sizing: border-box;
				padding: 10px 35px 10px 10px;
				cursor: pointer;
				font-size: 13px;
				margin-bottom: 10px;
				border-radius: 3px;
				color: #666;
				position: relative;
				background-color: #f7f7f7;

				.el-icon {
					position: absolute;
					right: 10px !important;
				}

				&.is-active {
					background-color: var(--color-primary);
					color: #fff;
				}

				&:hover {
					opacity: 0.8;
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
