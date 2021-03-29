<template>
	<div class="cl-chat-message" v-loading="!visible && loading" element-loading-text="消息加载中">
		<div
			class="cl-chat-message__scroller scroller1"
			:ref="setRefs('scroller')"
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
									<span class="duration">{{ item.content.duration }}"</span>
								</template>

								<!-- 视频 -->
								<template v-else-if="item.mode === 'video'">
									<div class="item">
										<video
											:poster="item.content.videoUrl"
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

<script lang="ts">
import { computed, defineComponent, inject, nextTick, onUnmounted, reactive, ref } from "vue";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { isString } from "@/core/utils";
import IconVoice from "./icon-voice.vue";
import { useRefs } from "@/core";

export default defineComponent({
	components: {
		IconVoice
	},

	setup() {
		const store = useStore();
		const { refs, setRefs } = useRefs();
		const $service = inject<any>("service");
		const chat = inject<any>("chat");
		const mitt = inject<any>("mitt");

		// 当前会话信息
		const session = computed(() => store.getters.session);

		// 加载状态
		const loading = ref<boolean>(false);

		// 是否可见
		const visible = ref<boolean>(false);

		// 分页信息
		const pagination = reactive<any>({
			page: 1,
			size: 20,
			total: 0
		});

		// 语音
		const voice = reactive<any>({
			url: "",
			timer: null
		});

		// 请求随机值
		const refreshRd = ref<any>(null);

		// 消息列表
		const list = computed(() => {
			const { userInfo, messageList } = store.getters;

			let date = "";

			return messageList.map((e: any) => {
				// 时间间隔
				const _date = date
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

				// 内容
				const content = isString(e.content) ? JSON.parse(e.content) : e.content;

				// 昵称
				const nickName = e.type == 0 ? userInfo.nickName : session.value.nickname;

				// 头像
				const avatarUrl =
					e.type == 0
						? userInfo.avatarUrl || require("../static/images/custom-avatar.png")
						: session.value.headimgurl;

				return {
					...e,
					_date,
					content,
					avatarUrl,
					nickName,
					mode: chat.modes[e.contentType]
				};
			});
		});

		// 点击
		function onTap(item: any) {
			// 播放语音
			if (item.mode == "voice") {
				store.getters.messageList.map((e: any) => {
					e.isPlay = e.id == item.id ? e.isPlay : false;
				});

				item.isPlay = !item.isPlay;

				if (item.isPlay) {
					voice.url = item.content.voiceUrl;

					nextTick(() => {
						refs.value.voice.play();
					});
				} else {
					refs.value.voice.pause();
					item.isPlay = false;
				}

				clearTimeout(voice.timer);

				voice.timer = setTimeout(() => {
					item.isPlay = false;
				}, item.content.duration);
			}
		}

		// 滚动到底部
		function scrollToBottom() {
			nextTick(() => {
				if (refs.value.scroller) {
					refs.value.scroller.scrollTo({
						top: 99999,
						behavior: visible.value ? "smooth" : "auto"
					});
				}
			});
		}

		// 刷新列表
		function refresh(params?: any) {
			// 请求随机值
			const rd = (refreshRd.value = Math.random());

			// 请求参数
			const data = {
				...pagination,
				...params,
				sessionId: session.value.id,
				order: "createTime",
				sort: "desc"
			};

			// 加载动画
			loading.value = true;

			// 首页处理
			if (data.page === 1) {
				visible.value = false;
				store.commit("CLEAR_MESSAGE_LIST");
			}

			// 完成
			const done = () => {
				loading.value = false;
				visible.value = true;
			};

			$service.im.message
				.page(data)
				.then((res: any) => {
					// 防止脏数据
					if (rd != refreshRd.value) {
						return false;
					}

					// 分页信息
					Object.assign(pagination, res.pagination);

					// 追加数据
					store.commit("PREPEND_MESSAGE_LIST", res.list);

					if (data.page === 1) {
						scrollToBottom();

						// 首次滚动隐藏
						setTimeout(done, 0);
					} else {
						done();
					}
				})
				.catch((err: string) => {
					ElMessage.error(err);
					done();
				});
		}

		// 加载更多
		function onLoadmore() {
			refresh({ page: pagination.page + 1 });
		}

		// 监听列表刷新
		mitt.on("message.refresh", refresh);
		// 滚动到底部
		mitt.on("message.scrollToBottom", scrollToBottom);

		// 销毁
		onUnmounted(function() {
			// 移除语音播放
			clearTimeout(voice.timer);

			list.value.map((e: any) => {
				e.isPlay = false;
			});

			// 移除事件
			mitt.off("message.refresh", refresh);
			mitt.off("message.scrollToBottom", scrollToBottom);
		});

		return {
			refs,
			chat,
			session,
			loading,
			visible,
			pagination,
			voice,
			list,
			setRefs,
			onTap,
			refresh,
			onLoadmore,
			scrollToBottom
		};
	}
});
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

						:deep(.el-image) {
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
