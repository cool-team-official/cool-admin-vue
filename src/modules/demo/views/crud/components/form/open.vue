<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">open</el-tag>
			<span>起步</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/open.vue']" />

			<!-- 自定义表单组件 -->
			<!--【很重要】ref 一定要对应 useForm 定义的值 -->
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
		title: "起步",

		items: [
			{
				label: "昵称",
				// 绑定值的标识，表单提交及回显会自动根据 prop 获取对应的值
				prop: "nickname",
				// 组件绑定
				component: {
					// 必须是“全局注册”的组件名，如 element-plus 的 el-input、el-date-picker 等
					name: "el-input",

					// 绑定的组件参数配置，如 clearable、placeholder 等
					// 组件内 emit 的用 on[name] 接收，如 onChange、onInput、onBlur 等
					props: {
						placeholder: "请输入昵称",
						clearable: true,
						onChange(value: string) {}
					}
				}
			},
			{
				label: "年龄",
				prop: "age",
				component: {
					name: "el-input-number"
				},
				// 默认值，第一次打开有效
				value: 18
			}
		],
		on: {
			// 打开时触发
			open() {},

			// 关闭时触发。当配置该方法时，关闭事件会被阻断，使用 done() 关闭窗口
			close(action, done) {
				// action 为关闭窗口的触发动作 "save" | "close"
				// done 关闭事件
				done();
			},

			// 提交时触发
			submit(data, { done, close }) {
				// data 为表单值
				// done 关闭加载事件、但不关闭窗口
				// close 关闭窗口

				close();
			}
		}
	});
}
</script>
