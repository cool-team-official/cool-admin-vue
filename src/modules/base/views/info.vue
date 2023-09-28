<template>
	<div class="view-my">
		<div class="title">基本信息</div>

		<el-form label-width="100px" :model="form" :disabled="loading">
			<el-form-item label="头像">
				<cl-upload is-space v-model="form.headImg" />
			</el-form-item>

			<el-form-item label="昵称">
				<el-input v-model="form.nickName" placeholder="请填写昵称" clearable />
			</el-form-item>

			<el-form-item label="原密码">
				<el-input
					v-model="form.oldPassword"
					type="password"
					placeholder="请填写原密码"
					clearable
				/>
			</el-form-item>

			<el-form-item label="新密码">
				<el-input
					v-model="form.password"
					type="password"
					placeholder="请填写新密码"
					clearable
				/>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" :disabled="loading" @click="save">保存修改</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts" name="my-info" setup>
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import { useBase } from "/$/base";
import { useCool } from "/@/cool";

const { service } = useCool();
const { user } = useBase();

// 表单数据
const form = reactive({
	headImg: "",
	nickName: "",
	password: "",
	oldPassword: ""
});

// 保存状态
const loading = ref(false);

// 保存
async function save() {
	loading.value = true;

	await service.base.comm
		.personUpdate(form)
		.then(() => {
			form.password = "";
			form.oldPassword = "";

			ElMessage.success("修改成功");
			user.get();
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});

	loading.value = false;
}

onMounted(() => {
	form.headImg = user.info?.headImg || "";
	form.nickName = user.info?.nickName || "";
});
</script>

<style lang="scss">
.view-my {
	background-color: var(--el-bg-color);
	height: 100%;
	padding: 20px;
	box-sizing: border-box;

	.el-form {
		width: 400px;
		max-width: 100%;
	}

	.title {
		margin-bottom: 30px;
		font-size: 15px;
	}
}
</style>
