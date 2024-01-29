<template>
	<div class="cl-menu-select">
		<el-tree-select
			v-model="value"
			:data="tree"
			:props="{
				label: 'name',
				value: 'id',
				disabled: 'disabled',
				children: 'children'
			}"
			clearable
			default-expand-all
			check-strictly
			filterable
			:size="size"
			:placeholder="placeholder"
		/>
	</div>
</template>

<script lang="ts" name="cl-menu-select" setup>
import { useForm, useUpsert } from "@cool-vue/crud";
import { cloneDeep } from "lodash-es";
import { computed, ref, useModel } from "vue";
import { useCool } from "/@/cool";
import { deepTree } from "/@/cool/utils";

const props = defineProps({
	modelValue: [Number, String],
	type: {
		type: Number,
		default: 1
	},
	placeholder: String,
	size: String
});

const emit = defineEmits(["update:modelValue"]);

const { service } = useCool();
const Form = useForm();

// 绑定值
const value = useModel(props, "modelValue", {
	get(val) {
		return val ? Number(val) : val;
	}
});

// 菜单列表
const list = ref<any[]>([]);

// 树形列表
const tree = computed(() => {
	return deepTree(cloneDeep(list.value)).filter((e) => !e.parentId);
});

// 刷新列表
async function refresh() {
	return service.base.sys.menu.list().then((res) => {
		// 过滤掉自己和下级的数据
		list.value = res.filter(
			(e) =>
				e.id != Form.value?.form.id &&
				(props.type === 0 ? e.type == 0 : props.type > e.type!)
		);
	});
}

useUpsert({
	onOpened() {
		refresh();
	}
});
</script>

<style lang="scss" scoped>
.cl-menu-select {
	:deep(.el-select) {
		width: 100%;
	}
}
</style>
