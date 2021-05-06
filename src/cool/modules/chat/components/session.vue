<template>
	<div
		class="cl-chat-session"
		:class="{
			'is-position': browser.isMini,

			'is-show': sessionVisible
		}"
	>
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
				<div class="avatar">
					<el-badge
						:value="item.serviceUnreadCount"
						:hidden="item.serviceUnreadCount === 0"
						:max="99"
					>
						<img :src="item.headimgurl" alt="" />
					</el-badge>
				</div>
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

	beforeCreate() {
		eventBus.$off("session.refresh");
	},

	created() {
		eventBus.$on("session.refresh", this.refresh);
		this.refresh().then(res => {
			if (!isEmpty(res.list) && !this.browser.isMini) {
				this.SET_SESSION(res.list[0]);
			}
		});
	},

	methods: {
		...mapMutations(["SET_SESSION_LIST", "SET_SESSION", "CLEAR_SESSION", "CLOSE_SESSION"]),
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
		onSearch() {
			this.refresh({
				page: 1
			});
		},
		toDetail(item) {
			if (item) {
				if (this.browser.isMini) this.CLOSE_SESSION();
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
	overflow: hidden;
	width: 0;
	height: 100%;
	background-color: #fff;
	border-radius: 5px;
	transition: width 0.2s ease-in-out;

	&.is-show {
		width: 250px;
		max-width: 100%;
		margin-right: 5px;
	}

	&.is-position {
		position: absolute;
		top: 51px;
		left: 5px;
		z-index: 3000;
		height: calc(100% - 56px);

		&.is-show {
			width: calc(100% - 10px);
		}
	}

	&__search {
		padding: 10px;
	}

	&__list {
		overflow: auto;
		height: calc(100% - 52px);

		li {
			display: flex;
			padding: 10px;
			list-style: none;
			border-left: 5px solid #fff;

			.avatar {
				margin-right: 12px;

				img {
					display: block;
					width: 40px;
					height: 40px;
					background-color: #eee;
					border-radius: 3px;
				}

				.el-badge {
					&__content {
						height: 14px;
						padding: 0 4px;
						line-height: 14px;
						background-color: #fa5151;
						border: 0;
					}
				}
			}

			.det {
				flex: 1;

				.name {
					margin-top: 1px;
					font-size: 13px;
				}

				.content {
					margin-top: 5px;
					color: #666;
					font-size: 12px;
				}

				.name,
				.content {
					display: -webkit-box;
					overflow: hidden;
					text-overflow: ellipsis;

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
		margin-top: 10px;
		text-align: center;
	}
}
</style>
