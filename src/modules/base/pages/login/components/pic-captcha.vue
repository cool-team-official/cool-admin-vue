<template>
	<div class="pic-captcha" @click="refresh">
		<div v-if="svg" class="svg" v-html="svg" />
		<img v-else-if="base64" class="base64" :src="base64" alt="" />

		<template v-else>
			<el-icon class="is-loading">
				<Loading />
			</el-icon>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { Loading } from "@element-plus/icons-vue";
import { useCool } from "/@/cool";

const emit = defineEmits(["update:modelValue", "change"]);

const { service } = useCool();

// base64
const base64 = ref("");

// svg
const svg = ref("");

async function refresh() {
	await service.base.open
		.captcha({
			height: 45,
			width: 150,
			color: "#2c3142"
		})
		.then(({ captchaId, data }) => {
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
		})
		.catch((err) => {
			ElMessage.error(err.message);
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

	.svg {
		height: 100%;
		position: relative;
	}

	.base64 {
		height: 100%;
	}

	.el-icon {
		position: absolute;
		font-size: 22px;
		right: 20px;
	}
}
</style>
