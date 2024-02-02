<template>
	<a-menu v-if="app.info.menu.isGroup" />

	<div class="app-topbar">
		<div
			class="app-topbar__collapse"
			:class="{
				unfold: !app.isFold
			}"
			@click="app.fold()"
		>
			<i class="cl-iconfont cl-icon-fold"></i>
		</div>

		<!-- 路由导航 -->
		<route-nav />

		<div class="flex1"></div>

		<!-- 工具栏 -->
		<ul class="app-topbar__tools">
			<li v-for="(item, index) in toolbarComponents" :key="index">
				<component :is="item.component" />
			</li>
		</ul>

		<!-- 用户信息 -->
		<div class="app-topbar__user" v-if="user.info">
			<el-dropdown trigger="click" hide-on-click @command="onCommand">
				<span class="el-dropdown-link">
					<span class="name">{{ user.info.nickName }}</span>
					<cl-avatar :size="32" :src="user.info.headImg" />
				</span>

				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="my">
							<i class="cl-iconfont cl-icon-user"></i>
							<span>个人中心</span>
						</el-dropdown-item>
						<el-dropdown-item command="exit">
							<i class="cl-iconfont cl-icon-exit"></i>
							<span>退出</span>
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
	</div>
</template>

<script lang="ts" name="app-topbar" setup>
import { computed, markRaw, onMounted, reactive } from "vue";
import { isFunction, orderBy } from "lodash-es";
import { useBase } from "/$/base";
import { module, useCool } from "/@/cool";
import RouteNav from "./route-nav.vue";
import AMenu from "./amenu.vue";
import { ElMessageBox } from "element-plus";

const { router, service, browser } = useCool();
const { user, app } = useBase();

// 命令事件
async function onCommand(name: string) {
	switch (name) {
		case "my":
			router.push("/my/info");
			break;
		case "exit":
			ElMessageBox.confirm("确定退出登录吗？", "提示", {
				type: "warning"
			})
				.then(async () => {
					await service.base.comm.logout();
					user.logout();
				})
				.catch(() => null);
			break;
	}
}

// 工具栏
const toolbar = reactive({
	list: [] as any[],

	async init() {
		const arr = orderBy(module.list.map((e) => e.toolbar).filter(Boolean), "order");

		this.list = await Promise.all(
			arr.map(async (e) => {
				if (e) {
					const c = await (isFunction(e.component) ? e.component() : e.component);

					return {
						...e,
						component: markRaw(c.default)
					};
				}
			})
		);
	}
});

// 工具栏组件
const toolbarComponents = computed(() => {
	return toolbar.list.filter((e) => {
		if (browser.isMini) {
			return e?.h5 ?? true;
		}

		return e?.pc ?? true;
	});
});

onMounted(() => {
	toolbar.init();
});
</script>

<style lang="scss" scoped>
.app-topbar {
	display: flex;
	align-items: center;
	height: 50px;
	padding: 0 10px;
	background-color: #fff;
	margin-bottom: 10px;

	&__collapse {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40px;
		width: 40px;
		cursor: pointer;
		transform: rotateY(180deg);

		&.unfold {
			transform: rotateY(0);
		}

		i {
			font-size: 20px;
		}
	}

	.flex1 {
		flex: 1;
	}

	&__tools {
		display: flex;
		margin-right: 20px;

		& > li {
			display: flex;
			justify-content: center;
			align-items: center;
			list-style: none;
			height: 45px;
			padding: 0 10px;
			cursor: pointer;
		}
	}

	&__user {
		margin-right: 10px;
		cursor: pointer;

		.el-dropdown-link {
			display: flex;
			align-items: center;
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
