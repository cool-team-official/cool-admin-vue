<template>
	<div class="cl-chat__wrap">
		<div class="cl-chat__icon" @click="open">
			<el-badge :value="19">
				<el-icon><BellFilled /></el-icon>
			</el-badge>
		</div>

		<!-- 弹框 -->
		<cl-dialog
			v-model="visible"
			title="聊天窗口"
			height="630px"
			width="1200px"
			keep-alive
			custom-class="cl-chat__dialog"
			:close-on-click-modal="false"
			append-to-body
			:controls="['slot-expand', 'cl-flex1', 'fullscreen', 'close']"
		>
			<div class="cl-chat">
				<chat-session />
				<chat-message />
			</div>

			<!-- 展开按钮 -->
			<template #slot-expand>
				<button class="cl-dialog__controls-icon">
					<el-icon @click="session.visible = false" v-if="session.visible">
						<notebook />
					</el-icon>
					<el-icon @click="session.visible = true" v-else>
						<arrow-left />
					</el-icon>
				</button>
			</template>
		</cl-dialog>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
	name: "cl-chat"
});
</script>

<script lang="ts" setup>
import { provide, ref, watch } from "vue";
import { module } from "/@/cool/utils";
import { useCool } from "/@/cool";
import { useBase } from "/$/base";
import ChatMessage from "./message.vue";
import ChatSession from "./session.vue";
import { Notebook, ArrowLeft, BellFilled } from "@element-plus/icons-vue";

const { service } = useCool();

// 缓存
const { app } = useBase();

// 模块配置
const { options } = module.get("upload");

// 是否可见
const visible = ref<boolean>(false);

// 会话
const session = reactive({
	visible: true,
	list: []
});

// 监听屏幕大小变化
watch(
	() => app.browser.isMini,
	(val) => {
		session.visible = val ? false : true;
	},
	{
		immediate: true
	}
);

// 打开
function open() {
	visible.value = true;
}

// 关闭
function close() {
	visible.value = false;
}

provide("chat", {
	session
});

defineExpose({
	open,
	close
});
</script>

<style lang="scss">
.cl-chat {
	display: flex;
	background-color: #eee;
	height: 100%;
	padding: 5px;
	box-sizing: border-box;

	&__icon {
		.el-badge__content {
			transform: translateY(-50%) translateX(100%) scale(0.8) !important;
		}
	}

	&__dialog {
		.el-dialog__body {
			padding: 0;
		}
	}

	&__footer {
		padding: 9px 0;
	}
}
</style>
