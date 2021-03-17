<template>
	<div class="cl-chat-input">
		<!-- 工具栏 -->
		<div class="cl-chat-input__opbar">
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
						<img slot="reference" src="../static/images/emoji.png" alt="" />
					</el-popover>
				</li>
				<!-- 图片上传 -->
				<li hidden>
					<cl-upload accept="image/*" list-type :on-success="onImageSelect">
						<img src="../static/images/image.png" alt="" />
					</cl-upload>
				</li>
				<!-- 视频上传 -->
				<li hidden>
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
		<div class="cl-chat-input__content">
			<el-input
				v-model="value"
				placeholder="请描述您想咨询的问题"
				type="textarea"
				:rows="5"
				@keyup.enter.native="onTextSend"
			></el-input>

			<el-button type="primary" size="mini" :disabled="!value" @click="onTextSend"
				>发送</el-button
			>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import Emoji from "./emoji";
import eventBus from "../utils/event-bus";

export default {
	components: {
		Emoji
	},

	inject: ["socket"],

	data() {
		return {
			value: "",
			emoji: {
				visible: false
			}
		};
	},

	computed: {
		...mapGetters(["session"])
	},

	methods: {
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
			const item = this.message.list.find(e => e.uid == file.uid);

			if (item) {
				item.progress = e.percent + "%";
			}
		},

		// 上传成功
		onUploadSuccess(res, file, key) {
			const item = this.message.list.find(e => e.uid == file.uid);

			if (item) {
				item.loading = false;
				item.content[`${key}Url`] = res.data;

				this.send(item);
			}
		},

		// 发送文本内容
		onTextSend() {
			if (this.value) {
				if (this.value.replace(/\n/g, "") !== "") {
					const data = {
						type: 0,
						contentType: 0,
						content: {
							text: this.value
						}
					};

					this.send(data, true);

					this.$nextTick(() => {
						this.value = "";
					});
				}
			}
		},

		// 图片选择
		onImageSelect(res) {
			this.send(
				{
					content: {
						imageUrl: res.data
					},
					type: 0,
					contentType: 1
				},
				true
			);
		},

		// 表情选择
		onEmojiSelect(url) {
			this.emoji.visible = false;
			this.send(
				{
					content: {
						imageUrl: url
					},
					type: 0,
					contentType: 2
				},
				true
			);
		},

		// 视频选择
		onVideoSelect(url) {
			this.send(
				{
					content: {
						videoUrl: url
					},
					type: 0,
					contentType: 4
				},
				true
			);
		},

		// 发送消息
		send(data, isAppend) {
			const { id, userId } = this.session;

			// 更新消息
			// this.updateSession({
			// 	contentType,
			// 	content
			// });

			if (this.socket) {
				this.socket.emit(`user@${userId}`, {
					contentType: data.contentType,
					type: 0,
					content: JSON.stringify(data.content),
					sessionId: id
				});

				if (isAppend) {
					this.append(data);
				}
			}

			if (isAppend) {
				this.append(data);
			}
		},

		// 追加消息
		append(data) {
			eventBus.$emit("message-append", data);
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-chat-input {
	background-color: #fff;
	padding: 10px;
	border-radius: 3px;

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

	&__content {
		position: relative;

		.el-button {
			position: absolute;
			right: 10px;
			bottom: 10px;
		}
	}
}
</style>
