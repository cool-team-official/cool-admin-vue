<template>
	<div class="pic-captcha" @click="refresh">
		<div v-if="svg" class="svg" v-html="svg" />
		<img v-else-if="base64" class="base64" :src="base64" alt="" />

		<template v-else-if="isError">
			<el-text type="danger"> 后端未启动 </el-text>
			<el-icon color="#f56c6c" :size="16">
				<warning-filled />
			</el-icon>
		</template>

		<template v-else>
			<el-icon class="is-loading" :size="18">
				<loading />
			</el-icon>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { Loading, WarningFilled } from "@element-plus/icons-vue";
import { useCool } from "/@/cool";

const emit = defineEmits(["update:modelValue", "change"]);

const { service } = useCool();

// 是否异常
const isError = ref(false);

// base64
const base64 = ref("");

// svg
const svg = ref("");

// 刷新
async function refresh() {
	isError.value = false;
	svg.value = "";
	base64.value = "";

	await service.base.open
		.captcha({
			height: 45,
			width: 150,
			color: "#2c3142"
		})
		.then(({ captchaId, data }) => {
			if (data) {
				if (data.includes(";base64,")) {
					base64.value = data;
				} else {
					svg.value = data;
				}

				emit("update:modelValue", captchaId);
				emit("change", {
					base64,
					svg,
					captchaId
				});
			} else {
				ElMessage.error("验证码获取失败");
			}
		})
		.catch((err) => {
			ElMessage.error(err.message);
			isError.value = true;
		});
}

onMounted(() => {
	refresh();
});

defineExpose({
	refresh
});
</script>

<style lang="scss" scoped>
.pic-captcha {
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	height: 45px;
	width: 150px;
	position: relative;
	user-select: none;

	.svg {
		height: 100%;
		position: relative;
	}

	.base64 {
		height: 100%;
	}

	.el-icon {
		position: absolute;
		right: 20px;
	}
}
</style>
