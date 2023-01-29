<template>
	<div class="page-login">
		<div class="box">
			<div class="logo">
				<img src="/logo.png" alt="Logo" />
				<span>{{ app.info.name }}</span>
			</div>
			<p class="desc">一款快速开发后台权限管理系统</p>

			<el-form label-position="top" class="form" :disabled="saving">
				<el-form-item label="用户名">
					<input
						v-model="form.username"
						placeholder="请输入用户名"
						maxlength="20"
						autocomplete="on"
					/>
				</el-form-item>

				<el-form-item label="密码">
					<input
						v-model="form.password"
						type="password"
						placeholder="请输入密码"
						maxlength="20"
						autocomplete="off"
					/>
				</el-form-item>

				<el-form-item label="验证码">
					<div class="row">
						<input
							v-model="form.verifyCode"
							placeholder="图片验证码"
							maxlength="4"
							@keyup.enter="toLogin"
						/>

						<captcha
							:ref="setRefs('captcha')"
							v-model="form.captchaId"
							@change="
								() => {
									form.verifyCode = '';
								}
							"
						/>
					</div>
				</el-form-item>

				<div class="op">
					<el-button round :loading="saving" @click="toLogin">登录</el-button>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" name="login" setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";
import { useBase } from "/$/base";
import Captcha from "./components/captcha.vue";

const { refs, setRefs, router, service } = useCool();
const { user, app } = useBase();

// 状态1
const saving = ref(false);

// 表单数据
const form = reactive({
	username: "",
	password: "",
	captchaId: "",
	verifyCode: ""
});

// 登录
async function toLogin() {
	if (!form.username) {
		return ElMessage.error("用户名不能为空");
	}

	if (!form.password) {
		return ElMessage.error("密码不能为空");
	}

	if (!form.verifyCode) {
		return ElMessage.error("图片验证码不能为空");
	}

	saving.value = true;

	try {
		// 登录
		await service.base.open.login(form).then((res) => {
			user.setToken(res);
		});

		// token 事件
		await Promise.all(app.events.hasToken.map((e) => e()));

		// 跳转
		router.push("/");
	} catch (err: any) {
		refs.captcha.refresh();
		ElMessage.error(err.message);
	}

	saving.value = false;
}
</script>

<style lang="scss" scoped>
.page-login {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	position: relative;
	background-color: #2f3447;

	.box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.logo {
			height: 50px;
			margin-bottom: 30px;
			display: flex;
			align-items: center;
			color: #fff;

			img {
				height: 50px;
			}

			span {
				font-size: 38px;
				margin-left: 10px;
				letter-spacing: 5px;
				font-weight: bold;
			}
		}

		.desc {
			color: #eee;
			font-size: 14px;
			letter-spacing: 1px;
			margin-bottom: 50px;
		}

		.el-form {
			width: 300px;

			:deep(.el-form-item) {
				margin-bottom: 20px;

				.el-form-item__label {
					color: #ccc;
				}
			}

			input {
				background-color: transparent;
				color: #fff;
				border: 0;
				height: 40px;
				width: calc(100% - 4px);
				margin: 0 2px;
				padding: 0 2px;
				box-sizing: border-box;
				-webkit-text-fill-color: #fff;
				font-size: 15px;
				border-bottom: 1px solid rgba(255, 255, 255, 0.5);
				border-radius: 0;

				&:-webkit-autofill {
					box-shadow: 0 0 0px 1000px transparent inset !important;
					transition: background-color 50000s ease-in-out 0s;
				}

				&::-webkit-input-placeholder {
					font-size: 12px;
				}

				&:focus {
					border-color: #fff;
				}
			}

			.row {
				display: flex;
				align-items: center;
				width: 100%;
				position: relative;

				.captcha {
					position: absolute;
					right: 0;
					bottom: 1px;
				}
			}
		}

		.op {
			display: flex;
			justify-content: center;
			margin-top: 50px;

			:deep(.el-button) {
				height: 40px;
				width: 140px;
				font-size: 16px;
			}
		}
	}
}
</style>
