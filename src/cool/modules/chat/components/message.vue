<template>
	<div class="cl-chat-message" v-loading="!visible && loading" element-loading-text="消息加载中">
		<div
			class="cl-chat-message__scroller scroller1"
			ref="scroller"
			:style="{
				opacity: visible ? 1 : 0
			}"
		>
			<!-- 加载更多 -->
			<div class="cl-chat-message__more" v-show="list.length > 0">
				<el-button round size="mini" :loading="loading" @click="onLoadmore"
					>加载更多</el-button
				>
			</div>

			<!-- 消息列表 -->
			<div class="cl-chat-message__list">
				<div
					class="cl-chat-message__item"
					v-for="item in list"
					:key="item.id || item.uid"
					:class="[item.type == 0 ? `is-right` : `is-left`, `is-${item.mode}`]"
				>
					<!-- 日期 -->
					<div class="date" v-if="item._date">
						<span>{{ item._date }}</span>
					</div>

					<!-- 内容 -->
					<div class="main">
						<!-- 头像 -->
						<div class="avatar">
							<img :src="item.avatarUrl" />
						</div>

						<div class="det">
							<!-- 昵称 -->
							<span class="name">{{ item.nickName }}</span>

							<div
								class="content"
								v-loading="item.loading"
								:element-loading-text="item.progress"
								@click="onTap(item)"
							>
								<!-- 文本 -->
								<template v-if="item.mode === 'text'">{{
									item.content.text
								}}</template>

								<!-- 图片 -->
								<template v-else-if="item.mode === 'image'">
									<el-image
										:key="item.uid"
										:src="item.content.imageUrl"
										:preview-src-list="[item.content.imageUrl]"
										:z-index="3000"
										:style="item.style"
									>
										<template #placeholder>
											<img
												:src="item.content.imageUrl"
												:style="item.style"
												alt=""
											/>
										</template>
									</el-image>
								</template>

								<!-- 表情 -->
								<template v-else-if="item.mode === 'emoji'">
									<img :src="item.content.imageUrl" />
								</template>

								<!-- 语音 -->
								<template v-else-if="item.mode === 'voice'">
									<icon-voice :play="item.isPlay"></icon-voice>
									<span class="duration"
										>{{ item.content.duration | duration }}"</span
									>
								</template>

								<!-- 视频 -->
								<template v-else-if="item.mode === 'video'">
									<div class="item">
										<video
											:poster="item.content.videoUrl | video_poster"
											:src="item.content.videoUrl"
											controls
										></video>
									</div>
								</template>

								<!-- 未知 -->
								<template v-else>
									<span>待扩展消息类型</span>
									<i class="el-icon-warning-outline"></i>
								</template>
							</div>
						</div>
					</div>
				</div>

				<!-- 音频 -->
				<div class="voice">
					<audio style="display: none" ref="voice" :src="voice.url" controls></audio>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import dayjs from "dayjs";
import { mapGetters } from "vuex";
import { isString } from "cl-admin/utils";
import eventBus from "../utils/event-bus";
import IconVoice from "./icon-voice";

