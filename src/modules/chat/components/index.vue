<template>
	<div class="cl-chat__wrap">
		<div class="cl-chat__icon" @click="open">
			<el-badge :value="unCount">
				<el-icon :size="15"><bell-filled /></el-icon>
			</el-badge>
		</div>

		<!-- 弹框 -->
		<cl-dialog
			v-model="visible"
			title="聊天窗口"
			height="630px"
			width="1200px"
			keep-alive
			:close-on-click-modal="false"
			close-on-press-escape
			append-to-body
			:controls="['slot-expand', 'cl-flex1', 'fullscreen', 'close']"
		>
			<div
				class="cl-chat"
				:class="{
					'is-mini': browser.isMini,
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

<script lang="ts" name="cl-chat" setup>
import { nextTick, provide, ref } from "vue";
import dayjs from "dayjs";
import { useCool, config, module, useBrowser } from "/@/cool";
import { useBase } from "/$/base";
import { Notebook, ArrowLeft, BellFilled } from "@element-plus/icons-vue";
import { debounce } from "lodash-es";
// import io from "socket.io-client";
import { Socket } from "socket.io-client";
import ChatMessage from "./message.vue";
import ChatSession from "./session.vue";
import { Chat } from "../types";
import { useStore } from "../store";

const { mitt } = useCool();
const { browser, onScreenChange } = useBrowser();

// 缓存
const { session, message } = useStore();

// 缓存
const { user } = useBase();

// 模块配置
const { options } = module.get("chat");

// 是否可见
const visible = ref(false);

// 是否展开
const isExpand = ref(true);

// 未读消息
const unCount = ref(parseInt(String(Math.random() * 100)));

// Socket
let socket: Socket;

// 连接
function connect() {
	refresh();

	// if (!socket) {
	// 	socket = io(config.host + options.path, {
	// 		auth: {
	// 			token: user.token
	// 		}
	// 	});

	// 	socket.on("connect", () => {
	// 		console.log(`connect ${user.info?.nickName}`);

	// 		// 监听消息
	// 		socket.on("message", (msg) => {
	// 			console.log(msg);
	// 			mitt("chat-message", msg);
	// 		});

	// 		refresh();
	// 	});

	// 	socket.on("disconnect", (err) => {
	// 		console.error(err);
	// 	});
	// }
}

// 打开
function open() {
	visible.value = true;
	connect();
}

// 关闭
function close() {
	visible.value = false;
}

// 收起、展开
function expand(value?: boolean) {
	isExpand.value = value === undefined ? !isExpand.value : value;
}

// 发送消息
function send(data: Chat.Message, isAppend?: boolean) {
	// socket.emit("message", {});

	if (isAppend) {
		append(data);
	}
}

// 追加消息
function append(data: Chat.Message) {
	message.list.push({
		fromId: user.info?.id,
		toId: session.value?.userId,
		avatar: user.info?.headImg,
		nickName: user.info?.nickName,
		createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
		...data
	});

	scrollToBottom();
}

// 滚动到底部
const scrollToBottom = debounce(() => {
	nextTick(() => {
		const box = document.querySelector(".cl-chat .chat-message .list");
		box?.scroll({
			top: 100000 + Math.random(),
			behavior: "smooth"
		});
	});
}, 300);

// 刷新
async function refresh() {
	await session.get();
	await message.get();
	scrollToBottom();
}

provide("chat", {
	get socket() {
		return socket;
	},
	send,
	append,
	expand,
	scrollToBottom
});

// 监听屏幕变化
onScreenChange(() => {
	isExpand.value = browser.isMini ? false : true;
});

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
	color: #000;

	&__icon {
		padding: 5px;
		.el-badge__content {
			transform: translateY(-50%) translateX(100%) scale(0.8) !important;
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
