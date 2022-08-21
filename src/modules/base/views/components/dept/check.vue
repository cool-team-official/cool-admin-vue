<template>
	<div class="dept-check">
		<div class="dept-check__search">
			<el-input v-model="keyword" placeholder="输入关键字进行过滤" />
		</div>

		<div class="dept-check__tree">
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
					:check-strictly="checkStrictly"
					@check="onCheckChange"
				/>
			</el-scrollbar>
		</div>
	</div>
</template>

<script lang="ts" name="dept-check" setup>
import { ref, watch } from "vue";
import { deepTree } from "/@/cool/utils";
import { useCool } from "/@/cool";
import { useUpsert } from "@cool-vue/crud";

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	},
	checkStrictly: Boolean
});

const emit = defineEmits(["update:modelValue"]);

const { service } = useCool();

// el-tree
const Tree = ref();

// 树形列表
const list = ref();

// 关键字搜素
const keyword = ref("");

// 刷新树形列表
async function refresh() {
	return service.base.sys.department.list().then((res) => {
		list.value = deepTree(res);
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

// 监听过滤
watch(keyword, (val: string) => {
	Tree.value.filter(val);
});

useUpsert({
	async onOpened() {
		await refresh();
		Tree.value.setCheckedKeys(props.modelValue || []);
	}
});
</script>

<style lang="scss" scoped>
.dept-check {
	&__search {
		display: flex;
		align-items: center;

		.el-input {
			flex: 1;
		}
	}

	&__tree {
		border: 1px solid var(--el-border-color);
		margin-top: 5px;
		border-radius: 3px;
		box-sizing: border-box;
		padding: 5px 0;
	}
}
</style>
