<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">layout</el-tag>
			<span>布局</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/layout.vue']" />

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
		title: "布局",
		items: [
			{
				//【span】参考文档：https://element-plus.gitee.io/zh-CN/component/layout.html
				// 使用 1/24 分栏，默认 24
				span: 12,
				label: "昵称",
				prop: "nickname",
				component: {
					name: "el-input"
				}
			},
			{
				span: 12,
				label: "手机号",
				prop: "phone",
				component: {
					name: "el-input",
					props: {
						maxlength: 11
					}
				}
			},
			{
				//【flex】使宽度不填充满
				flex: false,
				label: "标签",
				prop: "label",
				component: {
					name: "el-input"
				}
			},
			{
				label: "状态",
				prop: "status",
				value: 1,
				component: {
					name: "el-radio-group",
					options: [
						{
							label: "开启",
							value: 1
						},
						{
							label: "关闭",
							value: 0
						}
					]
				}
			},
			{
				label: "备注",
				prop: "remark",
				component: {
					name: "el-input",
					props: {
						type: "textarea",
						rows: 4
					}
				}
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