export default {
	components: {
		IconVoice
	},

	inject: ["chat"],

	data() {
		return {
			loading: false,
			visible: false,
			pagination: {
				page: 1,
				size: 20,
				total: 0
			},
			player: {},
			voice: {
				url: "",
				timer: null
			},
			refreshRd: null
		};
	},

	filters: {
		duration(val) {
			return Math.ceil((val || 1) / 1000);
		}
	},

	computed: {
		...mapGetters(["userInfo", "session", "messageList"]),

		list() {
			let date = "";

			return this.messageList.map(e => {
				// 时间间隔
				e._date = date
					? dayjs(e.createTime).isBefore(dayjs(date).add(1, "minute"))
						? ""
						: e.createTime
					: e.createTime;

				// 发送时间
				date = e.createTime;

				// 解析内容
				if (isString(e)) {
					e = JSON.parse(e);
				}

				if (isString(e.content)) {
					e.content = JSON.parse(e.content);
				}

				// 解析昵称
				const nickName = e.type == 0 ? this.userInfo.nickName : this.session.nickname;

				// 解析头像
				const avatarUrl =
					e.type == 0
						? this.userInfo.avatarUrl || require("../static/images/custom-avatar.png")
						: this.session.headimgurl;

				return {
					...e,
					avatarUrl,
					nickName,
					mode: this.chat.modes[e.contentType]
				};
			});
		}
	},

	created() {
		// 监听列表刷新
		eventBus.$on("message.refresh", this.refresh);

		// 滚动到底部
		eventBus.$on("message.scrollToBottom", this.scrollToBottom);

		if (this.session) {
			this.refresh();
		}
	},

	destroyed() {
		clearTimeout(this.voice.timer);

		this.messageList.map(e => {
			e.isPlay = false;
		});
	},

	methods: {
		// 点击
		onTap(item) {
			// 播放语音
			if (item.mode == "voice") {
				this.messageList.map(e => {
					this.$set(e, "isPlay", e.id == item.id ? e.isPlay : false);
				});

				item.isPlay = !item.isPlay;

				if (item.isPlay) {
					this.voice.url = item.content.voiceUrl;

					this.$nextTick(() => {
						this.$refs["voice"].play();
					});
				} else {
					this.$refs["voice"].pause();
					item.isPlay = false;
				}

				clearTimeout(this.voice.timer);

				this.voice.timer = setTimeout(() => {
					item.isPlay = false;
				}, item.content.duration);
			}
		},

		// 刷新列表
		refresh(params) {
			// 请求随机值
			const rd = (this.refreshRd = Math.random());

			// 请求参数
			const data = {
				...this.pagination,
				...params,
				sessionId: this.session.id,
				order: "createTime",
				sort: "desc"
			};

			// 加载动画
			this.loading = true;

			// 首页处理
			if (data.page === 1) {
				this.visible = false;
				this.$store.commit("CLEAR_MESSAGE_LIST");
			}

			// 完成
			const done = () => {
				this.loading = false;
				this.visible = true;
			};

			this.$service.im.message
				.page(data)
				.then(res => {
					// 防止脏数据
					if (rd != this.refreshRd) {
						return false;
					}

					// 分页信息
					this.pagination = res.pagination;
					// 追加数据
					this.$store.commit("PREPEND_MESSAGE_LIST", res.list);

					if (data.page === 1) {
						this.scrollToBottom();

						// 首次滚动隐藏
						setTimeout(done, 0);
					} else {
						done();
					}
				})
				.catch(() => {
					this.$message.error(err);
					done();
				});
		},

		// 加载更多
		onLoadmore() {
			this.refresh({ page: this.pagination.page + 1 });
		},

		// 滚动到底部
		scrollToBottom() {
			this.$nextTick(() => {
				if (this.$refs["scroller"]) {
					this.$refs["scroller"].scrollTo({
						top: 99999,
						behavior: this.visible ? "smooth" : "auto"
					});
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-chat-message {
	height: calc(100% - 5px);
	overflow: hidden;
	margin-bottom: 5px;

	&__scroller {
		height: calc(100% - 10px);
		border-radius: 5px;
		margin: 5px 0px 5px 5px;
		padding: 10px;
		box-sizing: border-box;
	}

	&__more {
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
	}

	&__item {
		margin-bottom: 20px;

		.date {
			text-align: center;
			margin: 10px 0;

			span {
				background-color: #dadada;
				font-size: 12px;
				color: #fff;
				border-radius: 3px;
				padding: 3px 5px 2px 5px;
				letter-spacing: 1px;
			}
		}

		.main {
			display: flex;

			.avatar {
				flex-shrink: 0;

				img {
					display: block;
					height: 40px;
					width: 40px;
					border-radius: 3px;
					background-color: #fff;
				}
			}

			.det {
				display: flex;
				flex-direction: column;
				max-width: 60%;

				.name {
					margin-bottom: 5px;
				}

				.content {
					display: inline-block;
					border-radius: 8px;
					box-sizing: border-box;
					font-size: 12px;
				}
			}
		}

		&.is-left {
			.main {
				.det {
					margin-left: 10px;
					align-items: flex-start;

					.content {
						border-top-left-radius: 0;
						background-color: #fff;
					}
				}
			}

			&.is-voice {
				.content {
					justify-content: flex-start;
				}
			}
		}

		&.is-right {
			.main {
				flex-direction: row-reverse;

				.det {
					margin-right: 10px;
					align-items: flex-end;

					.content {
						border-top-right-radius: 0;
						background-color: $color-primary;
						color: #fff;
					}
				}
			}

			&.is-voice {
				.content {
					justify-content: flex-end;
				}
			}
		}

		&.is-text {
			.content {
				max-width: 100%;
				min-width: 40px;
				word-wrap: break-word;
			}
		}

		&.is-text,
		&.is-voice {
			.content {
				padding: 10px;
				line-height: 20px;
				letter-spacing: 1px;
			}
		}

		&.is-emoji {
			.content {
				padding: 10px;

				img {
					height: 20px;
					width: 20px;
				}
			}
		}

		&.is-voice {
			.content {
				display: flex;
				align-items: center;
				width: 65px;
				cursor: pointer;

				&:hover {
					opacity: 0.8;
				}
			}
		}

		&.is-video {
			.item {
				video {
					display: block;
					max-width: 300px;
					max-height: 300px;
					border-radius: 10px;
				}
			}
		}

		&.is-image {
			.main {
				.det {
					.content {
						background-color: #fff;

						/deep/.el-image {
							display: block;
							border-radius: 6px;
							max-width: 200px;
							min-width: 80px;
						}
					}
				}
			}
		}

		&.is-undefined {
			.main {
				.det {
					.content {
						display: flex;
						align-items: center;
						padding: 10px;
						letter-spacing: 1px;
						background-color: #f56c6c;
						color: #fff;

						.el-icon-warning-outline {
							font-size: 15px;
							margin-left: 4px;
						}
					}
				}
			}
		}
	}
}
</style>
