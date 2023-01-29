<template>
	<div class="menu-check">
		<el-input v-model="keyword" placeholder="输入关键字进行过滤" />

		<div class="menu-check__scroller">
			<el-scrollbar max-height="200px">
				<el-tree
					ref="Tree"
					node-key="id"
					show-checkbox
					:data="list"
					:props="{
						label: 'name',
						children: 'children'
					}"
					:filter-node-method="filterNode"
					@check="onCheckChange"
				/>
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" name="menu-check" setup>
import { ref, watch } from "vue";
import { deepTree } from "/@/cool/utils";
import { useCool } from "/@/cool";
import { useUpsert } from "@cool-vue/crud";

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	}
});

const emit = defineEmits(["update:modelValue"]);

const { service } = useCool();

// el-tree 组件
const Tree = ref();

// 树形列表
const list = ref();

// 搜索关键字
const keyword = ref("");

// 刷新列表
async function refresh() {
	return service.base.sys.menu.list().then((res) => {
		list.value = deepTree(res);
	});
}

// 过滤节点
function filterNode(val: string, data: any) {
	if (!val) return true;
	return data.name.includes(val);
}

// 值改变
function onCheckChange(_: any, { checkedKeys, halfCheckedKeys }: any) {
	emit("update:modelValue", [...checkedKeys, ...halfCheckedKeys]);
}

// 过滤监听
watch(keyword, (val: string) => {
	Tree.value.filter(val);
});

useUpsert({
	async onOpened() {
		await refresh();
		Tree.value.setCheckedKeys(
			(props.modelValue || []).filter((e) => Tree.value.getNode(e)?.isLeaf)
		);
	}
});
</script>

<style lang="scss" scoped>
.menu-check {
	&__scroller {
		border: 1px solid var(--el-border-color);
		border-radius: 3px;
		margin-top: 10px;
		padding: 5px 0;
	}
}
</style>
