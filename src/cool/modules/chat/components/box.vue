<template>
	<div class="chat-wrap">
		<!-- 聊天窗口 -->
		<cl-dialog :visible.sync="visible" v-bind="conf">
			<div class="chat-box">
				<!-- 会话区域 -->
				<div class="chat-box__session">
					<div class="chat-box__session-search">
						<el-input
							v-model="session.keyWord"
							placeholder="搜索"
							prefix-icon="el-icon-search"
							size="small"
							clearable
							@clear="onSearch"
							@keyup.enter.native="onSearch"
						></el-input>
					</div>

					<!-- 会话列表 -->
					<ul class="chat-box__session-list scroller1">
						<li
							class="chat-box__session-item"
							v-for="(item, index) in sessionList"
							:key="index"
							:class="{
								'is-active': session.current ? item.id == session.current.id : false
							}"
							@click="sessionDetail(item)"
							@contextmenu.stop.prevent="openSessionCM($event, item.id, index)"
						>
							<!-- 头像 -->
							<div class="avatar">
								<el-badge
									:value="item.serviceUnreadCount"
									:hidden="item.serviceUnreadCount === 0"
									:max="99"
								>
									<img :src="item.headimgurl" alt="" />
								</el-badge>
							</div>

							<!-- 昵称，内容 -->
							<div class="det">
								<p class="name">{{ item.nickname }}</p>
								<p class="content">{{ item.lastMessage }}</p>
							</div>
						</li>
					</ul>
				</div>

				<!-- 会话详情 -->
				<div class="chat-box__detail">
					<template v-if="session.current">
						<div
							class="chat-box__detail-container scroller1"
							ref="scroller"
							v-loading="message.loading"
						>
							<!-- 加载更多 -->
							<div class="chat-box__detail-more" v-if="message.list.length > 0">
								<el-button
									round
									size="mini"
									:loading="message.loading"
									@click="onLoadmore"
									>加载更多</el-button
								>
							</div>

							<!-- 消息列表 -->
							<message :list="message.list" />
						</div>

						<div class="chat-box__detail-footer">
							<!-- 工具栏 -->
							<div class="chat-box__opbar">
								<ul>
									<!-- 表情 -->
									<li>
										<el-popover
											v-model="emoji.visible"
											placement="top-start"
											width="470"
											trigger="click"
										>
											<emoji @select="onEmojiSelect" />
											<img
												slot="reference"
												src="../static/images/emoji.png"
												alt=""
											/>
										</el-popover>
									</li>
									<!-- 图片上传 -->
									<li>
										<cl-upload
											accept="image/*"
											list-type
											:on-success="onImageSelect"
										>
											<img src="../static/images/image.png" alt="" />
										</cl-upload>
									</li>
									<!-- 视频上传 -->
									<li>
										<cl-upload
											accept="video/*"
											list-type
											:before-upload="
												f => {
													onBeforeUpload(f, 'video');
												}
											"
											:on-progress="onUploadProgress"
											:on-success="
												(r, f) => {
													onUploadSuccess(r, f, 'video');
												}
											"
										>
											<img src="../static/images/video.png" alt="" />
										</cl-upload>
									</li>
								</ul>
							</div>

							<!-- 输入框，发送按钮 -->
							<div class="chat-box__input">
								<el-input
									v-model="message.value"
									placeholder="请描述您想咨询的问题"
									type="textarea"
									:rows="5"
									@keyup.enter.native="onTextSend"
								></el-input>

								<el-button
									type="primary"
									size="mini"
									:disabled="!message.value"
									@click="onTextSend"
									>发送</el-button
								>
							</div>
						</div>
					</template>
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
import io from "socket.io-client";
import { isString, debounce } from "cl-admin/utils";
import { mapGetters } from "vuex";
import { socketUrl } from "@/config/env";
import Emoji from "./emoji";
import Message from "./message";
import { parseContent } from "../utils";

// 消息模式
const MODES = ["text", "image", "emoji", "voice", "video"];

