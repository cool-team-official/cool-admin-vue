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
				@keyup.enter="onSearch"
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

<script lang="ts">
import { computed, defineComponent, inject, onUnmounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { isEmpty } from "@/core/utils";
import { ContextMenu } from "@/crud";
import { parseContent } from "../utils";

export default defineComponent({
	setup() {
		const store = useStore();
		const $service = inject<any>("service");
		const mitt = inject<any>("mitt");

		// 当前会话信息
		const session = computed(() => store.getters.session);
		// 是否显示会话列表
		const sessionVisible = computed(() => store.getters.sessionVisible);
		// 浏览器信息
		const browser = computed(() => store.getters.browser);

		// 加载状态
		const loading = ref<boolean>(false);

		// 分页信息
		const pagination = reactive<any>({
			page: 1,
			size: 100,
			total: 0
		});

		// 关键字筛选
		const keyWord = ref<string>("");

		// 刷新列表
		function refresh(params?: any) {
			loading.value = true;

			return new Promise((resolve, reject) => {
				$service.im.session
					.page({
						...pagination,
						keyWord: keyWord.value,
						params,
						order: "updateTime",
						sort: "desc"
					})
					.then((res: any) => {
						store.commit("SET_SESSION_LIST", res.list);
						Object.assign(pagination, res.pagination);

						resolve(res);
					})
					.catch((err: string) => {
						ElMessage.error(err);
						reject(err);
					})
					.done(() => {
						loading.value = false;
					});
			});
		}

		// 搜索关键字
		function onSearch() {
			refresh({ page: 1 });
		}

		// 设置会话
		function setSession(item: any) {
			if (item) {
				store.commit("SET_SESSION", item);
				mitt.emit("message.refresh", { page: 1 });
			}
		}

		// 会话详情
		function toDetail(item?: any) {
			if (item) {
				// 点击关闭弹窗
				if (browser.value.isMini) store.commit("CLOSE_SESSION");

				// 设置为当前会话
				if (!session.value || session.value.id != item.id) {
					setSession(item);
				}
			} else {
				store.commit("CLEAR_SESSION");
			}
		}

		// 数据列表
		const list = computed(() => {
			return store.getters.sessionList
				.map((e: any) => {
					const { _text } = parseContent(e);
					return {
						...e,
						lastMessage: _text
					};
				})
				.sort((a: any, b: any) => {
					return a.updateTime < b.updateTime ? 1 : -1;
				});
		});

		// 右键菜单
		function openCM(e: any, id: any, index: number) {
			ContextMenu.open(e, {
				list: [
					{
						label: "删除",
						icon: "el-icon-delete",
						callback: (_: any, done: Function) => {
							$service.im.session.delete({
								ids: id
							});

							list.value.splice(index, 1);

							if (id == session.value.id) {
								toDetail();
							}

							done();
						}
					}
				]
			});
		}

		// PC 端下首次请求读取第一个消息
		refresh().then((res: any) => {
			if (!isEmpty(res.list) && !browser.value.isMini) {
				setSession(res.list[0]);
			}
		});

		// 事件监听
		mitt.on("session.refresh", refresh);

		// 销毁
		onUnmounted(function() {
			mitt.off("session.refresh", refresh);
		});

		return {
			session,
			sessionVisible,
			browser,
			list,
			loading,
			pagination,
			keyWord,
			openCM,
			refresh,
			onSearch,
			toDetail
		};
	}
});
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
