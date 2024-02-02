<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">all</el-tag>
			<span>完整示例</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['crud/all.vue']" />

			<cl-dialog v-model="visible" title="完整示例" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<!-- 刷新按钮 -->
						<cl-refresh-btn />

						<!-- 新增按钮 -->
						<cl-add-btn />

						<!-- 批量删除按钮 -->
						<cl-multi-delete-btn />

						<!-- 筛选 -->
						<cl-filter label="状态筛选">
							<!-- 配置props，选择后会自动过滤列表 -->
							<cl-select :options="options.status" prop="status" :width="120" />
						</cl-filter>

						<!-- 字典 -->
						<cl-filter label="工作（字典）">
							<cl-select
								tree
								:options="dict.get('occupation')"
								prop="occupation"
								:width="140"
								check-strictly
							/>
						</cl-filter>

						<cl-flex1 />

						<!-- 导入 -->
						<cl-import-btn template="/用户导入模版.xlsx" />

						<!-- 导出 -->
						<cl-export-btn :columns="Table?.columns" />

						<!-- 自定义列 -->
						<cl-column-custom
							:columns="Table?.columns"
							:ref="setRefs('columnCustom')"
						/>

						<!-- 关键字搜索 -->
						<cl-search-key placeholder="搜索姓名、手机号" :width="250" />

						<!-- 高级搜索按钮 -->
						<cl-adv-btn />
					</cl-row>

					<cl-row>
						<!-- 表格 -->
						<cl-table
							ref="Table"
							show-summary
							:summary-method="onSummaryMethod"
							:auto-height="false"
						>
							<!-- 展开信息 -->
							<template #column-detail="{ scope }">
								<div style="padding: 0 10px">
									<el-descriptions border :column="3">
										<el-descriptions-item label="ID">
											{{ scope.row.id }}
										</el-descriptions-item>

										<el-descriptions-item label="姓名">
											{{ scope.row.name }}
										</el-descriptions-item>

										<el-descriptions-item label="存款">
											{{ scope.row.wages }}
										</el-descriptions-item>

										<el-descriptions-item label="出生年月">
											{{ scope.row.createTime }}
										</el-descriptions-item>
									</el-descriptions>
								</div>
							</template>

							<!-- 自定义列 -->
							<template #column-wages="{ scope }">
								<span>{{ scope.row.wages }}🤑</span>
							</template>
						</cl-table>
					</cl-row>

					<cl-row>
						<cl-flex1 />

						<!-- 分页 -->
						<cl-pagination />
					</cl-row>

					<!-- 新增、编辑 -->
					<cl-upsert ref="Upsert" />

					<!-- 高级搜索 -->
					<cl-adv-search ref="AdvSearch" />
				</cl-crud>
			</cl-dialog>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script lang="tsx" name="demo-crud" setup>
import { useCrud, useUpsert, useTable, useAdvSearch, useSearch } from "@cool-vue/crud";
import { useDict } from "/$/dict";
import { reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useCool } from "/@/cool";

// 基础
const { service, refs, setRefs } = useCool();

// 字典
const { dict } = useDict();

// 选项，统一命名options，存放所有的下拉等其他选项列表数据
const options = reactive({
	status: [
		{
			label: "启用",
			value: 1
		},
		{
			label: "禁用",
			type: "danger",
			value: 0
		}
	]
});

// 合计数据
const subData = reactive({
	wages: 0
});

// crud
const Crud = useCrud(
	{
		// 绑定的服务，如：service.demo.goods、service.base.sys.user
		service: service.test,

		// 刷新事件
		async onRefresh(params, { next }) {
			const res = await next(params);
			Object.assign(subData, res.subData);
		}
	},
	(app) => {
		// Crud 加载完，默认刷新一次
		app.refresh({
			size: 10
			// status: 1 // 带额外参数的请求
		});
	}
);

