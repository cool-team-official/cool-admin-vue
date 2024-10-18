<template>
	<div class="wrap">
		<dict-list />
	</div>
</template>

<script lang="ts" setup>
import { useCool } from '/@/cool';
import DictList from '/$/dict/views/list.vue';

const { service } = useCool();
</script>

<style lang="scss" scoped>
.wrap {
	height: 600px;
	border: 1px solid var(--el-border-color);
}
</style>
