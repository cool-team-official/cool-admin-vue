<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">group</el-tag>
			<span>分组显示</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/group.vue']" />

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
		title: "分组显示",
		items: [
			{
				//【很重要】必须为 tabs
				type: "tabs",
				props: {
					// 分组样式
					type: "card",
					// 分组列表，必须是 { label, value } 的数组格式
					labels: [
						{
							label: "基础信息", // 标题
							value: "base" // 唯一标识
						},
						{
							label: "认证信息",
							value: "auth"
						}
					]
				}
			},
			// 基础信息
			{
				group: "base", // 标识
				label: "账号",
				prop: "account",
				required: true,
				component: {
					name: "el-input"
				}
			},
			{
				group: "base", // 标识
				label: "密码",
				prop: "password",
				required: true,
				component: {
					name: "el-input"
				}
			},

			// 其他信息 group = other
			{
				group: "auth", // 标识
				label: "身份证",
				prop: "idcard",
				required: true,
				component: {
					name: "el-input"
				}
			},
			{
				group: "auth", // 标识
				label: "学校",
				prop: "school",
				component: {
					name: "el-input"
				}
			},
			{
				group: "auth", // 标识
				label: "专业",
				prop: "major",
				component: {
					name: "el-input"
				}
			}
		],
		on: {
			//【提示】当第一组验证通过后，会自动切换到下一组展示，直到全部通过才可提交
			submit(data, { close }) {
				close();
			}
		}
	});
}
</script>
