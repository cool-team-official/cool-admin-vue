<template>
	<div class="user-info">
		<cl-avatar :size="36" />

		<div class="det">
			<p>{{ scope?.name }}</p>
		</div>
	</div>
</template>

<!-- name 必须填写且唯一 -->
<script setup lang="ts" name="user-info">
const props = defineProps({
	prop: String, // 列配置的 prop
	scope: null // 列数据
});
</script>

<style lang="scss" scoped>
.user-info {
	display: flex;
	align-items: center;

	.det {
		flex: 1;
		margin-left: 10px;
		text-align: left;
	}
}
</style>
