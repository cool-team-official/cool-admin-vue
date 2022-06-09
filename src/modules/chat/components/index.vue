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
			<div
				class="cl-chat"
				:class="{
					'is-mini': app.browser.isMini,
					'is-expand': isExpand
				}"
			>
				<div class="cl-chat__session">
					<chat-session />
				</div>

				<div class="cl-chat__right">
					<chat-message />
				</div>
			</div>

			<!-- 展开按钮 -->
			<template #slot-expand>
				<button class="cl-dialog__controls-icon">
					<el-icon @click="isExpand = true" v-if="!isExpand">
						<notebook />
					</el-icon>
					<el-icon @click="isExpand = false" v-else>
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
import { nextTick, provide, ref, watch } from "vue";
import { module } from "/@/cool/utils";
import { useCool } from "/@/cool";
import { useBase } from "/$/base";
import ChatMessage from "./message.vue";
import ChatSession from "./session.vue";
import { Notebook, ArrowLeft, BellFilled } from "@element-plus/icons-vue";
import { debounce } from "lodash";

const { service } = useCool();

// 缓存
const { app } = useBase();

// 模块配置
const { options } = module.get("upload");

// 是否可见
const visible = ref(false);

// 是否展开
const isExpand = ref(true);

// 聊天
const chat = reactive({
	inputValue: "",
	session: {
		loading: false,
		value: null,
		list: []
	},
	message: {
		loading: false,
		list: [],
		pagination: {}
	},
	// 滚动到底部
	scrollToBottom: debounce(() => {
		nextTick(() => {
			const box = document.querySelector(".cl-chat .chat-message .list");
			box?.scroll({
				top: 100000 + Math.random(),
				behavior: "smooth"
			});
		});
	}, 300),
	// 获取会话列表
	async getSession() {
		this.session.loading = true;
		await service.im.session.page().then((res) => {
			chat.session.list = res.list;

			// 默认加载第一个会话的消息
			if (!this.session.value) {
				this.setSession(res.list[0]);
			}
		});
		this.session.loading = false;
	},
	// 设置会话
	async setSession(data: any) {
		// 清空消息列表
		this.message.list = [];
		// 设置值
		this.session.value = data;
		// 获取消息
		await this.getMessage();
		// 滚动到底
		this.scrollToBottom();
	},
	// 获取消息
	async getMessage() {
		this.message.loading = true;
		await service.im.message.page().then((res) => {
			chat.message.list = res.list;
			chat.message.pagination = res.pagination;
		});
		this.message.loading = false;
	}
});

// 监听屏幕大小变化
watch(
	() => app.browser.isMini,
	(val) => {
		isExpand.value = val ? false : true;
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

provide("chat", chat);

defineExpose({
	open,
	close
});
</script>

<style lang="scss">
.cl-chat {
	display: flex;
	justify-content: flex-end;
	background-color: #eee;
	height: 100%;
	padding: 5px;
	box-sizing: border-box;
	position: relative;

	&__icon {
		padding: 5px;
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

	&__session {
		height: calc(100% - 10px);
		width: 345px;
		position: absolute;
		left: 5px;
		top: 5px;
	}

	&__right {
		position: relative;
		z-index: 99;
		transition: width 0.3s;
		width: 100%;
	}

	&.is-mini {
		&.is-expand {
			.cl-chat__session {
				z-index: 100;
			}
		}

		.cl-chat__session {
			width: calc(100% - 10px);
		}

		.cl-chat__right {
			width: 100% !important;
		}
	}

	&.is-expand {
		.cl-chat__right {
			width: calc(100% - 350px);
		}
	}
}
</style>
