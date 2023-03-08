<template>
	<div class="captcha" @click="refresh">
		<div v-if="svg" class="svg" v-html="svg" />
		<img v-else class="base64" :src="base64" alt="" />
	</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";

const emit = defineEmits(["update:modelValue", "change"]);

const { service } = useCool();

// base64
const base64 = ref("");

// svg
const svg = ref("");

function refresh() {
	service.base.open
		.captcha({
			height: 40,
			width: 150
		})
		.then(({ captchaId, data }: any) => {
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
.captcha {
	height: 40px;
	width: 150px;
	cursor: pointer;

	.svg {
		height: 100%;
		position: relative;
	}

	.base64 {
		height: 100%;
	}
}
</style>
