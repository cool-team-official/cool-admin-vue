<template>
	<div class="module-view">
		<a href="https://cool-js.com/" target="blank">
			<img src="https://admin.cool-js.com/logo.png" width="200" alt="cool-admin Logo" />
		</a>

		<p class="title">COOL-ADMIN 一个很酷的后台权限管理框架</p>
		<p class="desc">开源免费可商用、快速开发、模块化、插件化</p>

		<p class="tag">
			<img
				src="https://img.shields.io/badge/license-MIT-green?style=flat-square"
				alt="GitHub license"
			/>
			<img
				src="https://img.shields.io/github/package-json/v/cool-team-official/cool-admin-vue?style=flat-square"
				alt="GitHub tag"
			/>
			<img
				src="https://img.shields.io/github/last-commit/cool-team-official/cool-admin-vue?style=flat-square"
				alt="GitHub tag"
			/>
		</p>

		<div class="link">
			<a href="https://cool-js.com/" target="blank">
				<el-button type="primary" round>快速开始</el-button>
			</a>

			<a href="https://github.com/cool-team-official/cool-admin-vue" target="blank">
				<el-button round>GitHub</el-button>
			</a>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "cl-about"
});
</script>

<style lang="scss" scoped>
.module-view {
	text-align: center;
	background-color: #fff;
	padding: 100px 20px;
	overflow: auto;
	box-sizing: border-box;

	.title {
		font-size: 36px;
		font-weight: bold;
		margin: 30px 0 10px 0;
	}

	.desc {
		color: #6a8bad;
		font-size: 22px;
		margin-bottom: 20px;
	}

	.tag {
		img {
			margin: 0 3px;
		}
	}

	.link {
		margin-top: 30px;

		a {
			margin: 0 10px;
		}
	}
}
</style>
