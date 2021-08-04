<template>
	<div class="page-login">
		<div class="box">
			<img class="logo" src="../../static/images/logo.png" alt="" />
			<p class="desc">COOL ADMIN是一款快速开发后台权限管理系统</p>

			<el-form label-position="top" class="form" size="medium" :disabled="saving">
				<el-form-item label="用户名">
					<el-input
						v-model="form.username"
						placeholder="请输入用户名"
						maxlength="20"
						auto-complete="off"
					/>
				</el-form-item>

				<el-form-item label="密码">
					<el-input
						v-model="form.password"
						type="password"
						placeholder="请输入密码"
						maxlength="20"
						auto-complete="off"
					/>
				</el-form-item>

				<el-form-item label="验证码" class="captcha">
					<el-input
						v-model="form.verifyCode"
						placeholder="请输入图片验证码"
						maxlength="4"
						auto-complete="off"
						@keyup.enter="toLogin"
					/>

					<captcha
						:ref="setRefs('captcha')"
						v-model="form.captchaId"
						class="value"
						@change="
							() => {
								form.verifyCode = '';
							}
						"
					/>
				</el-form-item>
			</el-form>

			<el-button round size="small" class="submit-btn" :loading="saving" @click="toLogin"
				>登录</el-button
			>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Captcha from "./components/captcha.vue";
import { useRefs } from "/@/core";

export default defineComponent({
	cool: {
		route: {
			path: "/login"
		}
	},

	components: {
		Captcha
	},

	setup() {
		const router = useRouter();
		const store = useStore();
		const { refs, setRefs }: any = useRefs();

		const saving = ref<boolean>(false);

		// 登录表单数据
		const form = reactive({
			username: "",
			password: "",
			captchaId: "",
			verifyCode: ""
		});

		// 登录
		async function toLogin() {
			if (!form.username) {
				return ElMessage.warning("用户名不能为空");
			}

			if (!form.password) {
				return ElMessage.warning("密码不能为空");
			}

			if (!form.verifyCode) {
				return ElMessage.warning("图片验证码不能为空");
			}

			saving.value = true;

			try {
				// 登录
				await store.dispatch("userLogin", form);

				// 用户信息
				await store.dispatch("userInfo");

				// 权限菜单
				const [first] = await store.dispatch("permMenu");

				if (!first) {
					ElMessage.error("该账号没有权限");
				} else {
					router.push("/");
				}
			} catch (err) {
				ElMessage.error(err);
				refs.value.captcha.refresh();
			}

			saving.value = false;
		}

		return {
			refs,
			form,
			saving,
			toLogin,
			setRefs
		};
	}
});
</script>

<style lang="scss">
.page-login {
	height: 100vh;
	width: 100vw;
	position: relative;
	background-color: #2f3447;

	.box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 500px;
		width: 500px;
		position: absolute;
		left: calc(50% - 250px);
		top: calc(50% - 250px);

		.logo {
			height: 50px;
			margin-bottom: 20px;
		}

		.desc {
			color: #ccc;
			font-size: 12px;
			margin-bottom: 60px;
			letter-spacing: 1px;
		}

		.el-form {
			width: 300px;
			border-radius: 3px;

			.el-form-item {
				margin-bottom: 20px;

				&__label {
					color: #ccc;
				}
			}

			.el-input {
				.el-input__inner {
					border: 0;
					border-bottom: 0.5px solid #999;
					border-radius: 0;
					padding: 0 5px;
					background-color: transparent;
					color: #ccc;
					transition: border-color 0.3s;
					position: relative;

					&:focus {
						border-color: #fff;
						color: #fff;
					}

					&:-webkit-autofill {
						-webkit-text-fill-color: #fff !important;
						-webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
						transition: background-color 50000s ease-in-out 0s;
					}
				}
			}

			.captcha {
				position: relative;

				.value {
					position: absolute;
					bottom: 1px;
					right: 0;
				}
			}
		}

		.submit-btn {
			margin-top: 40px;
			padding: 9px 40px;
			color: #000;
		}
	}
}
</style>
