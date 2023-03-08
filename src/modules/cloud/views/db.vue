<template>
	<cl-view-group ref="ViewGroup">
		<template #item-name="{ item }">
			{{ item.name }} - {{ item.tableName }} - {{ item.className }}</template
		>

		<template #right>
			<div class="source" v-loading="loading">
				<div class="head">
					<el-button @click="refresh()">刷新</el-button>
					<el-button type="success" @click="edit()">添加</el-button>
					<el-button type="danger" @click="clear()">清空</el-button>
				</div>

				<el-scrollbar class="scrollbar">
					<div class="list">
						<div class="item" v-for="(item, index) in list" :key="index">
							<cl-code-json :model-value="item" :height="150">
								<template #op>
									<el-button type="primary" size="small" @click="edit(item)"
										>编辑</el-button
									>
									<el-button type="danger" size="small" @click="remove(item.id)"
										>删除</el-button
									>
								</template>
							</cl-code-json>
						</div>
					</div>

					<div class="empty" v-if="list.length == 0">
						<el-empty :image-size="100" />
					</div>
				</el-scrollbar>

				<div class="footer">
					<el-pagination
						background
						layout="prev, pager, next"
						:current-page="pagination.page"
						:total="pagination.total"
						:page-size="pagination.size"
						@current-change="onCurrentChange"
					/>
				</div>

				<cl-form ref="Form" />
			</div>
		</template>
	</cl-view-group>
</template>

<script lang="ts" name="cloud-db" setup>
import { useForm } from "@cool-vue/crud";
import { ElMessage, ElMessageBox } from "element-plus";
import { reactive, ref } from "vue";
import { useViewGroup } from "/$/base";
import { useCool } from "/@/cool";
import { CodeSnippets, Status } from "../dict";

const { service } = useCool();

const { ViewGroup } = useViewGroup({
	label: "表",
	title: "数据列表",
	service: service.cloud.db,
	onEdit() {
		return {
			props: {
				labelWidth: "60px"
			},
			items: [
				{ label: "名称", prop: "name", required: true, component: { name: "el-input" } },
				{
					label: "内容",
					prop: "content",
					component: {
						name: "cl-editor-monaco",
						props: {
							language: "typescript",
							options: {
								fontSize: "16px"
							}
						}
					},
					value: CodeSnippets.db,
					required: true
				},
				{
					label: "说明",
					prop: "readme",
					component: {
						name: "el-input",
						props: {
							type: "textarea",
							rows: 3
						}
					}
				},
				{
					label: "状态",
					prop: "status",
					value: 1,
					component: { name: "el-radio-group", options: Status },
					required: true
				}
			]
		};
	},
	onSelect() {
		refresh({
			page: 1
		});
	}
});

const Form = useForm();

// 加载中
const loading = ref(false);

// 列表
const list = ref<any[]>([]);

// 分页
const pagination = reactive({
	page: 1,
	size: 20,
	total: 0
});

// 请求参数
const reqParams = {
	page: 1,
	size: 20
};

// 统一请求
function request(method: string, params?: any) {
	return service.cloud.db.data({
		id: ViewGroup.value?.selected?.id,
		method,
		params
	});
}

// 刷新
async function refresh(params?: any) {
	Object.assign(reqParams, params);

	loading.value = true;

	await request("page", reqParams)
		.then((res) => {
			list.value = res.list;
			Object.assign(pagination, res.pagination);
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});

	loading.value = false;
}

// 清空数据
function clear() {
	ElMessageBox.confirm(
		`此操作将会清空表（${ViewGroup.value?.selected?.name}）的所有数据，是否继续？`,
		"提示",
		{
			type: "warning"
		}
	)
		.then(() => {
			request("clear")
				.then(() => {
					ElMessage.success("清空数据成功");
					refresh();
				})
				.catch((err) => {
					ElMessage.error(err.message);
				});
		})
		.catch(() => null);
}

// 删除数据
function remove(id: string) {
	ElMessageBox.confirm("此操作将会删除选择的数据，是否继续？", "提示", {
		type: "warning"
	})
		.then(() => {
			request("delete", {
				ids: [id]
			})
				.then(() => {
					ElMessage.success("删除数据成功");
					refresh();
				})
				.catch((err) => {
					ElMessage.error(err.message);
				});
		})
		.catch(() => null);
}

// 编辑
function edit(item?: any) {
	Form.value?.open({
		title: item ? "编辑数据" : "添加数据",
		props: {
			labelWidth: "60px"
		},
		items: [
			{
				label: "内容",
				prop: "content",
				component: {
					name: "cl-editor-monaco",
					props: {
						options: {
							fontSize: "16px"
						}
					}
				},
				value: `{}`,
				required: true
			}
		],
		form: {
			content: JSON.stringify(item, null, 4)
		},
		on: {
			submit(data, { close, done }) {
				try {
					request(item ? "update" : "add", JSON.parse(data.content))
						.then(() => {
							ElMessage.success("保存成功");
							close();
							refresh();
						})
						.catch((err) => {
							ElMessage.error(err.message);
							done();
						});
				} catch (e) {
					ElMessage.error(e?.toString());
					done();
				}
			}
		}
	});
}

// 监听页数变化
function onCurrentChange(index: number) {
	refresh({
		page: index
	});
}
</script>

<style lang="scss" scoped>
.source {
	height: 100%;

	.head {
		padding: 0 10px;
		margin-bottom: 10px;
	}

	.scrollbar {
		height: calc(100% - 92px);
		box-sizing: border-box;
		background-color: var(--el-fill-color-lighter);

		.list {
			.item {
				padding: 0 10px 10px 10px;
				background-color: var(--el-bg-color);

				&:last-child {
					padding-bottom: 0;
				}
			}
		}

		.empty {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.footer {
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>
