<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">disabled</el-tag>
			<span>组件禁用</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/disabled.vue']" />

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
		title: "组件禁用",
		items: [
			{
				label: "账号",
				prop: "account",
				component: {
					name: "el-input",
					props: {
						// 设置 boolean 值控制组件的禁用状态（前提是组件支持这个参数，element 的组件几乎都有）
						disabled: true
					}
				}
			},
			{
				label: "密码",
				prop: "password",
				component: {
					name: "el-input"
				}
			}
		],
		on: {
			open() {
				// 通用 setProps 方法去设置 disabled, 1.5s后禁用
				setTimeout(() => {
					Form.value?.setProps("password", { disabled: true });
				}, 1500);
			},

			submit(data, { close }) {
				close();
			}
		}
	});
}
</script>
