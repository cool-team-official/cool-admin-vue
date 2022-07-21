<template>
	<div class="menu-check">
		<el-input v-model="keyword" placeholder="输入关键字进行过滤" />

		<div class="menu-check__scroller scroller1">
			<el-tree
				ref="Tree"
				node-key="id"
				show-checkbox
				:data="list"
				:props="{
					label: 'name',
					children: 'children'
				}"
				:default-checked-keys="checked"
				:filter-node-method="filterNode"
				@check="onCheckChange"
			/>
		</div>
	</div>
</template>

<script lang="ts" name="menu-check" setup>
import { onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { deepTree } from "/@/cool/utils";
import { useCool } from "/@/cool";

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	}
});

const emit = defineEmits(["update:modelValue"]);

const { service } = useCool();

// 树形列表
const list = ref<any[]>([]);

// 已选列表
const checked = ref<any[]>([]);

// 搜索关键字
const keyword = ref<string>("");

// el-tree 组件
const Tree = ref<any>();

// 刷新列表
function refresh() {
	service.base.sys.menu
		.list()
		.then((res) => {
			list.value = deepTree(res);
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});
}

// 过滤节点
function filterNode(val: string, data: any) {
	if (!val) return true;
	return data.name.includes(val);
}

// 值改变
function onCheckChange(_: any, { checkedKeys }: any) {
	emit("update:modelValue", checkedKeys);
}

// 过滤监听
watch(keyword, (val: string) => {
	Tree.value.filter(val);
});

// 刷新监听
watch(
	() => props.modelValue,
	(val) => {
		checked.value = val || [];
	}
);

onMounted(() => {
	refresh();
});
</script>

<style lang="scss" scoped>
.menu-check {
	&__scroller {
		border: 1px solid var(--el-border-color);
		border-radius: 3px;
		max-height: 200px;
		box-sizing: border-box;
		margin-top: 10px;
		padding: 5px 0;
	}
}
</style>
