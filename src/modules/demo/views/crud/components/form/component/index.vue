<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">component</el-tag>
			<span>组件渲染</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code
				:files="[
					'form/component/index.vue',
					'form/component/select-labels.vue',
					'form/component/select-status.vue',
					'form/component/select-work.vue',
					'form/component/select-work2.vue'
				]"
			/>

			<!-- 自定义表单组件 -->
			<cl-form ref="Form">
				<!-- 年龄插槽 -->
				<template #slot-age="{ scope }">
					<!-- scope 为表单值 -->
					<el-input-number v-model="scope.age" :min="18" :max="100"></el-input-number>
				</template>
			</cl-form>
		</div>

		<div class="f">
			<span class="date">2024-01-01</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useForm } from "@cool-vue/crud";
import { ElMessage } from "element-plus";
import SelectWork from "./select-work2.vue";
import SelectLabels from "./select-labels.vue";
import SelectStatus from "./select-status.vue";

const Form = useForm();

function open() {
	Form.value?.open({
		title: "组件配置",

		items: [
			{
				label: "昵称",
				prop: "name",
				// 组件配置方式1：标签名（方便，但是不建议组件全局注册）
				value: "神仙",
				component: {
					// 必须是“全局注册”的组件名，如 element-plus 的 el-input、el-date-picker 等
					name: "el-input"
				}
			},
			{
				label: "年龄",
				prop: "age",
				// 组件配置方式2：插槽（万能，就是代码多写点）
				value: 18,
				component: {
					// 必须是 "slot-" 开头
					name: "slot-age"
				}
			},
			// -- start 组件配置方式3：组件实例（不想全局注册，但又想组件化）
			{
				label: "工作",
				prop: "work",
				value: "设计",
				component: {
					// 双向绑定
					vm: SelectWork
				}
			},
			{
				label: "标签",
				prop: "labels",
				value: ["多金", "深情"],
				component: {
					// scope[prop]绑定
					vm: SelectLabels
				}
			},
			{
				label: "状态",
				prop: "status",
				value: 1,
				component: {
					// useForm 绑定
					vm: SelectStatus
				}
			}
			// -- end
		],
		on: {
			submit(data, { close }) {
				ElMessage.info(
					`${data.name || "无名"}（${data.age || 18}岁）工作：${data.work || "无"}`
				);
				close();
			}
		}
	});
}
</script>
