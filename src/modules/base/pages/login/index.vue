<template>
	<div class="page-login">
		<div class="box">
			<div class="logo">
				<img src="/logo.png" alt="Logo" />
				<div class="name">
					<span v-for="text in app.info.name" :key="text">{{ text }}</span>
				</div>
			</div>

			<p class="desc">快速开发后台权限管理系统</p>

			<div class="form">
				<el-form label-position="top" class="form" :disabled="saving">
					<el-form-item label="用户名">
						<input
							v-model="form.username"
							placeholder="请输入用户名"
							maxlength="20"
							type="text"
							:readonly="readonly"
							autocomplete="off"
							@focus="readonly = false"
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

							<pic-captcha
								:ref="setRefs('picCaptcha')"
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
						<el-button type="primary" :loading="saving" @click="toLogin"
							>登录</el-button
						>
					</div>
				</el-form>
			</div>
		</div>

		<div class="bg">
			<cl-svg name="bg"></cl-svg>
		</div>

		<a href="https://cool-js.com" class="copyright"> Copyright © COOL </a>
	</div>
</template>

<script lang="ts" name="login" setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";
import { useBase } from "/$/base";
import PicCaptcha from "./components/pic-captcha.vue";
import { storage } from "/@/cool/utils";

const { refs, setRefs, router, service } = useCool();
const { user, app } = useBase();

// 状态
const saving = ref(false);

// 避免自动填充
const readonly = ref(true);

// 表单数据
const form = reactive({
	username: storage.get("username") || "",
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
		await service.base.open.login(form).then(user.setToken);

		// token 事件
		await Promise.all(app.events.hasToken.map((e) => e()));

		// 设置缓存
		storage.set("username", form.username);

		// 跳转首页
		router.push("/");
	} catch (err: any) {
		// 刷新验证码
		refs.picCaptcha.refresh();

		// 提示错误
		ElMessage.error(err.message);
	}

	saving.value = false;
}
</script>

<style lang="scss" scoped>
$color: #2c3142;

.page-login {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
	position: relative;
	background-color: #fff;
	color: $color;

	.bg {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 90%;
		pointer-events: none;
		transform: rotate(180deg) scaleY(-1);

		.cl-svg {
			height: 100%;
			width: 100%;
			fill: $color;
		}
	}

	.copyright {
		position: absolute;
		bottom: 15px;
		left: 0;
		text-align: center;
		width: 100%;
		color: #666;
		font-size: 14px;
	}

	.box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		width: 50%;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 9;

		.logo {
			height: 50px;
			margin-bottom: 20px;
			display: flex;
			align-items: center;

			img {
				height: 46px;
				background-color: $color;
				border-radius: 50px;
				border: 3px solid $color;
				margin-right: 10px;
			}

			span {
				display: inline-block;
				font-size: 38px;
				font-weight: bold;
				line-height: 1;
				letter-spacing: 3px;

				&:nth-child(6) {
					animation: dou 1s infinite linear;
				}
			}
		}

		.desc {
			font-size: 15px;
			letter-spacing: 1px;
			margin-bottom: 50px;
		}

		.form {
			width: 300px;

			:deep(.el-form) {
				.el-form-item {
					margin-bottom: 20px;
				}

				.el-form-item__label {
					padding-left: 5px;
				}

				input {
					height: 45px;
					width: 100%;
					box-sizing: border-box;
					font-size: 17px;
					border: 0;
					border-radius: 0;
					background-color: #f8f8f8;
					padding: 0 15px;
					border-radius: 6px;
					position: relative;

					&:-webkit-autofill {
						box-shadow: none;
						-webkit-box-shadow: 0 0 0 1000px #f8f8f8 inset;
						box-shadow: 0 0 0 1000px #f8f8f8 inset;
					}

					&::placeholder {
						font-size: 14px;
					}
				}

				.row {
					display: flex;
					align-items: center;
					width: 100%;
					position: relative;

					.pic-captcha {
						position: absolute;
						right: 0;
						top: 0;
					}
				}
			}
		}

		.op {
			display: flex;
			justify-content: center;
			margin-top: 40px;

			:deep(.el-button) {
				height: 45px;
				width: 100%;
				font-size: 15px;
				border-radius: 6px;
				letter-spacing: 1px;
			}
		}
	}
}

@media screen and (max-width: 1024px) {
	.page-login {
		.box {
			width: 100%;
		}
	}
}
</style>
