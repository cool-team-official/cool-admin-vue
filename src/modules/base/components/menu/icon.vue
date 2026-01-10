<template>
	<div class="cl-menu-icon">
		<div class="cl-menu-icon__current" v-if="showIcon && modelValue">
			<cl-svg :name="modelValue" />
		</div>

		<el-select v-model="value" filterable fit-input-width clearable @clear="onClear">
			<div class="cl-menu-icon__list">
				<el-option v-for="item in list" :key="item" :value="item">
					<cl-svg :name="item" />
				</el-option>
			</div>
		</el-select>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'cl-menu-icon'
});

import { ref, useModel } from 'vue';
import { svgIcons } from 'virtual:svg-icons';

const props = defineProps({
	modelValue: {
		type: String,
		default: ''
	},
	showIcon: Boolean
});

const emit = defineEmits(['update:modelValue']);

// 图标列表
const list = ref(svgIcons.filter(e => e.indexOf('icon-') === 0));

// 已选图标
const value = useModel(props, 'modelValue');

// 处理清空事件
function onClear() {
	value.value = '';
}
</script>

<style lang="scss" scoped>
.cl-menu-icon {
	display: flex;
	align-items: center;

	&__current {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 5px;
		border: 1px solid var(--el-border-color);
		height: 32px;
		width: 32px;
		border-radius: var(--el-border-radius-base);
		box-sizing: border-box;
		flex-shrink: 0;

		.cl-svg {
			font-size: 16px;
		}
	}

	&__list {
		display: flex;
		flex-wrap: wrap;
		padding-left: 5px;

		.el-select-dropdown__item {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			height: 50px;
			width: 50px;
			border-radius: 4px;
		}

		.cl-svg {
			font-size: 18px;
		}
	}
}
</style>