export default {
	name: "cl-chat",

	components: {
		Message,
		Emoji
	},

	data() {
		return {
			visible: false,
			conf: {
				title: "聊天对话框",
				props: {
					modal: true,
					"custom-class": "chat-box__wrap",
					"append-to-body": true,
					"close-on-click-modal": false,
					width: "1000px"
				}
			},
			message: {
				list: [],
				pagination: {
					page: 1,
					size: 20,
					total: 0
				},
				loading: false,
				value: ""
			},
			session: {
				list: [],
				pagination: {
					page: 1,
					size: 100,
					total: 0
				},
				current: null,
				keyWord: ""
			},
			emoji: {
				visible: false
			},
			socket: null
		};
	},

	computed: {
		...mapGetters(["userInfo", "token"]),

		sessionList() {
			return this.session.list
				.map(e => {
					let { _text } = parseContent(e);
					e.lastMessage = _text;
					return e;
				})
				.sort((a, b) => {
					return a.updateTime < b.updateTime ? 1 : -1;
				});
		}
	},

	mounted() {
		this.socket = io(`${socketUrl}?isAdmin=true&token=${this.token}`);

		this.socket.on("connect", () => {
			console.log("socket connect");
		});

		this.socket.on("admin", msg => {
			this.onMessage(msg);
		});

		this.socket.on("error", err => {
			console.log(err);
		});

		this.socket.on("disconnect", () => {
			console.log("disconnect connect");
		});
	},

	destroyed() {
		this.socket.close();
	},

	methods: {
		open() {
			this.visible = true;

			this.refreshSession().then(res => {
				this.sessionDetail(res.list[0]);
			});
		},

		close() {
			this.visible = false;
		},

		// 上传前
		onBeforeUpload(file, key) {
			const data = {
				content: {
					[`${key}Url`]: ""
				},
				type: 0,
				contentType: MODES.indexOf(key),
				uid: file.uid,
				loading: true,
				progress: "0%"
			};

			this.append(data);
		},

		// 上传中
		onUploadProgress(e, file) {
			let item = this.message.list.find(e => e.uid == file.uid);

			if (item) {
				item.progress = e.percent + "%";
			}
		},

		// 上传成功
		onUploadSuccess(res, file, key) {
			let item = this.message.list.find(e => e.uid == file.uid);

			if (item) {
				item.loading = false;
				item.content[`${key}Url`] = res.data;

				this.sendMessage(item);
			}
		},

		// 打开会话列表右键菜单
		openSessionCM(e, id, index) {
			this.$crud.openContextMenu(e, {
				list: [
					{
						label: "删除",
						icon: "el-icon-delete",
						callback: (_, done) => {
							this.$service.im.session.delete({
								ids: id
							});

							this.session.list.splice(index, 1);

							if (id == this.session.current.id) {
								this.sessionDetail();
							}

							done();
						}
					}
				]
			});
		},

		// 刷新会话列表
		refreshSession(params) {
			return this.$service.im.session
				.page({
					...this.session.pagination,
					keyWord: this.session.keyWord,
					params,
					order: "updateTime",
					sort: "desc"
				})
				.then(async res => {
					this.session.list = res.list;
					this.session.pagination = res.pagination;

					return res;
				});
		},

		// 刷新详情
		async sessionDetail(item) {
			if (item) {
				let { id } = this.session.current || {};

				if (id != item.id) {
					item.serviceUnreadCount = 0;

					this.conf.title = `与${item.nickname}聊天中`;
					this.message.loading = true;
					this.message.list = [];
					this.session.current = item;

					await this.refreshMessage({ page: 1 });

					this.message.loading = false;
				}

				this.scrollToBottom();
			} else {
				this.conf.title = "聊天对话框";
				this.message.list = [];
				this.session.current = null;
			}
		},

		// 刷新消息列表
		refreshMessage(params) {
			return this.$service.im.message
				.page({
					...this.message.pagination,
					...params,
					sessionId: this.session.current.id,
					order: "createTime",
					sort: "desc"
				})
				.then(res => {
					this.message.pagination = res.pagination;
					this.prepend.apply(this, res.list);
				});
		},

		// 更新会话消息
		updateSession(data) {
			Object.assign(this.session.current, data);
		},

		// 搜索关键字
		onSearch() {
			this.refreshSession({ page: 1 });
		},

		// 加载更多
		onLoadmore() {
			this.refreshMessage({ page: this.message.pagination.page + 1 });
		},

		// 滚动到底部
		scrollToBottom: debounce(function() {
			this.$nextTick(() => {
				if (this.$refs["scroller"]) {
					this.$refs["scroller"].scrollTo(0, 999999);
				}
			});
		}, 300),

		// 发送文本内容
		onTextSend() {
			if (this.message.value) {
				if (this.message.value.replace(/\n/g, "") !== "") {
					const data = {
						type: 0,
						contentType: 0,
						content: {
							text: this.message.value
						}
					};

					this.append(data);
					this.sendMessage(data);

					this.$nextTick(() => {
						this.message.value = "";
					});
				}
			}
		},

		// 图片选择
		onImageSelect(res) {
			const data = {
				content: {
					imageUrl: res.data
				},
				type: 0,
				contentType: 1
			};
			this.append(data);
			this.sendMessage(data);
		},

		// 表情选择
		onEmojiSelect(url) {
			this.emoji.visible = false;
			const data = {
				content: {
					imageUrl: url
				},
				type: 0,
				contentType: 2
			};
			this.append(data);
			this.sendMessage(data);
		},

		// 视频选择
		onVideoSelect(url) {
			const data = {
				content: {
					videoUrl: url
				},
				type: 0,
				contentType: 4
			};
			this.append(data);
			this.sendMessage(data);
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
				const same = this.session.current && this.session.current.userId == fromId;

				if (same) {
					// 更新消息
					this.updateSession({
						contentType,
						content
					});

					// 追加消息
					this.append({
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
				let item = this.session.list.find(e => e.userId == fromId);

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
					this.refreshSession();
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
		},

		// 发送消息
		sendMessage({ contentType, content }) {
			const { id, userId } = this.session.current;

			// 更新消息
			this.updateSession({
				contentType,
				content
			});

			this.socket.emit(`user@${userId}`, {
				contentType,
				type: 0,
				content: JSON.stringify(content),
				sessionId: id
			});
		},

		/**
		 * 处理消息数据
		 * mode: 消息模式
		 * type: 消息类型 0-回复，1-反馈
		 * duration: 时常
		 * videoUrl: 视频地址
		 * videoCoverUrl: 视频封面
		 * imageUrl: 图片地址
		 * avatarUrl: 头像地址
		 * nickName: 昵称
		 */
		handleMessage(e) {
			if (isString(e)) {
				e = JSON.parse(e);
			}

			if (isString(e.content)) {
				e.content = JSON.parse(e.content);
			}

			// 昵称
			const nickName = e.type == 0 ? this.userInfo.nickName : this.session.current.nickname;
			// 头像
			const avatarUrl =
				e.type == 0
					? this.userInfo.avatarUrl || require("../static/images/custom-avatar.png")
					: this.session.current.headimgurl;

			return {
				...e,
				avatarUrl,
				nickName,
				mode: MODES[e.contentType],
				date: dayjs().format("YYYY-MM-DD HH:mm:ss")
			};
		},

		// 追加数据到开头
		prepend(...data) {
			data.map(this.handleMessage).forEach(e => {
				this.message.list.unshift(e);
			});
		},

		// 追加数据到结尾
		append(...data) {
			this.message.list.push(...data.map(this.handleMessage));
			this.scrollToBottom();
		}
	}
};
</script>

<style lang="scss">
.chat-box__wrap {
	height: 650px;
	min-width: 1000px;
	margin-bottom: 0 !important;

	.el-dialog__body {
		height: calc(100% - 46px);
		padding: 0;

		.cl-dialog__container {
			height: 100%;
		}
	}
}

.chat-box {
	display: flex;
	height: 100%;
	background-color: #f7f7f7;

	&__session {
		height: calc(100% - 10px);
		width: 250px;
		margin: 5px 0 5px 5px;
		border-radius: 5px;
		background-color: #fff;

		&-search {
			padding: 10px;
		}

		ul {
			height: calc(100% - 52px);
			overflow: auto;

			li {
				display: flex;
				list-style: none;
				padding: 10px;
				border-left: 5px solid #fff;

				.avatar {
					height: 40px;
					width: 40px;
					margin-right: 12px;

					img {
						display: block;
						height: 100%;
						width: 100%;
						border-radius: 3px;
						background-color: #eee;
					}

					.el-badge {
						&__content {
							height: 14px;
							line-height: 14px;
							padding: 0 4px;
							background-color: #fa5151;
							border: 0;
						}
					}
				}

				.det {
					flex: 1;
					.name {
						font-size: 13px;
						margin-top: 1px;
					}

					.content {
						font-size: 12px;
						margin-top: 5px;
						color: #666;
					}

					.name,
					.content {
						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
					}
				}

				&.is-active {
					background-color: #eee;
					border-color: $color-primary;
				}

				&:hover {
					background-color: #eee;
					cursor: pointer;
				}
			}
		}
	}

	&__detail {
		display: flex;
		flex-direction: column;
		flex: 1;
		height: 100%;
		padding: 5px;
		box-sizing: border-box;

		&-container {
			flex: 1;
			border-radius: 5px;
			padding: 10px;
			overflow: auto;
			margin-bottom: 5px;
		}

		&-more {
			display: flex;
			justify-content: center;
			margin-bottom: 20px;
		}

		&-footer {
			background-color: #fff;
			padding: 10px;
			border-radius: 5px;
		}
	}

	&__message {
		flex: 1;
		border-radius: 5px;
	}

	&__opbar {
		margin-bottom: 5px;
		ul {
			display: flex;
			li {
				list-style: none;
				margin-right: 10px;
				cursor: pointer;

				&:hover {
					opacity: 0.7;
				}

				img {
					height: 26px;
					width: 26px;
				}
			}
		}
	}

	&__input {
		position: relative;

		.el-button {
			position: absolute;
			right: 10px;
			bottom: 10px;
		}
	}
}
</style>
