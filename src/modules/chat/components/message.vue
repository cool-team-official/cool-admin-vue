<template>
	<div
		class="chat-message"
		v-loading="chat?.message.loading"
		element-loading-text="消息列表加载中"
	>
		<!-- 头部 -->
		<div class="head">
			<template v-if="chat?.session.value">
				<div class="avatar">
					<el-avatar
						:size="30"
						shape="square"
						:src="chat?.session.value.avatar"
					></el-avatar>
				</div>
				<span class="name">与“{{ chat?.session.value.nickName }}”聊天中</span>

				<ul class="tools">
					<li></li>
				</ul>
			</template>
		</div>

		<!-- 消息列表 -->
		<div class="list scroller1">
			<ul>
				<li v-for="(item, index) in list" :key="index">
					<div
						class="item"
						:class="{
							'is-right': item.type == 1
						}"
					>
						<div class="avatar">
							<el-avatar :size="36" shape="square" :src="item.avatar"></el-avatar>
						</div>

						<div class="det">
							<div class="h">
								<span class="name">{{ item.nickName }}</span>
							</div>
							<div class="content">
								<div class="is-text">
									<span>{{ item.text }}</span>
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
					<li></li>
				</ul>
			</div>

			<div class="input">
				<el-input
					v-model="chat.inputValue"
					type="textarea"
					:rows="4"
					resize="none"
					:autosize="{
						minRows: 4,
						maxRows: 10
					}"
					placeholder="输入内容"
				></el-input>
				<el-button size="small" type="success" @click="send">发送</el-button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from "vue-demi";
import { useChat } from "../hooks";

const { chat } = useChat();

// 过滤列表
const list = computed(() => chat?.message.list);

function send() {
	chat?.scrollToBottom();
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

							.is-img {
								.el-image {
									max-width: 300px;
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
				li {
					height: 25px;
					width: 25px;
					border-radius: 3px;
					background-color: #eee;
					margin-right: 10px;
					list-style: none;
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
