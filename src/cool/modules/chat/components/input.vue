<template>
	<div class="cl-chat-input">
		<!-- 工具栏 -->
		<div class="cl-chat-input__opbar">
			<ul>
				<!-- 表情 -->
				<li>
					<emoji @select="onEmojiSelect" />
				</li>
				<!-- 图片上传 -->
				<li>
					<cl-upload
						accept="image/*"
						list-type
						:before-upload="
							file => {
								onBeforeUpload(file, 'image');
							}
						"
						:on-progress="onUploadProgress"
						:on-success="
							(res, file) => {
								onUploadSuccess(res, file, 'image');
							}
						"
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
							file => {
								onBeforeUpload(file, 'video');
							}
						"
						:on-progress="onUploadProgress"
						:on-success="
							(res, file) => {
								onUploadSuccess(res, file, 'video');
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
				v-model="text"
				placeholder="请描述您想咨询的问题"
				type="textarea"
				resize="none"
				:rows="5"
				@keyup.enter.native="onTextSend"
			></el-input>

			<el-button type="primary" size="mini" :disabled="!text" @click="onTextSend"
				>发送</el-button
			>
		</div>
	</div>
</template>

<script>
import { mapMutations } from "vuex";
import Emoji from "./emoji";

export default {
	components: {
		Emoji
	},

	inject: ["chat"],

	data() {
		return {
			text: "",
			emoji: {
				visible: false
			}
		};
	},

	methods: {
		...mapMutations(["UPDATE_SESSION", "UPDATE_MESSAGE", "APPEND_MESSAGE_LIST"]),

		// 上传前，获取图片预览地址
		onBeforeUpload(file, key) {
			// 先添加到列表中，等待上传
			const next = (options = {}) => {
				const data = {
					content: {
						[`${key}Url`]: ""
					},
					type: 0,
					uid: file.uid,
					loading: true,
					progress: "0%",
					contentType: this.chat.modes.indexOf(key),
					...options
				};

				this.append(data);
			};

			// 图片预览
			if (key == "image") {
				const fileReader = new FileReader();

				fileReader.onload = e => {
					const imageUrl = e.target.result;
					const image = new Image();

					image.onload = () => {
						let height = 0;
						let width = 0;

						if (image.width > 200) {
							width = 200;
							height = (image.height * 200) / image.width;
						}

						next({
							content: {
								imageUrl
							},
							style: {
								height: height + "px",
								width: width + "px"
							}
						});
					};

					image.src = imageUrl;
				};

				fileReader.readAsDataURL(file);
			} else {
				next();
			}
		},

		// 上传中
		onUploadProgress(e, file) {
			this.UPDATE_MESSAGE({
				file,
				data: {
					progress: e.percent + "%"
				}
			});
		},

		// 上传成功
		onUploadSuccess(res, file, key) {
			this.UPDATE_MESSAGE({
				file,
				data: {
					loading: false,
					content: {
						[`${key}Url`]: res.data
					}
				},
				callback: this.send
			});
		},

		// 发送文本内容
		onTextSend() {
			if (this.text) {
				if (this.text.replace(/\n/g, "") !== "") {
					const data = {
						type: 0,
						contentType: 0,
						content: {
							text: this.text
						}
					};

					this.send(data, true);

					this.$nextTick(() => {
						this.text = "";
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
			const { id, userId } = this.$store.getters.session;

			// 更新会话消息
			this.UPDATE_SESSION(data);

			// 发送消息
			if (this.chat.socket) {
				this.chat.socket.emit(`user@${userId}`, {
					contentType: data.contentType,
					type: 0,
					content: JSON.stringify(data.content),
					sessionId: id
				});
			}

			// 是否添加到列表中
			if (isAppend) {
				this.append(data);
			}
		},

		// 追加消息
		append(data) {
			this.APPEND_MESSAGE_LIST(data);
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

				/deep/ img {
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
			right: 15px;
			bottom: 10px;
		}
	}
}
</style>
