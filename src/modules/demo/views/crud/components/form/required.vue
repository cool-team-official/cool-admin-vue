<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">required</el-tag>
			<span>必填项配置</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/required.vue']" />

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
		title: "必填项配置",
		items: [
			{
				label: "昵称",
				prop: "nickname",
				component: {
					name: "el-input"
				},
				// 是否必填，默认判断绑定值是否空
				required: true
			},
			{
				label: "手机号",
				prop: "phone",
				component: {
					name: "el-input",
					props: {
						maxlength: 11
					}
				},
				// 自定义规则
				// 基础用法可参考：https://element-plus.gitee.io/zh-CN/component/form.html
				// 高级用法可参考：https://github.com/yiminghe/async-validator
				rules: [
					{
						required: true,
						validator: (rule, value, callback) => {
							if (value === "") {
								callback(new Error("手机号不能为空"));
							} else if (!/^1[3456789]\d{9}$/.test(value)) {
								callback(new Error("手机号格式错误"));
							} else {
								callback();
							}
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
