<template>
	<div class="cl-menu-tree__wrap">
		<el-popover
			v-model:visible="visible"
			placement="bottom-start"
			trigger="click"
			width="500px"
			popper-class="cl-menu-tree"
		>
			<el-input v-model="keyword" size="small">
				<template #prefix>
					<i class="el-input__icon el-icon-search"></i>
				</template>
			</el-input>

			<div class="cl-menu-tree__scroller scroller1">
				<el-tree
					ref="treeRef"
					node-key="menuId"
					:data="treeList"
					:props="{
						label: 'name',
						children: 'children'
					}"
					:highlight-current="true"
					:expand-on-click-node="false"
					:default-expanded-keys="expandedKeys"
					:filter-node-method="filterNode"
					@current-change="onCurrentChange"
				/>
			</div>

			<template #reference>
				<el-input v-model="name" readonly placeholder="请选择" @click="visible = true" />
			</template>
		</el-popover>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useCool } from "/@/cool";
import { deepTree } from "/@/cool/utils";

export default defineComponent({
	name: "cl-menu-tree",

	props: {
		modelValue: [Number, String]
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		// 请求服务
		const { service } = useCool();

		// 关键字
		const keyword = ref<string>("");

		const visible = ref<boolean>(false);

		// 树形列表
		const list = ref<any[]>([]);

		// 展开值
		const expandedKeys = ref<any[]>([]);

		// el-tree 组件
		const treeRef = ref<any>({});

		// 绑定值回调
		function onCurrentChange({ id }: any) {
			emit("update:modelValue", id);
			visible.value = false;
		}

		// 刷新列表
		function refresh() {
			service.base.sys.menu.list().then((res: any) => {
				const _list = res.filter((e: any) => e.type != 2);

				_list.unshift({
					name: "一级菜单",
					id: null
				});

				list.value = _list;
			});
		}

		// 过滤节点
		function filterNode(value: string, data: any) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		}

		// 节点名称
		const name = computed(() => {
			const item = list.value.find((e) => e.id == props.modelValue);
			return item ? item.name : "一级菜单";
		});

		// 树形列表
		const treeList = computed(() => deepTree(list.value));

		// 监听关键字过滤
		watch(keyword, (val: string) => {
			treeRef.value.filter(val);
		});

		onMounted(function () {
			refresh();
		});

		return {
			visible,
			keyword,
			list,
			expandedKeys,
			treeRef,
			name,
			treeList,
			refresh,
			filterNode,
			onCurrentChange
		};
	}
});
</script>

<style lang="scss">
.cl-menu-tree {
	box-sizing: border-box;

	.el-input {
		margin-bottom: 10px;
	}

	&__scroller {
		max-height: 400px;
		overflow: hidden auto;
	}
}
</style>
