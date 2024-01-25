<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">event</el-tag>
			<span>组件事件</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/event.vue']" />

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
import { ElMessage } from "element-plus";

const Form = useForm();

function open() {
	Form.value?.open({
		title: "组件事件",
		items: [
			{
				label: "账号",
				prop: "account",
				component: {
					name: "el-input",
					props: {
						// 组件内 emit 的用 on[name] 接收，如 onChange、onInput、onBlur 等
						// 前提是组件内有触发事件
						onBlur() {
							ElMessage.info("账号检查中");
						}
					}
				}
			},
			{
				label: "是否实名",
				prop: "status",
				value: 1,
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
					],
					props: {
						// 值改变事件
						onChange(val: number) {
							if (val == 1) {
								// 显示表单项
								Form.value?.showItem("idcard");
							} else {
								// 隐藏表单项
								Form.value?.hideItem("idcard");
								// 清空值
								Form.value?.setForm("idcard", undefined);
							}
						}
					}
				}
			},
			{
				label: "身份证",
				prop: "idcard",
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
