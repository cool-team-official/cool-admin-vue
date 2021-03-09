<template>
	<div class="page-my-info">
		<div class="title">基本信息</div>

		<el-form size="small" label-width="100px" :model="form" :disabled="saving">
			<el-form-item label="头像">
				<cl-upload v-model="form.headImg"></cl-upload>
			</el-form-item>

			<el-form-item label="昵称">
				<el-input v-model="form.nickName" placeholder="请填写昵称"></el-input>
			</el-form-item>

			<el-form-item label="密码">
				<el-input type="password" v-model="form.password"></el-input>
			</el-form-item>

			<el-form-item label="">
				<el-button type="primary" @click="save" :disabled="saving">保存修改</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	data() {
		return {
			form: {},
			saving: false
		};
	},

	computed: {
		...mapGetters(["userInfo"])
	},

	mounted() {
		this.form = this.userInfo;
	},

	methods: {
		save() {
			this.saving = true;

			const { headImg, nickName, password } = this.form;

			this.$service.common
				.userUpdate({
					headImg,
					nickName,
					password
				})
				.then(() => {
					this.form.password = "";
					this.$message.success("修改成功");
					this.$store.dispatch("userInfo");
				})
				.catch(err => {
					this.$message.error(err);
				})
				.done(() => {
					this.saving = false;
				});
		}
	}
};
</script>

<style lang="scss">
.page-my-info {
	background-color: #fff;
	height: 100%;
	padding: 20px;
	box-sizing: border-box;

	.el-form {
		width: 400px;
		max-width: 100%;
	}

	.title {
		color: #000;
		margin-bottom: 30px;
		font-size: 15px;
	}
}
</style>
