<template>
	<div class="dept-select">
		<el-tree-select
			v-model="value"
			node-key="id"
			:data="list"
			:props="{
				label: 'name',
				value: 'id',
				children: 'children'
			}"
			:multiple="multiple"
			:check-strictly="checkStrictly"
			:show-checkbox="multiple"
			default-expand-all
			@change="onChange"
			@check="onCheckChange"
		></el-tree-select>
	</div>
</template>

<script lang="ts" name="dept-select" setup>
import { ElMessage } from "element-plus";
import { onMounted, ref, watch } from "vue";
import { useCool } from "/@/cool";
import { deepTree } from "/@/cool/utils";

const props = defineProps({
	modelValue: [Array, Number, String],
	multiple: Boolean,
	checkStrictly: {
		type: Boolean,
		default: true
	}
});

const emit = defineEmits(["update:modelValue", "change"]);

const { service } = useCool();

const value = ref();

const list = ref();

// 单选改变
function onChange(val: string) {
	if (!props.multiple) {
		emit("update:modelValue", val);
	}
}

// 多选改变
function onCheckChange(_: any, { checkedKeys }: any) {
	if (props.multiple) {
		emit("update:modelValue", checkedKeys);
	}
}

// 刷新
function refresh() {
	service.base.sys.department
		.list()
		.then((res) => {
			list.value = deepTree(res);
		})
		.catch((err) => {
			list.value = [];
			ElMessage.error(err.message);
		});
}

watch(
	() => props.modelValue,
	(val) => {
		value.value = val;
	},
	{
		immediate: true
	}
);

onMounted(() => {
	refresh();
});
</script>

<style lang="scss" scoped>
.dept-select {
	:deep(.el-select) {
		width: 100%;
	}
}
</style>
