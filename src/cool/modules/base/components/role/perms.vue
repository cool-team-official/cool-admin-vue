<template>
	<div class="cl-role-perms" v-loading="loading">
		<p v-if="title">{{ title }}</p>

		<el-input placeholder="输入关键字进行过滤" v-model="keyword" size="small"> </el-input>

		<div class="scroller">
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
				@check-change="save"
			>
			</el-tree>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { deepTree } from "@/core/utils";

export default defineComponent({
	name: "cl-role-perms",

	props: {
		modelValue: {
			type: Array,
			default: () => []
		},
		title: String
	},

	setup(props, { emit }) {
		const $service = inject<any>("service");

		// 树形列表
		const list = ref<any[]>([]);

		// 已选列表
		const checked = ref<any[]>([]);

		// 搜索关键字
		const keyword = ref<string>("");

		// 加载中
		const loading = ref<boolean>(false);

		// el-tree 组件
		const treeRef = ref<any>({});

		// 刷新树
		function refreshTree(val: any[]) {
			if (!val) {
				checked.value = [];
			}

			const ids: any[] = [];

			// 处理半选状态
			const fn = (list: any[]) => {
				list.forEach(e => {
					if (e.children) {
						fn(e.children);
					} else {
						ids.push(Number(e.id));
					}
				});
			};

			fn(list.value);

			checked.value = ids.filter(id => (val || []).includes(id));
		}

		// 刷新列表
		function refresh() {
			$service.system.menu
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

		// 保存
		function save() {
			// 选中的节点
			const checked = treeRef.value.getCheckedKeys();
			// 半选中的节点
			const halfChecked = treeRef.value.getHalfCheckedKeys();

			emit("update:modelValue", [...checked, ...halfChecked]);
		}

		// 过滤监听
		watch(keyword, (val: string) => {
			treeRef.value.filter(val);
		});

		// 刷新监听
		watch(() => props.modelValue, refreshTree);

		onMounted(() => {
			refresh();
		});

		return {
			list,
			checked,
			keyword,
			loading,
			treeRef,
			filterNode,
			save
		};
	}
});
</script>

<style lang="scss" scoped>
.scroller {
	border: 1px solid #dcdfe6;
	margin-top: 5px;
	border-radius: 3px;
	max-height: 200px;
	box-sizing: border-box;
	overflow-x: hidden;
	padding: 5px 0;
}
</style>
