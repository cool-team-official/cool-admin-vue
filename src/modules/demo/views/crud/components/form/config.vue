<template>
	<div class="scope">
		<div class="h">
			<el-tag size="small" effect="dark">config</el-tag>
			<span>参数配置</span>
		</div>

		<div class="c">
			<el-button @click="open">预览</el-button>
			<demo-code :files="['form/config.vue']" />

			<!-- 自定义表单组件 -->
			<cl-form ref="Form">
				<!-- 按钮插槽 -->
				<template #slot-btns>
					<el-button type="danger">按钮插槽</el-button>
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

const Form = useForm();

function open() {
	Form.value?.open({
		title: "参数配置",

		// 打开是否重置表单
		isReset: false,

		// 默认表单值
		form: {
			nickName: "神仙都没用"
		},

		// 表单配置
		props: {
			// 标签宽度
			labelWidth: "120px",

			// 标签位置
			labelPosition: "top"
		},

		// 窗口的高。配置后，在窗口内部滚动。默认整个页面滚动
		height: "60vh",

		// 窗口的宽，默认 50%
		width: "60%",

		// 窗口设置
		dialog: {
			// 是否隐藏头部
			hideHeader: false,

			// 顶部操作按钮，默认["fullscreen", "close"]
			// fullscreen 全屏
			// close 关闭
			controls: ["close"]
		},

		// 底部操作按钮
		op: {
			// 默认靠右布局
			justify: "flex-end",

			// 保存按钮文字
			saveButtonText: "提交",

			// 关闭按钮文字
			closeButtonText: "关闭",

			// 是否隐藏
			hidden: false,

			// 按钮配置
			buttons: [
				// 自定义
				{
					label: "自定义按钮",
					onClick() {
						ElMessage.success("自定义按钮点击");
					}
				},
				// close 关闭
				"close",
				// save 保存
				"save",
				// 插槽使用，配合 template，往上看 cl-form 组件
				"slot-btns"
			]
		},

		// 表单项配置
		items: [
			{
				label: "昵称",
				prop: "nickName",
				component: {
					name: "el-input"
				}
			}
		],

		// 事件
		on: {
			submit(data, { close }) {
				close();
			}
		}
	});
}
</script>
