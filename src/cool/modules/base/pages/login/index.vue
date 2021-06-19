<template>
	<div class="page-login">
		<div class="box">
			<img class="logo" src="../../static/images/logo.png" alt="" />
			<p class="desc">COOL ADMIN是一款快速开发后台权限管理系统</p>

			<el-form ref="form" class="form" size="medium" :disabled="saving">
				<el-form-item label="用户名">
					<el-input
						placeholder="请输入用户名"
						v-model="form.username"
						maxlength="20"
						auto-complete="off"
					></el-input>
				</el-form-item>

				<el-form-item label="密码">
					<el-input
						type="password"
						placeholder="请输入密码"
						v-model="form.password"
						maxlength="20"
						auto-complete="off"
					></el-input>
				</el-form-item>

				<el-form-item label="验证码" class="captcha">
					<el-input
						placeholder="请输入图片验证码"
						maxlength="4"
						v-model="form.verifyCode"
						auto-complete="off"
						@keyup.enter.native="next"
					></el-input>

					<captcha
						ref="captcha"
						class="value"
						v-model="form.captchaId"
						@change="captchaChange"
					></captcha>
				</el-form-item>
			</el-form>

			<el-button round size="mini" class="submit-btn" @click="next" :loading="saving"
				>登录</el-button
			>
		</div>
	</div>
</template>

<script>
import Captcha from "./components/captcha";

export default {
	components: {
		Captcha
	},

	data() {
		return {
			form: {
				username: "",
				password: "",
				captchaId: "",
				verifyCode: ""
			},
			saving: false
		};
	},

	methods: {
		captchaChange() {
			this.form.verifyCode = "";
		},

		async next() {
			const { username, password, verifyCode } = this.form;

			if (!username) {
				return this.$message.warning("用户名不能为空");
			}

			if (!password) {
				return this.$message.warning("密码不能为空");
			}

			if (!verifyCode) {
				return this.$message.warning("图片验证码不能为空");
			}

			this.saving = true;

			try {
				// 登录
				await this.$store.dispatch("userLogin", this.form);

				// 用户信息
				await this.$store.dispatch("userInfo");

				// 权限菜单
				let [first] = await this.$store.dispatch("permMenu");

				if (!first) {
					this.$message.error("该账号没有权限");
				} else {
					this.$router.push("/");
				}
			} catch (err) {
				this.$message.error(err);
				this.$refs.captcha.refresh();
			}

			this.saving = false;
		}
	}
};
</script>

<style lang="scss" scoped>
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
		/deep/.el-form {
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
			border-radius: 30px;
			padding: 10px 40px;
			color: #000;
		}
	}
}
</style>
