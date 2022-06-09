<template>
	<div class="chat-session">
		<div class="head">
			<el-input v-model="keyWord" placeholder="关键字搜索" clearable></el-input>
		</div>

		<div class="list scroller1" v-loading="chat?.session.loading">
			<div
				class="item"
				v-for="(item, index) in list"
				:key="index"
				:class="{
					'is-active': item.id == chat?.session.value?.id
				}"
				@click="toDetail(item)"
			>
				<div class="avatar">
					<el-badge :value="item.num" :hidden="item.num == 0">
						<el-avatar shape="square" :src="item.avatar"></el-avatar>
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
					<!-- <el-tag size="small">厦门</el-tag> -->
				</div>
			</div>

			<el-empty v-if="list.length == 0" image-size="100" description="暂无会话"></el-empty>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useChat } from "../hooks";
import { useCool } from "/@/cool";

const { service } = useCool();
const { chat } = useChat();

// 关键字
const keyWord = ref("");

// 过滤列表
const list = computed(
	() => chat?.session.list.filter((e) => e.nickName.includes(keyWord.value)) || []
);

// 会话详情
function toDetail(item: any) {
	chat?.setSession(item);
}

onMounted(() => {
	chat?.getSession();
});
</script>

<style lang="scss" scoped>
.chat-session {
	height: 100%;
	width: 100%;
	background-color: #fff;
	border-radius: 5px;

	.head {
		display: flex;
		border-bottom: 1px solid #f7f7f7;
		padding: 10px;

		.el-input {
			height: 30px;
			background-color: #eee !important;
		}
	}

	.list {
		height: calc(100% - 51px);
		.item {
			display: flex;
			padding: 15px 10px;
			cursor: pointer;

			.avatar {
				margin-right: 15px;

				:deep(.el-badge__content) {
					transform: translateY(-50%) translateX(100%) scale(0.8) !important;
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
