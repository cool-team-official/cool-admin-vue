<template>
	<el-select filterable v-model="value" fit-input-width>
		<div class="cl-menu-icon">
			<el-option :value="item" v-for="item in list" :key="item">
				<cl-svg :name="item" />
			</el-option>
		</div>
	</el-select>
</template>

<script lang="ts" name="cl-menu-icon" setup>
import { ref, useModel } from "vue";
import { svgIcons } from "virtual:svg-icons";

const props = defineProps({
	modelValue: {
		type: String,
		default: ""
	}
});

const emit = defineEmits(["update:modelValue"]);

// 图标列表
const list = ref(svgIcons.filter((e) => e.indexOf("icon-") === 0));

// 已选图标
const value = useModel(props, "modelValue");
</script>

<style lang="scss" scoped>
.cl-menu-icon {
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
</style>
