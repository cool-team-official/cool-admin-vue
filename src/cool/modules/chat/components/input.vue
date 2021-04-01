<template>
	<div class="cl-chat-input">
		<!-- 工具栏 -->
		<div class="cl-chat-input__opbar">
			<ul>
				<li>
					<!-- 表情 -->
					<emoji @select="onEmojiSelect" />
				</li>
				<li>
					<!-- 图片上传 -->
					<upload name="image" accept="image/*" @before-upload="append" @success="send">
						<img src="../static/images/image.png" alt="" />
					</upload>
				</li>
				<li>
					<!-- 视频上传 -->
					<upload name="video" accept="video/*" @before-upload="append" @success="send">
						<img src="../static/images/video.png" alt="" />
					</upload>
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
			/>

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
import Upload from "./upload.vue";

export default defineComponent({
	components: {
		Emoji,
		Upload
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
			append,
			onTextSend,
			onImageSelect,
			onEmojiSelect,
			onVideoSelect
		};
	}
});
</script>

<style lang="scss">
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
			right: 15px;
			bottom: 10px;
		}
	}
}
</style>
