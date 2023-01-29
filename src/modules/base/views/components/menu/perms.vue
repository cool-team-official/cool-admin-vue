<template>
	<div class="menu-perms">
		<el-cascader
			v-model="value"
			separator=":"
			clearable
			filterable
			collapse-tags
			collapse-tags-tooltip
			:options="data"
			:props="{ multiple: true }"
			@change="onChange"
		/>
	</div>
</template>

<script lang="ts" name="menu-perms" setup>
import { onMounted, ref, watch } from "vue";
import { useCool } from "/@/cool";
import { deepPaths } from "/@/cool/utils";

const props = defineProps({
	modelValue: {
		type: String,
		default: ""
	}
});

const emit = defineEmits(["update:modelValue"]);

const { service } = useCool();

// 绑定值
const value = ref<string[][]>([]);

// 权限列表
const data = ref<any[]>([]);

// 监听改变
function onChange(arr: string[][]) {
	emit("update:modelValue", arr.map((e) => e.join(":")).join(","));
}

// 监听值
watch(
	() => props.modelValue,
	(val) => {
		value.value = val ? val.split(",").map((e) => e.split(":")) : [];
	},
	{
		immediate: true
	}
);

onMounted(() => {
	const list: any[] = [];

	function deep(s: any) {
		if (typeof s == "object") {
			for (const i in s) {
				const { permission } = s[i];

				if (permission) {
					list.push(...Object.values(permission));
				} else {
					deep(s[i]);
				}
			}
		}
	}

	deep(service);

	data.value = deepPaths(list, ":");
});
</script>

<style lang="scss" scoped>
.menu-perms {
	:deep(.el-cascader) {
		width: 100%;
	}
}
</style>
