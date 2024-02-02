<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">plugin</el-tag>
			<span>插件的使用</span>
		</div>

		<div class="c">
			<el-button @click="open('manager')">管理者</el-button>
			<el-button @click="open('user')">用户</el-button>
			<demo-code :files="['form/plugin/index.vue', 'form/plugin/role.ts']" />

			<!-- 自定义表单组件 -->
			<cl-form ref="Form"></cl-form>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useForm } from "@cool-vue/crud";
import { setRole } from "./role";

const Form = useForm();

function open(role: string) {
	Form.value?.open(
		{
			title: "插件的使用",

			items: [
				{
					label: "姓名",
					prop: "name",
					required: true,
					component: {
						name: "el-input"
					}
				},
				{
					// 自定义参数 role，匹配插件传入的角色
					role: "user",
					label: "面试职位",
					prop: "work",
					value: 1,
					component: {
						name: "el-radio-group",
						options: [
							{
								label: "前端开发",
								value: 1
							},
							{
								label: "后端开发",
								value: 2
							},
							{
								label: "UI设计",
								value: 3
							}
						]
					}
				},
				{
					role: "user",
					label: "期望薪资",
					prop: "salary",
					value: 5000,
					component: {
						name: "el-input-number",
						props: {
							min: 2000,
							max: 100000
						}
					}
				},
				{
					role: "manager",
					label: "入职时间",
					prop: "date",
					component: {
						name: "el-date-picker"
					}
				},
				{
					role: "manager",
					label: "负责人",
					prop: "head",
					component: {
						name: "el-input"
					}
				}
			],
			on: {
				submit(data, { done, close }) {
					close();
				}
			}
		},
		[
			// 自定义插件，角色权限控制
			setRole(role)
		]
	);
}
</script>
