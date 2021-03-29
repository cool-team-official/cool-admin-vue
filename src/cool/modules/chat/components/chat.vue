<template>
	<div class="cl-chat__wrap">
		<!-- 聊天窗口 -->
		<cl-dialog
			v-model="visible"
			:title="title"
			:height="height"
			:width="width"
			:props="{
				modal: true,
				customClass: 'cl-chat__dialog',
				'append-to-body': true,
				'close-on-click-modal': false
			}"
			:controls="['slot-session', 'cl-flex1', 'fullscreen', 'close']"
		>
			<div class="cl-chat">
				<!-- 会话列表 -->
				<chat-session />

				<div class="cl-chat__detail">
					<!-- 消息列表 -->
					<chat-message />

					<template v-if="session">
						<!-- 输入框 -->
						<chat-input />
					</template>
				</div>
			</div>

			<template #slot-session>
				<button v-if="session">
					<i class="el-icon-notebook-2" v-if="sessionVisible" @click="closeSession()"></i>
					<i class="el-icon-arrow-left" v-else @click="openSession()"></i>
				</button>
			</template>
		</cl-dialog>

		<!-- MP3 -->
		<div class="mp3">
			<audio
				style="display: none"
				:ref="setRefs('sound')"
				src="../static/notify.mp3"
				controls
			></audio>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, h, inject, onUnmounted, provide, ref } from "vue";
import { useStore } from "vuex";
import { ElNotification } from "element-plus";
import dayjs from "dayjs";
// import io from "socket.io-client";
// import { socketUrl } from "@/config/env";
import Session from "./session.vue";
import Message from "./message.vue";
import Input from "./input.vue";
import { parseContent } from "../utils";
import { useRefs } from "@/core";

export default defineComponent({
	name: "cl-chat",

	components: {
		"chat-session": Session,
		"chat-message": Message,
		"chat-input": Input
	},

	props: {
		height: {
			type: String,
			default: "650px"
		},
		width: {
			type: String,
			default: "1000px"
		}
	},

	setup(_, { emit }) {
		const store = useStore();
		const { refs, setRefs } = useRefs();
		const $service = inject<any>("service");
		const mitt = inject<any>("mitt");

		// 当前会话
		const session = computed(() => store.getters.session);

		// 会话列表是否可见
		const sessionVisible = computed(() => store.getters.sessionVisible);

		// 消息类型
		const modes = ["text", "image", "emoji", "voice", "video"];

		// 是否可见
		const visible = ref<boolean>(false);

		// socket 实例
		const socket: any = null;

		// 对话框标题
		const title = computed(() => {
			return session.value ? `与 ${session.value.nickname} 聊天中` : "聊天对话框";
		});

		// 打开
		function open() {
			visible.value = true;
		}

		// 关闭
		function close() {
			visible.value = false;
		}

		// 打开会话列表
		function openSession() {
			store.commit("OPEN_SESSION");
		}

		// 关闭会话列表
		function closeSession() {
			store.commit("CLOSE_SESSION");
		}

		// 消息通知
		function notification(msg: string) {
			const { _text } = parseContent(JSON.parse(msg));

			// 播放音乐
			if (refs.value.sound) {
				refs.value.sound.play();
			}

			if (!visible.value) {
				// 页面消息提示
				ElNotification({
					title: "提示",
					message: h("span", _text)
				});

				// 浏览器消息通知
				const NotificationInstance = Notification || window.Notification;
				if (NotificationInstance) {
					if (NotificationInstance.permission !== "denied") {
						NotificationInstance.requestPermission(() => {
							const n = new Notification("COOL-MALL", {
								body: _text,
								icon: "/favicon.ico"
							});

							setTimeout(() => {
								n.close();
							}, 2000);
						});
					}
				}
			}
		}

		// 监听消息
		function onMessage(msg: string) {
			// 回调
			emit("message", msg);

			// 消息通知
			notification(msg);

			try {
				const { contentType, fromId, content, msgId } = JSON.parse(msg);

				// 是否当前
				const same = session.value && session.value.userId == fromId;

				if (same) {
					// 更新消息
					store.commit("UPDATE_SESSION", {
						contentType,
						content
					});

					// 追加消息
					store.commit("APPEND_MESSAGE_LIST", {
						contentType,
						content: JSON.parse(content),
						type: 1
					});

					mitt.emit("message.scrollToBottom");

					// 阅读消息
					$service.im.message.read({
						ids: [msgId],
						session: session.value.id
					});
				}

				// 查找会话
				const item = store.getters.sessionList.find((e: any) => e.userId == fromId);

				if (item) {
					if (!same) {
						item.serviceUnreadCount += 1;
					}
					// 更新消息
					Object.assign(item, {
						updateTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
						contentType,
						content
					});
				} else {
					// 刷新会话列表
					mitt.emit("session.refresh");
				}
			} catch (e) {
				console.error("消息格式异常", e);
			}
		}

		// 加载 socket
		(function() {
			// socket = io(`${socketUrl}?isAdmin=true&token=${store.getters.token}`);
			// socket.on("connect", () => {
			// 	console.log("socket connect");
			// });
			// socket.on("admin", msg => {
			// 	onMessage(msg);
			// });
			// socket.on("error", err => {
			// 	console.log(err);
			// });
			// socket.on("disconnect", () => {
			// 	console.log("disconnect connect");
			// });
		})();

		// 共享参数
		provide("chat", {
			modes,
			socket
		});

		// 销毁
		onUnmounted(function() {
			if (socket) {
				socket.close();
			}
		});

		return {
			refs,
			session,
			sessionVisible,
			visible,
			title,
			setRefs,
			open,
			close,
			openSession,
			closeSession,
			onMessage
		};
	}
});
</script>

<style lang="scss">
.cl-chat__dialog {
	.el-dialog__body {
		padding: 0 !important;
	}
}

.cl-chat {
	display: flex;
	height: 100%;
	background-color: #f7f7f7;
	padding: 5px;
	box-sizing: border-box;

	&__detail {
		display: flex;
		flex-direction: column;
		flex: 1;
		height: 100%;
	}
}
</style>
