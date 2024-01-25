<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">hook</el-tag>
			<span>Hook的使用</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['upsert/hook/index.vue', 'upsert/hook/reg-pca2.ts']" />

			<!-- 自定义表格组件 -->
			<cl-dialog v-model="visible" title="Hook的使用" width="80%">
				<cl-crud ref="Crud">
					<cl-row>
						<!-- 打开新增表单的按钮 -->
						<cl-add-btn />
					</cl-row>

					<cl-row>
						<cl-table ref="Table" />
					</cl-row>

					<cl-row>
						<cl-flex1 />
						<cl-pagination />
					</cl-row>

					<!--【很重要】新增、编辑的表单组件 -->
					<cl-upsert ref="Upsert" />
				</cl-crud>
			</cl-dialog>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { ref } from "vue";
import { useDict } from "/$/dict";

const { dict } = useDict();

// cl-crud 配置
const Crud = useCrud(
	{
		service: "test"
	},
	(app) => {
		app.refresh();
	}
);

// cl-table 配置
const Table = useTable({
	autoHeight: false,
	contextMenu: ["refresh"],

	columns: [
		{
			label: "姓名",
			prop: "name",
			minWidth: 140
		},
		{
			label: "手机号",
			prop: "phone",
			minWidth: 140
		},
		{
			label: "省市区",
			prop: "pca",
			formatter(row) {
				return row.province ? row.province + "-" + row.city + "-" + row.district : "-";
			},
			minWidth: 140
		},
		{
			label: "工作",
			prop: "occupation",
			dict: dict.get("occupation"),
			minWidth: 140
		},
		{
			label: "创建时间",
			prop: "createTime",
			minWidth: 160,
			sortable: "desc"
		},
		{
			type: "op",
			buttons: ["edit", "delete"]
		}
	]
});

// cl-upsert 配置
const Upsert = useUpsert({
	items: [
		{
			label: "姓名",
			prop: "name",
			component: {
				name: "el-input"
			}
		},
		{
			label: "手机号",
			prop: "phone",
			component: {
				name: "el-input"
			}
		},
		{
			label: "省市区",
			prop: "pca2",

			//【很重要】hook 参数配置
			hook: {
				bind(value, { form }) {
					// 将3个参数合并成一个数组，带入级联选择器
					return [form.province, form.city, form.district];
				},
				submit(value, { form, prop }) {
					// 提交的时候将数组拆分成3个字段提交
					const [province, city, district] = value || [];
					form.province = province;
					form.city = city;
					form.district = district;

					// 删除 prop 绑定值
					form[prop] = undefined;
				}
			},
			// 注册到全局后可直接使用，注册代码看 ./reg-pca2.ts
			// hook: "pca2",

			component: {
				name: "cl-distpicker"
			}
		},
		{
			label: "标签",
			prop: "labels",
			//【很重要】使用内置方法，避免一些辣鸡后端要你这么传给他
			hook: {
				// labels 的数据为 1,2,3

				// 绑定的时候将 labels 按 , 分割成数组
				bind: ["split", "number"],

				// 提交的时候将 labels 拼接成字符串
				submit: ["join"]
			},
			component: {
				name: "el-select",
				props: {
					multiple: true
				},
				options: [
					{
						label: "帅气",
						value: 1
					},
					{
						label: "多金",
						value: 2
					},
					{
						label: "有才华",
						value: 3
					}
				]
			}
		},
		{
			label: "工作",
			prop: "occupation",
			component: {
				name: "cl-select",
				props: {
					tree: true,
					checkStrictly: true,
					options: dict.get("occupation")
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
