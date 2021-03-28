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
				@keyup.enter="onTextSend"
			></el-input>

			<el-button type="primary" size="mini" :disabled="!text" @click="onTextSend"
				>发送</el-button
			>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, nextTick, reactive, ref } from "vue";
import { useStore } from "vuex";
import Emoji from "./emoji.vue";

export default defineComponent({
	components: {
		Emoji
	},

	setup() {
		const store = useStore();
		const chat = inject<any>("chat");
		const mitt = inject<any>("mitt");

		// 输入值
		const text = ref<string>("");

		// 表情
		const emoji = reactive<any>({
			visible: false
		});

		// 追加消息
		function append(data: any) {
			store.commit("APPEND_MESSAGE_LIST", data);
			mitt.emit("message.scrollToBottom");
		}

		// 发送消息
		function send(data: any, isAppend?: boolean) {
			const { id, userId } = store.getters.session;

			// 格式化内容
			data.content = JSON.stringify(data.content);

			// 更新消息
			store.commit("UPDATE_SESSION", data);

			if (chat.socket) {
				chat.socket.emit(`user@${userId}`, {
					contentType: data.contentType,
					type: 0,
					content: data.content,
					sessionId: id
				});
			}

			if (isAppend) {
				append(data);
			}
		}

		// 上传前，获取图片预览地址
		function onBeforeUpload(file: any, key: string) {
			// 先添加到列表中，等待上传
			function next(options = {}) {
				const data = {
					content: {
						[`${key}Url`]: ""
					},
					type: 0,
					uid: file.uid,
					loading: true,
					progress: "0%",
					contentType: chat.modes.indexOf(key),
					...options
				};

				append(data);
			}

			// 图片预览
			if (key == "image") {
				const fileReader = new FileReader();

				fileReader.onload = (e: any) => {
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
		}

		// 上传中
		function onUploadProgress(e: any, file: any) {
			store.commit("UPDATE_MESSAGE", {
				file,
				data: {
					progress: e.percent + "%"
				}
			});
		}

		// 上传成功
		function onUploadSuccess(res: any, file: any, key: string) {
			store.commit("UPDATE_MESSAGE", {
				file,
				data: {
					loading: false,
					content: {
						[`${key}Url`]: res.data
					}
				},
				callback: send
			});
		}

		// 发送文本内容
		function onTextSend() {
			if (text.value) {
				if (text.value.replace(/\n/g, "") !== "") {
					const data = {
						type: 0,
						contentType: 0,
						content: {
							text: text.value
						}
					};

					send(data, true);

					nextTick(() => {
						text.value = "";
					});
				}
			}
		}

		// 图片选择
		function onImageSelect(res: any) {
			send(
				{
					content: {
						imageUrl: res.data
					},
					type: 0,
					contentType: 1
				},
				true
			);
		}

		// 表情选择
		function onEmojiSelect(url: string) {
			emoji.visible = false;
			send(
				{
					content: {
						imageUrl: url
					},
					type: 0,
					contentType: 2
				},
				true
			);
		}

		// 视频选择
		function onVideoSelect(url: string) {
			send(
				{
					content: {
						videoUrl: url
					},
					type: 0,
					contentType: 4
				},
				true
			);
		}

		return {
			text,
			emoji,
			send,
			onBeforeUpload,
			onUploadProgress,
			onUploadSuccess,
			onTextSend,
			onImageSelect,
			onEmojiSelect,
			onVideoSelect
		};
	}
});
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

				:deep(img) {
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
