<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">children</el-tag>
			<span>层级显示</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/children.vue']" />

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

const Form = useForm();

function open() {
	Form.value?.open({
		title: "层级显示",
		items: [
			{
				label: "姓名",
				prop: "name",
				component: {
					name: "el-input"
				}
			},
			{
				label: "年龄",
				prop: "age",
				value: 18,
				component: {
					name: "el-input-number"
				}
			},

			// 基础信息
			{
				component: {
					//【很重要】使用 cl-form-card 组件渲染，也可以使用自定义
					name: "cl-form-card",
					props: {
						// 标题
						label: "基础信息",
						// 是否展开，默认 true
						expand: true
					}
				},
				children: [
					{
						label: "账号",
						prop: "account",
						component: {
							name: "el-input"
						}
					},
					{
						label: "密码",
						prop: "password",
						component: {
							name: "el-input"
						}
					}
				]
			},

			// 其他信息
			{
				component: {
					name: "cl-form-card",
					props: {
						label: "其他信息",
						expand: false
					}
				},
				children: [
					{
						label: "身份证",
						prop: "idcard",
						component: {
							name: "el-input"
						}
					},
					{
						label: "学校",
						prop: "school",
						component: {
							name: "el-input"
						}
					},
					{
						label: "专业",
						prop: "major",
						component: {
							name: "el-input"
						}
					}
				]
			}
		],
		on: {
			submit(data, { close }) {
				close();
			}
		}
	});
}
</script>
