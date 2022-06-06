<template>
	<div class="view-my">
		<div class="title">基本信息</div>

		<el-form label-width="100px" :model="form" :disabled="saving">
			<el-form-item label="头像">
				<cl-upload v-model="form.headImg" />
			</el-form-item>

			<el-form-item label="昵称">
				<el-input v-model="form.nickName" placeholder="请填写昵称" />
			</el-form-item>

			<el-form-item label="密码">
				<el-input v-model="form.password" type="password" />
			</el-form-item>

			<el-form-item>
				<el-button type="primary" :disabled="saving" @click="save">保存修改</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts">
export default {
	name: "my-info",

	cool: {
		route: {
			path: "/my/info",
			meta: {
				label: "个人中心"
			}
		}
	}
};
</script>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { useBase } from "/$/base";
import { useCool } from "/@/cool";
import { cloneDeep } from "lodash";

const { service } = useCool();
const { user } = useBase();

// 表单数据
const form = reactive<any>(cloneDeep(user.info));

// 保存状态
const saving = ref<boolean>(false);

// 保存
async function save() {
	const { headImg, nickName, password } = form;

	saving.value = true;

	await service.base.comm
		.personUpdate({
			headImg,
			nickName,
			password
		})
		.then(() => {
			form.password = "";
			ElMessage.success("修改成功");
			user.get();
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});

	saving.value = false;
}
</script>

<style lang="scss">
.view-my {
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
