<template>
	<div class="app-topbar">
		<div class="app-topbar__collapse" @click="collapse">
			<icon-svg name="icon-menu"></icon-svg>
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
		<div class="app-topbar__user" v-if="userInfo">
			<el-dropdown trigger="click" @command="onCommand">
				<span class="el-dropdown-link">
					<span class="name">{{ userInfo.nickName | default_name }}</span>
					<img class="avatar" :src="userInfo.headImg | default_avatar" alt />
				</span>

				<el-dropdown-menu slot="dropdown" class="popper-dropdown-menu-user">
					<el-dropdown-item command="my">个人中心</el-dropdown-item>
					<el-dropdown-item command="exit">退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { href } from "cl-admin/utils";

export default {
	computed: {
		...mapGetters(["userInfo", "menuCollapse", "app", "modules"])
	},

	methods: {
		onCommand(name) {
			switch (name) {
				case "my":
					this.$router.push("/my/info");
					break;
				case "exit":
					this.$store.dispatch("userLogout").done(() => {
						href("/login");
					});
					break;
			}
		},

		collapse() {
			this.$store.commit("COLLAPSE_MENU", !this.menuCollapse);
		}
	}
};
</script>

<style lang="scss" scoped>
.popper-dropdown-menu-user {
	width: 120px;
}

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

		.icon-svg {
			height: 22px;
			width: 22px;
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
