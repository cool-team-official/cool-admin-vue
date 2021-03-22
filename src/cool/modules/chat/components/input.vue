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
							f => {
								onBeforeUpload(f, 'image');
							}
						"
						:on-progress="onUploadProgress"
						:on-success="
							(r, f) => {
								onUploadSuccess(r, f, 'image');
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
				resize="none"
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

export default {
	components: {
		Emoji
	},

	inject: ["chat"],

	data() {
		return {
			value: "",
			emoji: {
				visible: false
			}
		};
	},

	computed: {
		...mapGetters(["session", "messageList"])
	},

	methods: {
		// 上传前，获取图片预览地址
		onBeforeUpload(file, key) {
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

			if (key == "image") {
				const fileReader = new FileReader();

				fileReader.onload = e => {
					next({
						content: {
							imageUrl: e.target.result
						}
					});
				};

				fileReader.readAsDataURL(file);
			} else {
				next();
			}
		},

		// 上传中
		onUploadProgress(e, file) {
			const item = this.messageList.find(e => e.uid == file.uid);

			if (item) {
				item.progress = e.percent + "%";
			}
		},

		// 上传成功
		onUploadSuccess(res, file, key) {
			const item = this.messageList.find(e => e.uid == file.uid);

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
			this.$store.commit("UPDATE_SESSION", data);

			if (this.chat.socket) {
				this.chat.socket.emit(`user@${userId}`, {
					contentType: data.contentType,
					type: 0,
					content: JSON.stringify(data.content),
					sessionId: id
				});
			}

			if (isAppend) {
				this.append(data);
			}
		},

		// 追加消息
		append(data) {
			this.$store.commit("APPEND_MESSAGE_LIST", data);
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
