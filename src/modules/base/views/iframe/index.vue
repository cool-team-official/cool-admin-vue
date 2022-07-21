<template>
	<div v-loading="loading" class="page-iframe" element-loading-text="拼命加载中">
		<iframe :src="url" frameborder="0"></iframe>
	</div>
</template>

<script>
export default {
	data() {
		return {
			loading: false,
			url: ""
		};
	},

	watch: {
		$route: {
			handler({ meta }) {
				this.url = meta.iframeUrl;
			},
			immediate: true
		}
	},

	mounted() {
		const iframe = this.$el.querySelector("iframe");
		this.loading = true;

		iframe.onload = () => {
			this.loading = false;
		};
	}
};
</script>

<style lang="scss" scoped>
.page-iframe {
	iframe {
		height: 100%;
		width: 100%;
	}
}
</style>
