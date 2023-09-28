<template>
	<div class="chat-session">
		<div class="head">
			<el-input v-model="keyWord" placeholder="关键字搜索" clearable></el-input>

			<ul class="tools">
				<li>
					<el-icon><plus /></el-icon>
				</li>

				<li @click="session.get()">
					<el-icon><refresh /></el-icon>
				</li>
			</ul>
		</div>

		<div class="list" v-loading="session?.loading">
			<el-scrollbar class="scroller" :ref="setRefs('scroller')">
				<div
					class="item"
					v-for="(item, index) in list"
					:key="index"
					:class="{
						'is-active': item.id == session?.value?.id
					}"
					@click="toDetail(item)"
				>
					<div class="avatar">
						<el-badge :value="item.num" :hidden="item.num == 0">
							<cl-avatar shape="square" :src="item.avatar" />
						</el-badge>
					</div>

					<div class="det">
						<p class="name">{{ item.nickName }}</p>
						<p class="message">
							{{ item.text }}
						</p>
					</div>

					<div class="status">
						<p class="date">{{ item.createTime }}</p>
					</div>
				</div>

				<el-empty
					v-if="list.length == 0"
					:image-size="100"
					description="暂无会话"
				></el-empty>
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from "vue";
import { useChat } from "../hooks";
import { useStore } from "../store";
import { Refresh, Plus } from "@element-plus/icons-vue";
import { Chat } from "../types";
import { useBrowser, useCool } from "/@/cool";
import { useDialog } from "@cool-vue/crud";

const { browser } = useBrowser();
const { chat } = useChat();
const { session, message } = useStore();
const { refs, setRefs } = useCool();

useDialog({
	onFullscreen() {
		nextTick(() => {
			refs.scroller?.update();
		});
	}
});

// 关键字
const keyWord = ref("");

// 过滤列表
const list = computed(() => session?.list.filter((e) => e.nickName?.includes(keyWord.value)) || []);

// 会话详情
async function toDetail(item: Chat.Session) {
	if (browser.isMini) {
		chat.expand(false);
	}
	session.set(item);
	await message.get({ page: 1 });
	chat.scrollToBottom();
}
</script>

<style lang="scss" scoped>
.chat-session {
	height: 100%;
	width: 100%;
	background-color: #fff;
	border-radius: 6px;

	.head {
		display: flex;
		border-bottom: 1px solid #f7f7f7;
		padding: 10px;

		:deep(.el-input) {
			height: 30px;

			.el-input__wrapper {
				background-color: #eee;
				box-shadow: none;
			}
		}

		.tools {
			display: inline-flex;
			align-items: center;

			li {
				height: 30px;
				width: 30px;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				margin-left: 10px;
				border-radius: 4px;
				background-color: #eee;
				color: #666;

				.el-icon {
					font-size: 16px;
				}

				&:hover {
					background-color: #ddd;
				}
			}
		}
	}

	.list {
		height: calc(100% - 51px);
		overflow: hidden;

		.scroller {
			height: 100%;
		}

		.item {
			display: flex;
			padding: 15px 10px;
			cursor: pointer;

			.avatar {
				margin-right: 10px;

				:deep(.el-badge__content) {
					transform: translateY(-50%) translateX(calc(100% - 5px)) scale(0.8) !important;
				}
			}

			.det {
				flex: 1;

				.name,
				.message {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
				}

				.name {
					font-size: 14px;
					margin-bottom: 4px;
				}

				.message {
					font-size: 12px;
					color: #666;
				}
			}

			.status {
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				font-size: 12px;

				.date {
					margin-bottom: 5px;
					color: #999;
				}
			}

			&.is-active {
				background-color: #eee;
			}

			&:not(.is-active):hover {
				background-color: #f7f7f7;
			}
		}
	}
}
</style>
