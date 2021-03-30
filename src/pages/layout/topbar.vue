<template>
	<div class="app-topbar">
		<div class="app-topbar__collapse" @click="collapse">
			<i :class="[menuCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"></i>
		</div>

		<!-- 一级菜单 -->
		<div class="app-topbar__menu" v-if="app.conf.showAMenu">
			<cl-menu-topbar />
		</div>

		<!-- 路由导航 -->
		<div class="app-topbar__route-nav" v-if="app.conf.showRouteNav">
			<cl-route-nav />
		</div>

		<div class="flex1"></div>

		<!-- 工具栏 -->
		<ul class="app-topbar__tools">
			<!-- 消息通知 -->
			<li v-if="modules.chat">
				<cl-chat-notice />
			</li>

			<!-- 主题 -->
			<li v-if="modules.theme">
				<cl-theme />
			</li>
		</ul>

		<!-- 用户信息 -->
		<div class="app-topbar__user">
			<el-dropdown trigger="click" :hide-on-click="false" @command="onCommand">
				<span class="el-dropdown-link" v-if="userInfo">
					<span class="name">{{ userInfo.nickName }}</span>
					<img class="avatar" :src="userInfo.headImg" alt />
				</span>

				<template #dropdown>
					<el-dropdown-menu class="dropdown-menu__user">
						<el-dropdown-item command="my">个人中心</el-dropdown-item>
						<el-dropdown-item command="exit">退出</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { href } from "@/core/utils";

export default defineComponent({
	setup() {
		const store = useStore();
		const router = useRouter();

		// 菜单是否展开
		const menuCollapse = computed<any>(() => store.getters.menuCollapse);

		// 模块列表
		const modules = computed<any>(() => store.getters.modules);

		// 应用信息
		const app = computed<any>(() => store.getters.app);

		// 用户信息
		const userInfo = computed<any>(() => store.getters.userInfo);

		// 跳转官网
		function onCommand(name: string) {
			switch (name) {
				case "my":
					router.push("/my/info");
					break;
				case "exit":
					store.dispatch("userLogout").done(() => {
						href("/login");
					});
					break;
			}
		}

		// 展开
		function collapse() {
			store.commit("COLLAPSE_MENU", !menuCollapse.value);
		}

		return {
			userInfo,
			menuCollapse,
			modules,
			app,
			onCommand,
			collapse
		};
	}
});
</script>

<style lang="scss">
.dropdown-menu__user {
	width: 120px;
}
</style>

<style lang="scss" scoped>
.app-topbar {
	display: flex;
	align-items: center;
	height: 50px;
	padding: 0 10px;
	background-color: #fff;

	&__collapse {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40px;
		width: 40px;
		cursor: pointer;
		margin-right: 10px;

		i {
			font-size: 22px;
			color: #666;
		}
	}

	.flex1 {
		flex: 1;
	}

	&__tools {
		display: flex;
		margin-right: 20px;

		li {
			list-style: none;
			height: 45px;
			width: 45px;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;

			i {
				font-size: 18px;

				&:hover {
					opacity: 0.8;
				}
			}
		}
	}

	&__user {
		margin-right: 10px;
		cursor: pointer;

		.el-dropdown-link {
			display: flex;
			align-items: center;
		}

		.avatar {
			height: 32px;
			width: 32px;
			border-radius: 32px;
		}

		.name {
			white-space: nowrap;
			margin-right: 15px;
		}

		.el-icon-arrow-down {
			margin-left: 10px;
		}
	}
}
</style>
