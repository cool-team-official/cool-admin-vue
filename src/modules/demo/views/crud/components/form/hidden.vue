<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">hidden</el-tag>
			<span>隐藏/显示</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/hidden.vue']" />

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
		title: "隐藏/显示",
		items: [
			{
				label: "状态",
				prop: "status",
				value: 0,
				component: {
					name: "el-radio-group",
					options: [
						{
							label: "关闭",
							value: 0
						},
						{
							label: "开启",
							value: 1
						}
					]
				}
			},
			{
				label: "账号",
				prop: "account",
				component: {
					name: "el-input"
				}
			},
			{
				//【很重要】是否隐藏
				hidden({ scope }) {
					// scope 为表单值
					// 返回一个 boolean 来控制当前表单项的隐藏/显示
					return scope.status != 1;
				},
				label: "密码",
				prop: "password",
				component: {
					name: "el-input"
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
