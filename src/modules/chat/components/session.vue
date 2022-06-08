<template>
	<div
		class="cl-chat__session"
		:class="{
			'is-position': app.browser.isMini,
			'is-show': chat?.session.visible
		}"
	>
		<div class="head"></div>

		<div class="list scroller1">
			<div class="item" v-for="(item, index) in 13" :key="index">
				<div class="avatar">
					<el-badge value="2">
						<el-avatar shape="square"></el-avatar>
					</el-badge>
				</div>

				<div class="det">
					<p class="name">神仙都没用</p>
					<p class="message">
						https://g0qwq7gr7l.feishu.cn/docx/doxcnkMF3PFehilJTyHbEivkUod
					</p>
				</div>

				<div class="status">
					<p class="date">2022-04-21 12:22</p>
					<el-tag size="small">厦门</el-tag>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useChat } from "../hooks";
import { useBase } from "/$/base";

const { app } = useBase();
const { chat } = useChat();
</script>

<style lang="scss" scoped>
.cl-chat__session {
	height: 100%;
	width: 0;
	background-color: #fff;
	overflow: hidden;
	transition: width 0.2s ease-in-out;
	border-radius: 5px;

	&.is-show {
		width: 350px;
		margin-right: 5px;
	}

	&.is-position {
		position: absolute;
		left: 5px;
		top: 51px;
		height: calc(100% - 56px);
		z-index: 3000;

		&.is-show {
			width: calc(100% - 10px);
		}
	}

	.head {
		display: flex;
		height: 50px;
		border-bottom: 1px solid #f7f7f7;
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
					margin-bottom: 2px;
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
				}
			}

			&:hover {
				background-color: #f7f7f7;
			}
		}
	}
}
</style>
