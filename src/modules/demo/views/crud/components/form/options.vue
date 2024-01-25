<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">options</el-tag>
			<span>选项框配置</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/options.vue']" />

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
import { computed, reactive } from "vue";

const Form = useForm();

// 觉得麻烦就 any，如 { user: [] as any[] }
const options = reactive<{ [key: string]: { label: string; value: any }[] }>({
	user: []
});

function open() {
	Form.value?.open({
		title: "选项框配置",
		items: [
			{
				label: "下拉框",
				prop: "select",
				component: {
					name: "el-select",
					props: {
						clearable: true // 可清除
					},
					options: [
						{
							label: "javascript",
							value: 1
						},
						{
							label: "vue",
							value: 2
						},
						{
							label: "html",
							value: 3
						},
						{
							label: "css",
							value: 4
						}
					]
				}
			},
			{
				label: "单选框",
				prop: "radio",
				value: 1,
				component: {
					name: "el-radio-group",
					options: [
						{
							label: "手机",
							value: 1
						},
						{
							label: "电脑",
							value: 2
						},
						{
							label: "电视",
							value: 3
						}
					]
				}
			},
			{
				label: "多选框",
				prop: "checkbox",
				value: [2, 3],
				component: {
					name: "el-checkbox-group",
					options: [
						{
							label: "咖啡",
							value: 1
						},
						{
							label: "汉堡",
							value: 2
						},
						{
							label: "炸鸡",
							value: 3
						},
						{
							label: "奶茶",
							value: 4
						}
					]
				}
			},
			{
				label: "动态配置1",
				prop: "d1",
				component: {
					name: "el-select",
					// 动态设置方法1，在 on.open 事件配置 options
					options: []
				}
			},
			{
				label: "动态配置2",
				prop: "d2",
				component: {
					name: "el-select",
					// 动态设置方法2，使用 computed 更新 options
					options: computed(() => options.user)
				}
			}
		],
		on: {
			open() {
				// 模拟 1.5s 后取的数据
				setTimeout(() => {
					// 动态设置方法1，使用 setOptions 方法设置
					// d1 为 prop 值
					Form.value?.setOptions("d1", [
						{
							label: "😊",
							value: 1
						},
						{
							label: "😭",
							value: 2
						},
						{
							label: "😘",
							value: 3
						}
					]);

					// 动态设置方法2，直接设置 options.user，由 computed 更新
					options.user = [
						{
							label: "💰",
							value: 1
						},
						{
							label: "🚗",
							value: 2
						}
					];
				}, 1500);
			},
			submit(data, { close }) {
				close();
			}
		}
	});
}
</script>