// 刷新列表，统一调用这个方法去刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// 新增、编辑
// 插入类型 <Eps.UserInfoEntity>，prop 和 data 会有提示
const Upsert = useUpsert<Eps.UserInfoEntity>({
	items: [
		// 分组
		{
			type: "tabs",
			props: {
				type: "card",
				labels: [
					{
						label: "基础信息",
						value: "base"
					},
					{
						label: "其他配置",
						value: "other"
					}
				]
			}
		},
		{
			label: "头像",
			prop: "avatarUrl",
			group: "base",
			component: {
				name: "cl-upload"
			}
		},
		{
			label: "账号",
			group: "base",
			prop: "account",
			component: {
				name: "el-input"
			}
		},
		// 动态配置，新增显示、编辑隐藏
		() => {
			return () => {
				return {
					label: "密码",
					group: "base",
					prop: "password",
					hidden: Upsert.value?.mode == "update", // 通过 mode 参数判断
					component: {
						name: "el-input",
						props: {
							type: "password"
						}
					}
				};
			};
		},
		{
			group: "base",
			prop: "user",
			component: {
				name: "cl-form-card",
				props: {
					label: "用户信息（多层级展示）"
				}
			},
			children: [
				{
					label: "姓名",
					prop: "name",
					required: true,
					component: {
						name: "el-input"
					}
				},
				{
					label: "存款",
					prop: "wages",
					component: {
						name: "el-input-number"
					}
				}
			]
		},
		{
			group: "base",
			prop: "contact",
			component: {
				name: "cl-form-card",
				props: {
					label: "联系信息",
					expand: false
				}
			},
			children: [
				{
					label: "手机号",
					prop: "phone",
					component: {
						name: "el-input"
					}
				},
				{
					label: "省市区",
					prop: "pca",
					group: "base",
					component: {
						name: "cl-distpicker"
					}
				}
			]
		},
		{
			group: "other",
			label: "工作",
			prop: "occupation",
			component: {
				name: "el-tree-select",
				props: {
					data: dict.get("occupation"),
					checkStrictly: true
				}
			}
		},
		{
			group: "other",
			label: "身份证照片",
			prop: "idCardPic",
			component: {
				name: "cl-upload",
				props: {
					isSpace: true,
					size: [200, 300]
				}
			}
		}
	],

	// 详情钩子
	onInfo(data, { next, done }) {
		// 继续请求 info 接口，可以带其他自定义参数
		// next({
		// 	id: data.id,
		//	status: 1
		// });

		// 使用其他接口
		// service.demo.goods.info({ id: data.id }).then((res) => {
		// 	done(res);
		// });

		// 直接取列表的数据返回
		done(data);
	},

	// 提交钩子
	onSubmit(data, { next, close, done }) {
		console.log("onSubmit", data);
		// 继续请求 update/add 接口
		next(data);

		// 自定义接口
		// service.demo.goods
		// 	.update(data)
		// 	.then(() => {
		// 		ElMessage.success("保存成功");

		// 		// 操作完，刷新列表
		// 		refresh();

		// 		// 关闭窗口
		// 		close();
		// 	})
		// 	.catch((err) => {
		// 		ElMessage.error(err.message);

		// 		// 关闭加载状态
		// 		done();
		// 	});
	},

	// 打开后，数据加载完，onInfo 之后
	onOpened(data) {
		if (Upsert.value?.mode != "info") {
			ElMessage.info("编辑中");
		}
	},

	// 关闭钩子
	onClose(action, done) {
		if (Upsert.value?.mode == "update") {
			if (action == "close") {
				return ElMessageBox.confirm("还没填完，确定关闭不？", "提示", {
					type: "warning"
				})
					.then(() => {
						done();
						ElMessage.info("好吧");
					})
					.catch(() => {
						ElMessage.success("请继续编辑");
					});
			}
		}

		done();
	}
});

// 表格
const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60
		},
		// 展开列
		{
			label: "展开",
			type: "expand",
			prop: "detail",
			width: 60
		},
		{
			label: "头像",
			prop: "avatar",
			width: 100,
			component: {
				name: "cl-image",
				props: {
					size: 40
				}
			}
		},
		{
			label: "姓名",
			prop: "name",
			minWidth: 120
		},
		{
			label: "手机号",
			prop: "phone",
			minWidth: 140,

			// 带搜索组件
			search: {
				component: {
					name: "el-input",
					props: {
						placeholder: "搜索手机号"
					}
				}
			}
		},
		{
			label: "账号",
			prop: "account",
			minWidth: 150
		},
		{
			label: "存款(元)",
			prop: "wages",
			minWidth: 150,
			sortable: "desc" // 默认倒序
		},
		{
			label: "工作",
			prop: "occupation",
			dict: dict.get("occupation"),
			dictColor: true,
			minWidth: 150,
			dictAllLevels: true, // 显示所有等级

			// 带搜索组件
			search: {
				component: {
					name: "cl-select",
					props: {
						options: dict.get("occupation")
					}
				}
			}
		},
		{
			label: "状态",
			orderNum: 2,
			prop: "status",
			minWidth: 100,
			component: {
				name: "cl-switch"
			}
		},
		{
			label: "出生年月",
			orderNum: 1,
			minWidth: 165,
			prop: "createTime",
			sortable: "custom",
			search: {
				component: {
					name: "cl-date-picker",
					props: {
						type: "date",
						valueFormat: "YYYY-MM-DD",
						placeholder: "搜索日期"
					}
				}
			}
		},
		{
			type: "op",
			width: 320,
			// 静态配置按钮
			// buttons: ["info", "edit", "delete"],
			// 动态配置按钮
			buttons({ scope }) {
				return [
					"info",
					"edit",
					"delete",
					{
						label: "自定义",
						onClick() {
							ElMessage.info(`他是：${scope.row.name}`);
						}
					}
				];
			}
		}
	]
});

// 合计
function onSummaryMethod() {
	// 添加自定义列组件后
	return ["合计", "", ...refs.columnCustom.summary(subData)];
}

// 高级搜索
const AdvSearch = useAdvSearch({
	items: [
		{
			label: "姓名",
			prop: "name",
			component: {
				name: "el-input",
				props: {
					clearable: true
				}
			}
		},
		{
			label: "手机号",
			prop: "phone",
			component: {
				name: "el-input",
				props: {
					clearable: true
				}
			}
		},
		{
			label: "工作",
			prop: "occupation",
			hook: {
				bind: "string"
			},
			component: {
				name: "el-select",
				options: dict.get("occupation")
			}
		}
	]
});

// 搜索
const Search = useSearch({
	items: [
		{
			label: "姓名",
			prop: "name",
			component: {
				name: "el-input",
				props: {
					clearable: true
				}
			}
		}
	]
});

const visible = ref(false);

function open() {
	visible.value = true;
}
</script>
