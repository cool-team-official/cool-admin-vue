<template>
	<div class="cl-dept-check" v-loading="loading">
		<p v-if="title">{{ title }}</p>

		<div class="cl-dept-check__search">
			<el-input placeholder="输入关键字进行过滤" v-model="keyword" size="small"> </el-input>
			<el-switch
				:active-value="1"
				:inactive-value="0"
				v-model="form.relevance"
				@change="onCheckStrictlyChange"
			></el-switch
			>是否关联上下级
		</div>

		<div class="cl-dept-check__tree" v-if="visible">
			<el-tree
				ref="treeRef"
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
				:check-strictly="!form.relevance"
				@check-change="onCheckChange"
			>
			</el-tree>
		</div>
	</div>
</template>

<script lang="ts">
import { deepTree } from "@/core/utils";
import { ElMessage } from "element-plus";
import { defineComponent, inject, nextTick, onMounted, ref, watch } from "vue";

export default defineComponent({
	name: "cl-dept-check",

	props: {
		modelValue: {
			type: Array,
			default: () => []
		},
		title: String
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		// 请求服务
		const $service = inject<any>("service");

		// 表单值
		const form = inject<any>("form");

		// 树形列表
		const list = ref<any[]>([]);

		// 已选列表
		const checked = ref<any>([]);

		// 关键字搜素
		const keyword = ref<string>("");

		// 加载中
		const loading = ref<boolean>(false);

		// 是否可见
		const visible = ref<boolean>(false);

		const treeRef = ref<any>({});

		// 刷新已选列表
		function refreshTree(val: any[]) {
			checked.value = val || [];
		}

		// 刷新树形列表
		function refresh() {
			$service.system.dept
				.list()
				.then((res: any[]) => {
					list.value = deepTree(res);
					refreshTree(props.modelValue);
				})
				.catch((err: string) => {
					ElMessage.error(err);
				});
		}

		// 过滤节点
		function filterNode(val: string, data: any) {
			if (!val) return true;
			return data.name.includes(val);
		}

		// 是否关联上下级
		function onCheckStrictlyChange() {
			visible.value = false;
			checked.value = [];
			emit("update:modelValue", []);

			nextTick(() => {
				visible.value = true;
			});
		}

		// 监听选择
		function onCheckChange() {
			emit("update:modelValue", treeRef.value.getCheckedKeys());
		}

		// 监听过滤
		watch(keyword, (val: string) => {
			treeRef.value.filter(val);
		});

		// 刷新树
		watch(
			() => props.modelValue,
			(val: any[]) => {
				refreshTree(val);
			}
		);

		onMounted(() => {
			refresh();
		});

		return {
			form,
			list,
			checked,
			keyword,
			loading,
			visible,
			refresh,
			filterNode,
			onCheckStrictlyChange,
			onCheckChange,
			treeRef
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-dept-check {
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
