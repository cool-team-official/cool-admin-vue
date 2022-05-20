<template>
	<div class="dept-check">
		<p v-if="title">{{ title }}</p>

		<div class="dept-check__search">
			<el-input v-model="keyword" placeholder="输入关键字进行过滤" />

			<template v-if="Form && Form.form">
				<el-switch
					v-model="Form.form.relevance"
					:active-value="1"
					:unactive-value="0"
				/>是否关联上下级
			</template>
		</div>

		<div class="dept-check__tree">
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
				:check-strictly="!Form?.form.relevance"
				@check-change="onCheckChange"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from "vue";
import { deepTree } from "/@/cool/utils";
import { ElMessage } from "element-plus";
import { useCool } from "/@/cool";
import { useForm } from "@cool-vue/crud";

const props = defineProps({
	modelValue: {
		type: Array,
		default: () => []
	},
	title: String
});

const emit = defineEmits(["update:modelValue"]);

const { service } = useCool();

// el-tree
const Tree = ref<any>();

const Form = useForm(() => {
	refresh();
});

// 树形列表
const list = ref<any[]>([]);

// 已选列表
const checked = ref<any>([]);

// 关键字搜素
const keyword = ref<string>("");

// 刷新已选列表
function refreshTree(val: any[]) {
	nextTick(() => {
		checked.value = val || [];
	});
}

// 刷新树形列表
function refresh() {
	service.base.sys.department
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

// 监听选择
function onCheckChange() {
	if (Tree.value) {
		emit("update:modelValue", Tree.value.getCheckedKeys());
	}
}

// 监听过滤
watch(keyword, (val: string) => {
	Tree.value.filter(val);
});

// 监听值
watch(() => props.modelValue, refreshTree);

onMounted(() => {
	refresh();
});
</script>

<style lang="scss" scoped>
.dept-check {
	&__search {
		display: flex;
		align-items: center;

		.el-input {
			flex: 1;
			margin-right: 10px;
		}

		.el-switch {
			margin-right: 5px;
		}
	}

	&__tree {
		border: 1px solid #dcdfe6;
		margin-top: 5px;
		border-radius: 3px;
		max-height: 200px;
		box-sizing: border-box;
		overflow-x: hidden;
		padding: 5px 0;
	}
}
</style>
