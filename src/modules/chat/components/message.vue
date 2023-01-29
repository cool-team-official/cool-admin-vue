<template>
	<div class="chat-message" v-loading="message?.loading" element-loading-text="消息列表加载中">
		<!-- 头部 -->
		<div class="head">
			<template v-if="session?.value">
				<div class="avatar">
					<el-avatar :size="30" shape="square" :src="session?.value.avatar"></el-avatar>
				</div>
				<span class="name">与“{{ session?.value.nickName }}”聊天中</span>
			</template>
		</div>

		<!-- 消息列表 -->
		<div class="list scroller1">
			<ul>
				<li v-for="(item, index) in list" :key="index">
					<div
						class="item"
						:class="{
							'is-right': item.isMy
						}"
					>
						<div class="avatar">
							<el-avatar :size="36" shape="square" :src="item.avatar"></el-avatar>
						</div>

						<div
							class="det"
							@contextmenu="
								(e) => {
									onContextMenu(e, item);
								}
							"
						>
							<div class="h">
								<span class="name">{{ item.nickName }}</span>
							</div>
							<div class="content">
								<!-- 文本 -->
								<div class="is-text" v-if="item.contentType == 0">
									<span>{{ item.content.text }}</span>
								</div>

								<!-- 图片 -->
								<div class="is-image" v-else-if="item.contentType == 1">
									<el-image
										:src="item.content.imageUrl"
										:preview-src-list="previewUrls"
										:initial-index="item._index"
										scroll-container=".chat-message .list"
									/>
								</div>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>

		<!-- 底部 -->
		<div class="footer">
			<div class="tools">
				<ul>
					<cl-upload @success="onImageSend" :show-file-list="false">
						<li>
							<el-icon><picture-filled /></el-icon>
						</li>
					</cl-upload>

					<li>
						<el-icon><video-camera /></el-icon>
					</li>

					<li>
						<el-icon><microphone /></el-icon>
					</li>
				</ul>
			</div>

			<div class="input">
				<el-input
					v-model="value"
					type="textarea"
					:rows="4"
					resize="none"
					:autosize="{
						minRows: 4,
						maxRows: 10
					}"
					placeholder="输入内容"
				></el-input>
				<el-button size="small" type="success" @click="onTextSend" :disabled="!value"
					>发送</el-button
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useChat } from "../hooks";
import { useStore } from "../store";
import { PictureFilled, VideoCamera, Microphone } from "@element-plus/icons-vue";
import { useBase } from "/$/base";
import { ContextMenu } from "@cool-vue/crud";
import { useClipboard } from "@vueuse/core";
import { Chat } from "../types";

const { user } = useBase();
const { chat } = useChat();
const { message, session } = useStore();
const { copy } = useClipboard();

const value = ref("");

// 过滤列表
const list = computed(() => {
	let n = 0;

	return message.list.map((e) => {
		if (e.contentType == 1) {
			e._index = n++;
		}

		// 是否自己发的消息
		e.isMy = e.fromId == user.info?.id;

		return e;
	});
});

// 预览图片地址
const previewUrls = computed(() =>
	message.list
		.filter((e) => e.contentType == 1)
		.map((e) => e.content?.imageUrl)
		.filter(Boolean)
);

// 文本消息
function onTextSend() {
	chat.send(
		{
			contentType: 0,
			content: {
				text: value.value
			}
		},
		true
	);
	value.value = "";
}

// 图片消息
function onImageSend(res: any) {
	chat.send(
		{
			contentType: 1,
			content: {
				imageUrl: res.url
			}
		},
		true
	);
	value.value = "";
}

// 右键菜单
function onContextMenu(e: Event, item: Chat.Message) {
	ContextMenu.open(e, {
		hover: {
			target: "content"
		},
		list: [
			{
				label: "复制",
				callback(done) {
					copy(item.content.text || "");
					done();
				}
			},
			{
				label: "转发"
			},
			{
				label: "删除"
			}
		]
	});
}
</script>

<style lang="scss" scoped>
.chat-message {
	display: flex;
	flex-direction: column;
	background-color: #fff;
	border-radius: 5px;
	height: 100%;
	box-sizing: border-box;

	.head {
		display: flex;
		align-items: center;
		height: 50px;
		padding: 0 10px;

		.name {
			margin-left: 10px;
			font-size: 14px;
		}

		ul {
			li {
				list-style: none;
			}
		}
	}

	.list {
		flex: 1;
		background-color: #f7f7f7;

		ul {
			& > li {
				list-style: none;

				.date {
					display: flex;
					align-items: center;
					justify-content: center;
					height: 40px;
					font-size: 12px;
				}

				.item {
					display: flex;
					padding: 10px;

					.avatar {
						margin-right: 10px;
					}

					.det {
						.h {
							display: flex;
							align-items: center;
							.name {
								font-size: 12px;
								color: #666;
							}
						}

						.content {
							display: flex;
							flex-direction: column;
							margin-top: 5px;

							.is-text {
								background-color: #fff;
								padding: 8px;
								border-radius: 0 5px 5px 5px;
								max-width: 400px;
								font-size: 14px;
							}

							.is-image {
								background-color: #fff;

								.el-image {
									display: block;
									min-height: 100px;
									max-width: 200px;
									border-radius: 3px;
								}
							}
						}
					}

					&.is-right {
						flex-direction: row-reverse;

						.avatar {
							margin-left: 10px;
							margin-right: 0;
						}

						.det {
							.h {
								justify-content: flex-end;
							}

							.content {
								.is-text {
									border-radius: 5px 0 5px 5px;
								}
							}
						}
					}
				}
			}
		}
	}

	.footer {
		padding: 10px;

		.tools {
			display: flex;
			margin-bottom: 10px;

			ul {
				display: flex;
				align-items: center;
				flex: 1;

				li {
					height: 26px;
					width: 26px;
					border-radius: 3px;
					margin-right: 10px;
					list-style: none;
					display: flex;
					justify-content: center;
					align-items: center;
					cursor: pointer;
					font-size: 18px;

					&:hover {
						background-color: #f7f7f7;
					}
				}
			}
		}

		.input {
			display: flex;
			position: relative;

			.el-button {
				margin-left: 10px;
				position: absolute;
				right: 10px;
				bottom: 10px;
			}
		}
	}
}
</style>
