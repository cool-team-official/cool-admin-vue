<template>
	<div class="error-page">
		<h1 class="code">{{ code }}</h1>
		<p class="desc">{{ desc }}</p>

		<template v-if="token || isLogout">
			<div class="router">
				<el-select v-model="url" size="medium" filterable prefix-icon="el-icon-search">
					<el-option v-for="(item, index) in routes" :key="index" :value="item.path">
						<span style="float: left">{{ item.name }}</span>
						<span style="float: right">{{ item.path }}</span>
					</el-option>
				</el-select>

				<el-button round @click="navTo">跳转</el-button>
			</div>

			<ul class="link">
				<li @click="home">回到首页</li>
				<li @click="back">返回上一页</li>
				<li @click="reLogin">重新登录</li>
			</ul>
		</template>

		<template v-else>
			<div class="router">
				<el-button round @click="toLogin">返回登录页</el-button>
			</div>
		</template>

		<p class="copyright">Copyright © cool-admin-next 2021</p>
	</div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { href } from "/@/core/utils";

export default defineComponent({
	props: {
		code: Number,
		desc: String
	},

	setup() {
		const store = useStore();
		const router = useRouter();

		const url = ref<string>("");
		const isLogout = ref<boolean>(false);

		const routes = computed(() => store.getters.routes);
		const token = computed(() => store.getters.token);

		function navTo() {
			router.push(url.value);
		}

		function toLogin() {
			router.push("/login");
		}

		async function reLogin() {
			isLogout.value = true;
			await store.dispatch("userLogout");
			href("/login");
		}

		function back() {
			history.back();
		}

		function home() {
			router.push("/");
		}

		return {
			url,
			isLogout,
			routes,
			token,
			navTo,
			toLogin,
			reLogin,
			back,
			home
		};
	}
});
</script>

<style lang="scss" scoped>
.error-page {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	overflow-y: auto;

	.code {
		font-size: 120px;
		font-weight: normal;
		color: #6c757d;
		font-family: "Segoe UI";
	}

	.desc {
		font-size: 16px;
		font-weight: 400;
		color: #34395e;
		margin-top: 30px;
	}

	.router {
		display: flex;
		justify-content: center;
		margin-top: 50px;
		max-width: 450px;
		width: 90%;

		.el-select {
			font-size: 14px;
			flex: 1;
		}

		.el-button {
			margin-left: 15px;
			background-color: $color-primary;
			border-color: $color-primary;
			color: #fff;
			padding: 0 30px;
			letter-spacing: 1px;
			height: 36px;
			line-height: 36px;
		}
	}

	.link {
		display: flex;
		margin-top: 40px;

		li {
			font-weight: 500;
			cursor: pointer;
			font-size: 14px;
			margin: 0 20px;
			list-style: none;

			&:hover {
				color: $color-primary;
			}
		}
	}

	.copyright {
		color: #6c757d;
		font-size: 14px;
		position: fixed;
		bottom: 0;
		left: 0;
		height: 50px;
		line-height: 50px;
		width: 100%;
		text-align: center;
	}
}
</style>
