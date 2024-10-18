<template>
	<div class="page">
		<el-descriptions title="动态路由参数" border :column="1">
			<el-descriptions-item label="ID">{{ $route.params.id || '-' }}</el-descriptions-item>
			<el-descriptions-item label="Name">{{ name || '无' }}</el-descriptions-item>
		</el-descriptions>

		<div class="op">
			<el-button @click="toLink(1)">链接1</el-button>
			<el-button @click="toLink(2)">链接2</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { random } from 'lodash-es';
import { useCool } from '/@/cool';

const props = defineProps({
	id: String,
	name: String
});

const { router } = useCool();

function toLink(n: number) {
	switch (n) {
		case 1:
			router.push(`/demo/test/route/${random(100)}/神仙都没用`);
			break;

		case 2:
			router.push(`/demo/test/route/${random(100)}`);
			break;
	}
}
</script>

<style lang="scss" scoped>
.page {
	background-color: var(--el-bg-color);
	padding: 10px;

	:deep(.el-descriptions__label) {
		width: 100px;
	}

	.op {
		margin-top: 20px;
	}
}
</style>
