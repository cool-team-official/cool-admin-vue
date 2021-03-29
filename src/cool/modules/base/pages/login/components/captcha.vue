<template>
	<div class="login-captcha" @click="refresh">
		<div class="svg" v-html="svg" v-if="svg"></div>
		<img class="base64" :src="base64" alt="" v-else />
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import { ElMessage } from "element-plus";

export default defineComponent({
	emits: ["update:modelValue", "change"],

	setup(_, { emit }) {
		const base64 = ref("");
		const svg = ref("");
		const $service = inject<any>("service");

		const refresh = () => {
			$service.open
				.captcha({
					height: 36,
					width: 110
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
				.catch((err: string) => {
					ElMessage.error(err);
				});
		};

		refresh();

		return {
			base64,
			svg,
			refresh
		};
	}
});
</script>

<style lang="scss" scoped>
.login-captcha {
	height: 36px;
	cursor: pointer;

	.svg {
		height: 100%;
	}

	.base64 {
		height: 100%;
	}
}
</style>
