<template>
	<div
		class="cl-chat-session"
		:class="{
			'is-position': browser.isMini,
			'is-show': sessionVisible
		}"
	>
		<!-- 关键字搜索 -->
		<div class="cl-chat-session__search">
			<el-input
				v-model="keyWord"
				placeholder="搜索"
				prefix-icon="el-icon-search"
				size="small"
				clearable
				@clear="onSearch"
				@keyup.enter.native="onSearch"
			></el-input>
		</div>

		<!-- 会话列表 -->
		<ul class="cl-chat-session__list scroller1" v-loading="loading">
			<li
				class="cl-chat-session__item"
				v-for="(item, index) in list"
				:key="index"
				:class="{
					'is-active': session ? item.id == session.id : false
				}"
				@click="toDetail(item)"
				@contextmenu.stop.prevent="openCM($event, item.id, index)"
			>
				<!-- 头像 -->
				<div class="avatar">
					<el-badge
						:value="item.serviceUnreadCount"
						:hidden="item.serviceUnreadCount === 0"
						:max="99"
					>
						<img :src="item.headimgurl" alt="" />
					</el-badge>
				</div>

				<!-- 昵称，内容 -->
				<div class="det">
					<p class="name">{{ item.nickname }}</p>
					<p class="content">{{ item.lastMessage }}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { isEmpty } from "cl-admin/utils";
import { ContextMenu } from "cl-admin-crud";
import { parseContent } from "../utils";
import eventBus from "../utils/event-bus";

export default {
	data() {
		return {
			loading: false,
			pagination: {
				page: 1,
				size: 100,
				total: 0
			},
			keyWord: ""
		};
	},

	computed: {
		...mapGetters(["sessionList", "session", "browser", "sessionVisible"]),

		// 列表数据
		list() {
			return this.sessionList
				.map(e => {
					const { _text } = parseContent(e);
					e.lastMessage = _text;
					return e;
				})
				.sort((a, b) => {
					return a.updateTime < b.updateTime ? 1 : -1;
				});
		}
	},

	created() {
		// 监听列表刷新
		eventBus.$on("session.refresh", this.refresh);

		// PC 端下首次请求读取第一个消息
		this.refresh().then(res => {
			if (!isEmpty(res.list) && !this.browser.isMini) {
				this.SET_SESSION(res.list[0]);
			}
		});
	},

	methods: {
		...mapMutations(["SET_SESSION_LIST", "SET_SESSION", "CLEAR_SESSION", "CLOSE_SESSION"]),

		// 右键菜单
		openCM(e, id, index) {
			ContextMenu.open(e, {
				list: [
					{
						label: "删除",
						icon: "el-icon-delete",
						callback: (_, done) => {
							this.$service.im.session.delete({
								ids: id
							});

							this.list.splice(index, 1);

							if (id == this.session.id) {
								this.toDetail();
							}

							done();
						}
					}
				]
			});
		},

		// 刷新列表
		refresh(params) {
			this.loading = true;

			return new Promise((resolve, reject) => {
				this.$service.im.session
					.page({
						...this.pagination,
						keyWord: this.keyWord,
						params,
						order: "updateTime",
						sort: "desc"
					})
					.then(res => {
						this.SET_SESSION_LIST(res.list);
						this.pagination = res.pagination;

						resolve(res);
					})
					.catch(err => {
						this.$message.error(err);
						reject(err);
					})
					.done(() => {
						this.loading = false;
					});
			});
		},

		// 搜索关键字
		onSearch() {
			this.refresh({ page: 1 });
		},

		// 会话详情
		toDetail(item) {
			if (item) {
				// 点击关闭弹窗
				if (this.browser.isMini) this.CLOSE_SESSION();

				// 设置为当前会话
				if (!this.session || this.session.id != item.id) {
					this.SET_SESSION(item);
				}
			} else {
				this.CLEAR_SESSION();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-chat-session {
	height: 100%;
	width: 0;
	transition: width 0.2s ease-in-out;
	border-radius: 5px;
	background-color: #fff;
	overflow: hidden;

	&.is-show {
		width: 250px;
		max-width: 100%;
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

	&__search {
		padding: 10px;
	}

	&__list {
		height: calc(100% - 52px);
		overflow: auto;

		li {
			display: flex;
			list-style: none;
			padding: 10px;
			border-left: 5px solid #fff;

			.avatar {
				margin-right: 12px;

				img {
					display: block;
					height: 40px;
					width: 40px;
					border-radius: 3px;
					background-color: #eee;
				}

				.el-badge {
					&__content {
						height: 14px;
						line-height: 14px;
						padding: 0 4px;
						background-color: #fa5151;
						border: 0;
					}
				}
			}

			.det {
				flex: 1;
				.name {
					font-size: 13px;
					margin-top: 1px;
				}

				.content {
					font-size: 12px;
					margin-top: 5px;
					color: #666;
				}

				.name,
				.content {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
				}
			}

			&.is-active {
				background-color: #eee;
				border-color: $color-primary;
			}

			&:hover {
				background-color: #eee;
				cursor: pointer;
			}
		}
	}

	&__empty {
		text-align: center;
		margin-top: 10px;
	}
}
</style>
