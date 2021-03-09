<template>
	<div class="common-captcha" @click="refresh">
		<div class="svg" v-html="svg" v-if="svg"></div>

		<img class="base64" :src="base64" alt="" v-else />
	</div>
</template>

<script>
export default {
	data() {
		return {
			svg: "",
			base64: ""
		};
	},

	mounted() {
		this.refresh();
	},

	methods: {
		refresh() {
			this.$service.open
				.captcha({
					height: 36,
					width: 110
				})
				.then(({ captchaId, data }) => {
					if (data.includes(";base64,")) {
						this.base64 = data;
					} else {
						this.svg = data;
					}

					this.$emit("input", captchaId);
					this.$emit("change", {
						base64: this.base64,
						svg: this.svg,
						captchaId
					});
				})
				.catch(err => {
					this.$message.error(err);
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.common-captcha {
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
