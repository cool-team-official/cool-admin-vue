<template>
	<div class="scope">
		<div class="h">
			<span>cl-upload</span>
			图片上传
		</div>
		<div class="c">
			<router-link to="/upload">传送门</router-link>
		</div>
		<div class="f">
			<span class="date">2019/09/25</span>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			avatar: "",
			avatar2: ""
		};
	},

	methods: {
		onSuccess() {
			this.$message.success("上传成功");
		}
	}
};
</script>

<style lang="scss" scoped>
.scope {
	.label {
		display: inline-block;
		font-size: 12px;
		padding-bottom: 10px;
	}
}
</style>
