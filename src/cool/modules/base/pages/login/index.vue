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
				username: "admin",
				password: "123456",
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
	position: relative;
	width: 100vw;
	height: 100vh;
	background-color: #2f3447;

	.box {
		position: absolute;
		top: calc(50% - 250px);
		left: calc(50% - 250px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 500px;
		height: 500px;

		.logo {
			height: 50px;
			margin-bottom: 20px;
		}

		.desc {
			margin-bottom: 60px;
			color: #ccc;
			font-size: 12px;
			letter-spacing: 1px;
		}

		/deep/ .el-form {
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
					position: relative;
					padding: 0 5px;
					color: #ccc;
					background-color: transparent;
					border: 0;
					border-bottom: 0.5px solid #999;
					border-radius: 0;
					transition: border-color 0.3s;

					&:focus {
						color: #fff;
						border-color: #fff;
					}

					&:-webkit-autofill {
						transition: background-color 50000s ease-in-out 0s;

						-webkit-box-shadow: 0 0 0 1000px transparent inset !important;
						-webkit-text-fill-color: #fff !important;
					}
				}
			}

			.captcha {
				position: relative;

				.value {
					position: absolute;
					right: 0;
					bottom: 1px;
				}
			}
		}

		.submit-btn {
			padding: 10px 40px;
			margin-top: 40px;
			color: #000;
			border-radius: 30px;
		}
	}
}
</style>
