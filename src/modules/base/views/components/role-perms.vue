<template>
	<div class="role-perms">
		<p v-if="title">{{ title }}</p>

		<el-input v-model="keyword" placeholder="输入关键字进行过滤" />

		<div class="scroller">
			<el-tree
				ref="Tree"
				highlight-current
				node-key="id"
				show-checkbox
				:data="list"
				:props="{
					label: 'name',
					children: 'children'
				}"
				:default-checked-keys="checked"
				:filter-node-method="filterNode"
				@check-change="save"
			/>
		</div>
	</div>
</template>

<script lang="ts">
export default {
	name: "role-perms"
};
</script>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { deepTree } from "/@/cool/utils";
import { useCool } from "/@/cool";

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	},
	title: String
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
const Tree = ref<any>({});

// 刷新树
function refreshTree(val: any[]) {
	if (!val) {
		checked.value = [];
	}

	const ids: any[] = [];

	// 处理半选状态
	function fn(list: any[]) {
		list.forEach((e) => {
			if (e.children) {
				fn(e.children);
			} else {
				ids.push(Number(e.id));
			}
		});
	}

	fn(list.value);

	checked.value = ids.filter((id) => (val || []).includes(id));
}

// 刷新列表
function refresh() {
	service.base.sys.menu
		.list()
		.then((res: any[]) => {
			list.value = deepTree(res);
			refreshTree(props.modelValue);
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

// 保存
function save() {
	// 选中的节点
	const checked = Tree.value.getCheckedKeys();
	// 半选中的节点
	const halfChecked = Tree.value.getHalfCheckedKeys();

	emit("update:modelValue", [...checked, ...halfChecked]);
}

// 过滤监听
watch(keyword, (val: string) => {
	Tree.value.filter(val);
});

// 刷新监听
watch(() => props.modelValue, refreshTree);

onMounted(() => {
	refresh();
});
</script>

<style lang="scss">
.role-perms {
	.scroller {
		border: 1px solid #dcdfe6;
		border-radius: 3px;
		max-height: 200px;
		box-sizing: border-box;
		overflow-x: hidden;
		margin-top: 10px;
		padding: 5px 0;
	}
}
</style>
