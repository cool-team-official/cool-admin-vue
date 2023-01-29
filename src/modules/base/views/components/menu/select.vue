<template>
	<div class="menu-select">
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
			@change="onChange"
		></el-tree-select>
	</div>
</template>

<script lang="ts" name="menu-select" setup>
import { useForm } from "@cool-vue/crud";
import { cloneDeep } from "lodash-es";
import { computed, onMounted, ref, watch } from "vue";
import { useCool } from "/@/cool";
import { deepTree } from "/@/cool/utils";

const props = defineProps({
	modelValue: [Number, String],
	type: {
		type: Number,
		default: 1
	}
});

const emit = defineEmits(["update:modelValue"]);

// 请求服务
const { service } = useCool();

const Form = useForm();

// 绑定值
const value = ref();

// 菜单列表
const list = ref<any[]>([]);

// 树形列表
const tree = computed(() => {
	return deepTree(
		cloneDeep(list.value).filter((e) => (props.type === 0 ? e.type == 0 : props.type > e.type))
	);
});

// 刷新列表
function refresh() {
	service.base.sys.menu.list().then((res) => {
		list.value = res.filter((e) => e.isShow && e.id != Form.value?.form.id);
	});
}

// 绑定值回调
function onChange(id: number) {
	emit("update:modelValue", id);
}

watch(
	() => props.modelValue,
	(val) => {
		value.value = val ? Number(val) : val;
	},
	{
		immediate: true
	}
);

onMounted(function () {
	refresh();
});
</script>

<style lang="scss" scoped>
.menu-select {
	:deep(.el-select) {
		width: 100%;
	}
}
</style>
