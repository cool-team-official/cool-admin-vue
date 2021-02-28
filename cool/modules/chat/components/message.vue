<template>
	<div class="chat-box-message">
		<div
			class="chat-box-message__item"
			v-for="item in flist"
			:key="item.id || item.uid"
			:class="[item.type == 0 ? `is-right` : `is-left`, `is-${item.mode}`]"
		>
			<div class="date" v-if="item._date">
				<span>{{ item._date }}</span>
			</div>

			<div class="main">
				<div class="avatar" @tap="toUserDetail(item)">
					<el-image :src="item.avatarUrl"></el-image>
				</div>

				<div class="det">
					<span class="name">{{ item.nickName }}</span>

					<div
						class="content"
						v-loading="item.loading"
						:element-loading-text="item.progress"
						@click="tapItem(item)"
					>
						<!-- 文本 -->
						<template v-if="item.mode === 'text'">{{ item.content.text }}</template>

						<!-- 图片 -->
						<template v-else-if="item.mode === 'image'">
							<el-image
								:key="item.uid"
								:src="item.content.imageUrl"
								:preview-src-list="[item.content.imageUrl]"
							></el-image>
						</template>

						<!-- 表情 -->
						<template v-else-if="item.mode === 'emoji'">
							<img :src="item.content.imageUrl" />
						</template>

						<!-- 语音 -->
						<template v-else-if="item.mode === 'voice'">
							<icon-voice :play="item.isPlay"></icon-voice>
							<span class="duration">{{ item.content.duration | duration }}"</span>
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

		<!-- voice -->
		<div class="voice">
			<audio style="display: none" ref="voice" :src="voice.url" controls></audio>
		</div>
	</div>
</template>

<script>
import dayjs from "dayjs";
import IconVoice from "./icon-voice";

export default {
	components: {
		IconVoice
	},

	props: {
		list: Array
	},

	data() {
		return {
			player: {},
			voice: {
				url: "",
				timer: null
			}
		};
	},

	filters: {
		duration(val) {
			return Math.ceil((val || 1) / 1000);
		}
	},

	destroyed() {
		clearTimeout(this.voice.timer);

		this.list.map((e) => {
			e.isPlay = false;
		});
	},

	computed: {
		flist() {
			let date = "";

			return this.list.map((e) => {
				e._date = date
					? dayjs(e.createTime).isBefore(dayjs(date).add(1, "minute"))
						? ""
						: e.createTime
					: e.createTime;

				date = e.createTime;

				return e;
			});
		}
	},

	methods: {
		tapItem(item) {
			if (item.mode == "voice") {
				this.list.map((e) => {
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
		}
	}
};
</script>

<style lang="scss" scoped>
.chat-box-message {
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
				padding: 2px 5px;
				letter-spacing: 1px;
			}
		}

		.main {
			display: flex;

			.avatar {
				flex-shrink: 0;
				height: 40px;
				width: 40px;

				.el-image {
					border-radius: 3px;
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
						background-color: $color-main;
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
					max-width: 300px;
					max-height: 300px;
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
