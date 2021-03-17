<template>
	<div class="cl-chat__wrap">
		<!-- 聊天窗口 -->
		<cl-dialog
			:visible.sync="visible"
			:title="title"
			:height="height"
			:width="width"
			:props="conf"
		>
			<div class="cl-chat">
				<!-- 会话区域 -->
				<chat-session />

				<!-- 会话详情 -->
				<div class="cl-chat__detail" v-if="session">
					<chat-message />
					<chat-input />
				</div>
			</div>
		</cl-dialog>

		<!-- MP3 -->
		<div class="mp3">
			<audio style="display: none" ref="sound" src="../static/notify.mp3" controls></audio>
		</div>
	</div>
</template>

<script>
import dayjs from "dayjs";
import { mapGetters } from "vuex";
import { parseContent } from "../utils";

import io from "socket.io-client";
import { socketUrl } from "@/config/env";

import Session from "./session";
import Message from "./message";
import Input from "./input";
import eventBus from "../utils/event-bus";

// 消息模式

export default {
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

	data() {
		return {
			visible: false,
			socket: null,
			conf: {
				modal: true,
				customClass: "cl-chat__dialog",
				"append-to-body": true,
				"close-on-click-modal": false
			}
		};
	},

	provide() {
		return {
			socket: this.socket
		};
	},

	computed: {
		...mapGetters(["token", "session", "sessionList"]),

		title() {
			return this.session ? `与 ${this.session.nickname} 聊天中` : "聊天对话框";
		}
	},

	created() {
		// this.socket = io(`${socketUrl}?isAdmin=true&token=${this.token}`);
		// this.socket.on("connect", () => {
		// 	console.log("socket connect");
		// });
		// this.socket.on("admin", msg => {
		// 	this.onMessage(msg);
		// });
		// this.socket.on("error", err => {
		// 	console.log(err);
		// });
		// this.socket.on("disconnect", () => {
		// 	console.log("disconnect connect");
		// });
	},

	destroyed() {
		if (this.socket) {
			this.socket.close();
		}
	},

	methods: {
		open() {
			this.visible = true;
		},

		close() {
			this.visible = false;
		},

		// 监听消息
		onMessage(msg) {
			// 回调
			this.$emit("message", this.visible);

			// 消息通知
			this.notification(msg);

			try {
				const { contentType, fromId, content, msgId } = JSON.parse(msg);

				// 是否当前
				const same = this.session && this.session.userId == fromId;

				if (same) {
					// 更新消息
					this.$store.commit("UPDATE_SESSION", {
						contentType,
						content
					});

					// 追加消息
					eventBus.$emit("message-append", {
						contentType,
						content: JSON.parse(content),
						type: 1
					});

					// 读消息
					this.$service.im.message.read({
						ids: [msgId],
						session: this.session.current.id
					});
				}

				// 查找会话
				const item = this.sessionList.find(e => e.userId == fromId);

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
					eventBus.$emit("session-refresh");
				}
			} catch (e) {
				console.error("消息格式异常", e);
			}
		},

		// 消息通知
		notification(msg) {
			const { _text } = parseContent(JSON.parse(msg));

			// 播放音乐
			if (this.$refs.sound) {
				this.$refs.sound.play();
			}

			if (!this.visible) {
				// 页面消息提示
				this.$notify({
					title: "提示",
					message: this.$createElement("span", _text)
				});

				// 浏览器消息通知
				const NotificationInstance = Notification || window.Notification;
				if (!!NotificationInstance) {
					if (NotificationInstance.permission !== "denied") {
						NotificationInstance.requestPermission(status => {
							let n = new Notification("COOL-MALL", {
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
	}
};
</script>

<style lang="scss">
.cl-chat__dialog {
	margin-bottom: 0 !important;
	min-width: 1000px;

	.el-dialog__body {
		padding: 0;
	}

	&.is-fullscreen {
		.cl-dialog__container {
			height: calc(100vh - 46px) !important;
		}
	}
}

.cl-chat {
	display: flex;
	height: 100%;
	background-color: #f7f7f7;

	&__detail {
		display: flex;
		flex-direction: column;
		flex: 1;
		height: 100%;
		padding: 5px;
		box-sizing: border-box;
	}
}
</style>
