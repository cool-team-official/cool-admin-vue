<template>
	<div class="page-login">
		<div class="box">
			<div class="logo">
				<div class="icon">
					<img src="/logo.png" alt="Logo" />
				</div>

				<span>{{ app.info.name }}</span>
			</div>

			<p class="desc">{{ $t('快速开发后台权限管理系统') }}</p>

			<div class="form">
				<el-form label-position="top" class="form" :disabled="saving">
					<el-form-item :label="$t('用户名')">
						<el-input
							v-model="form.username"
							:placeholder="$t('请输入用户名')"
							maxlength="20"
						/>
					</el-form-item>

					<el-form-item :label="$t('密码')">
						<el-input
							v-model="form.password"
							type="password"
							:placeholder="$t('请输入密码')"
							maxlength="20"
							show-password
							autocomplete="new-password"
						/>
					</el-form-item>

					<el-form-item :label="$t('验证码')">
						<el-input
							v-model="form.verifyCode"
							:placeholder="$t('验证码')"
							maxlength="4"
							@keyup.enter="toLogin"
						>
							<template #suffix>
								<pic-captcha
									:ref="setRefs('picCaptcha')"
									v-model="form.captchaId"
									@change="
										() => {
											form.verifyCode = '';
										}
									"
								/>
							</template>
						</el-input>
					</el-form-item>

					<div class="op">
						<el-button type="primary" :loading="saving" @click="toLogin">
							{{ $t('登录') }}
						</el-button>
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

<script lang="ts" setup>
defineOptions({
	name: 'login'
});

import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useCool } from '/@/cool';
import { useBase } from '/$/base';
import { storage } from '/@/cool/utils';
import { useI18n } from 'vue-i18n';
import PicCaptcha from './components/pic-captcha.vue';

const { refs, setRefs, router, service } = useCool();
const { user, app } = useBase();
const { t } = useI18n();

// 状态
const saving = ref(false);

// 表单数据
const form = reactive({
	username: storage.get('username') || '',
	password: '',
	captchaId: '',
	verifyCode: ''
});

// 演示模式
if (import.meta.env.MODE == 'demo') {
	form.username = 'admin';
	form.password = '123456';
}

// 登录
async function toLogin() {
	if (!form.username) {
		return ElMessage.error(t('用户名不能为空'));
	}

	if (!form.password) {
		return ElMessage.error(t('密码不能为空'));
	}

	if (!form.verifyCode) {
		return ElMessage.error(t('图片验证码不能为空'));
	}

	saving.value = true;

	try {
		// 登录
		await service.base.open.login(form).then(user.setToken);

		// token 事件
		await Promise.all(app.events.hasToken.map(e => e()));

		// 设置缓存
		storage.set('username', form.username);

		// 跳转首页
		router.push('/');
	} catch (err) {
		// 刷新验证码
		refs.picCaptcha.refresh();

		// 提示错误
		ElMessageBox.alert((err as Error).message, {
			title: t('提示'),
			type: 'error'
		});
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
		}
	}

	.copyright {
		position: absolute;
		bottom: 15px;
		left: 0;
		text-align: center;
		width: 100%;
		color: var(--el-color-info);
		font-size: 14px;
		user-select: none;
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
			user-select: none;

			.icon {
				border-radius: 8px;
				padding: 5px;
				margin-right: 10px;
				background-color: $color;

				img {
					height: 36px;
				}
			}

			span {
				font-size: 38px;
				font-weight: bold;
				line-height: 1;
				letter-spacing: 3px;
			}
		}

		.desc {
			font-size: 15px;
			letter-spacing: 1px;
			margin-bottom: 50px;
			user-select: none;
			max-width: 80%;
			text-align: center;
		}

		.form {
			width: 300px;

			:deep(.el-form) {
				.el-form-item {
					margin-bottom: 20px;
				}

				.el-form-item__label {
					color: var(--el-color-info);
					padding-left: 5px;
					user-select: none;
				}

				.el-input {
					box-sizing: border-box;
					font-size: 15px;
					border: 0;
					border-radius: 0;
					background-color: #f8f8f8;
					padding: 0 5px;
					border-radius: 8px;
					position: relative;

					&__wrapper {
						box-shadow: none;
						background-color: transparent;
					}

					&__inner {
						height: 45px;
						color: #333;
						&:-webkit-autofill {
						-webkit-box-shadow: 0 0 0 1000px #f8f8f8 inset;
						box-shadow: 0 0 0 1000px #f8f8f8 inset;
					}
					}
				}
			}

			:deep(.pic-captcha) {
				position: absolute;
				right: -5px;
				top: 0;
			}
		}

		.op {
			display: flex;
			justify-content: center;
			margin-top: 40px;

			:deep(.el-button) {
				height: 45px;
				width: 100%;
				font-size: 16px;
				border-radius: 8px;
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
