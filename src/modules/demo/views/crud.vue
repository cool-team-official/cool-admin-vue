<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />

			<!-- 新增按钮 -->
			<cl-add-btn />

			<!-- 批量删除按钮 -->
			<cl-multi-delete-btn />

			<!-- 自定义表单 -->
			<form-btn />

			<!-- 筛选 -->
			<cl-filter label="状态筛选">
				<!-- 配置props，选择后会自动过滤列表 -->
				<cl-select :options="options.status" prop="status" />
			</cl-filter>

			<cl-flex1 />

			<!-- 导入 -->
			<cl-import-btn template="/用户导入模版.xlsx" />

			<!-- 导出 -->
			<cl-export-btn :columns="Table?.columns" />

			<!-- 自定义列 -->
			<cl-column-custom :columns="Table?.columns" />

			<!-- 关键字搜索 -->
			<cl-search-key />

			<!-- 高级搜索按钮 -->
			<cl-adv-btn />
		</cl-row>

		<cl-row>
			<!-- 表格 -->
			<cl-table ref="Table" show-summary :summary-method="onSummaryMethod">
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
								{{ scope.row.price }}
							</el-descriptions-item>

							<el-descriptions-item label="创建时间">
								{{ scope.row.createTime }}
							</el-descriptions-item>
						</el-descriptions>
					</div>
				</template>

				<!-- 自定义插槽 -->
				<template #column-price="{ scope }"> ￥{{ scope.row.price }} </template>
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
</template>

<script lang="tsx" name="demo-crud" setup>
import { useCrud, useUpsert, useTable, useAdvSearch, setFocus } from "@cool-vue/crud";
import { useDict } from "/$/dict";
import { reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useCool } from "/@/cool";
import FormBtn from "../components/form-btn.vue";

// 基础
const { service } = useCool();

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

// crud
const Crud = useCrud(
	{
		// 绑定的服务，如：service.demo.goods、service.base.sys.user
		service: "test"
	},
	(app) => {
		// Crud 加载完，默认刷新一次
		app.refresh({
			// status: 1 // 带额外参数的请求
		});
	}
);

// 刷新列表，统一调用这个方法去刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// 新增、编辑
const Upsert = useUpsert({
	items: [
		// 分组
		{
			type: "tabs",
			props: {
				type: "card",
				labels: [
					{
						label: "基础",
						value: "base"
					},
					{
						label: "其他",
						value: "other"
					}
				]
			}
		},
		{
			label: "头像",
			prop: "avatar",
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
		},
		{
			prop: "user",
			group: "base",
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
					label: "年龄",
					prop: "age",
					component: {
						name: "el-input-number"
					}
				}
			]
		},

		{
			label: "省市区",
			prop: "pca",
			group: "base",
			component: {
				name: "cl-distpicker"
			}
		},

		{
			label: "职业",
			prop: "occupation",
			group: "other",
			component: {
				name: "el-tree-select",
				props: {
					data: dict.get("occupation"),
					checkStrictly: true
				}
			}
		},
		{
			label: "身份证照片",
			prop: "idCardPic",
			group: "other",
			component: {
				name: "cl-upload",
				props: {
					isSpace: true,
					size: [200, 300]
				}
			}
		}
	],

	// 插件
	plugins: [
		// 自动聚焦
		setFocus("account")
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
			ElMessage.success("编辑中");
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
			label: "#",
			type: "expand",
			prop: "detail"
		},
		{
			label: "姓名",
			prop: "name"
		},
		{
			label: "存款(元)",
			prop: "price",
			sortable: true
		},
		{
			label: "状态",
			orderNum: 2,
			prop: "status",
			dict: options.status
		},
		{
			label: "创建时间",
			orderNum: 1,
			prop: "createTime",
			sortable: "desc" // 默认倒序
		},
		{
			type: "op",
			width: 350,
			// 静态配置按钮
			// buttons: ["info", "edit", "delete"],
			// 动态配置按钮
			buttons({ scope }) {
				return [
					"info",
					"edit",
					"delete",
					{
						label: "自定义按钮",
						hidden: !scope.row.status,
						onClick({ scope }) {
							ElMessage.success(scope.row.name + "正常");
						}
					}
				];
			}
		}
	]
});

// 合计
function onSummaryMethod({ data }: { data: any[] }) {
	return ["合计", "", "", data.reduce((a, b) => parseFloat(a + Number(b.price)), 0).toFixed(2)];
}

// 高级搜索
const AdvSearch = useAdvSearch({
	items: [
		{
			label: "昵称",
			prop: "name",
			component: {
				name: "el-input"
			}
		}
	]
});
</script>
