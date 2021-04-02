<template>
	<div class="page-my-info">
		<div class="title">基本信息</div>

		<el-form size="small" label-width="100px" :model="form" :disabled="saving">
			<el-form-item label="头像">
				<cl-upload v-model="form.headImg" />
			</el-form-item>

			<el-form-item label="昵称">
				<el-input v-model="form.nickName" placeholder="请填写昵称" />
			</el-form-item>

			<el-form-item label="密码">
				<el-input v-model="form.password" type="password" />
			</el-form-item>

			<el-form-item label="">
				<el-button type="primary" :disabled="saving" @click="save">保存修改</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, inject, reactive, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
	name: "sys-info",

	setup() {
		const store = useStore();
		const service = inject<any>("service");

		// 表单数据
		const form = reactive<any>(store.getters.userInfo);

		// 保存状态
		const saving = ref<boolean>(false);

		// 保存
		async function save() {
			const { headImg, nickName, password } = form;

			saving.value = true;

			await service.common
				.userUpdate({
					headImg,
					nickName,
					password
				})
				.then(() => {
					form.password = "";
					ElMessage.success("修改成功");
					store.dispatch("userInfo");
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});

			saving.value = false;
		}

		return {
			form,
			saving,
			save
		};
	}
});
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
