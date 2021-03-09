<template>
	<div class="error-page">
		<h1 class="code">{{ code }}</h1>
		<p class="desc">{{ desc }}</p>

		<template v-if="token || isLogout">
			<div class="router">
				<el-select size="medium" filterable prefix-icon="el-icon-search" v-model="url">
					<el-option v-for="(item, index) in routes" :key="index" :value="item.path">
						<span style="float: left">{{ item.name }}</span>
						<span style="float: right">{{ item.path }}</span>
					</el-option>
				</el-select>

				<el-button round @click="navTo">跳转</el-button>
			</div>

			<div class="link">
				<el-link class="to-home" @click="home">回到首页</el-link>
				<el-link class="to-back" @click="back">返回上一页</el-link>
				<el-link class="to-login" @click="reLogin">重新登录</el-link>
			</div>
		</template>

		<template v-else>
			<div class="router">
				<el-button round @click="toLogin">返回登录页</el-button>
			</div>
		</template>

		<p class="copyright">Copyright © cool-admin-pro 2020</p>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { href } from "cl-admin/utils";

export default {
	props: {
		code: Number,
		desc: String
	},

	data() {
		return {
			url: "",
			isLogout: false
		};
	},

	computed: {
		...mapGetters(["routes", "token"])
	},

	methods: {
		navTo() {
			this.$router.push(this.url);
		},

		toLogin() {
			this.$router.push("/login");
		},

		reLogin() {
			this.isLogout = true;

			this.$store.dispatch("userLogout").done(() => {
				href("/login");
			});
		},

		back() {
			history.back();
		},

		home() {
			this.$router.push("/");
		}
	}
};
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
		margin-top: 40px;

		a {
			font-weight: 500;
			transition: all 0.5s;
			-webkit-transition: all 0.5s;
			cursor: pointer;
			font-size: 14px;
			margin: 0 15px;
			padding-bottom: 2px;
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
