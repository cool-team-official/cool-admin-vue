<template>
	<div class="menu-check__wrap">
		<el-popover
			placement="bottom-start"
			width="660px"
			popper-class="menu-check"
			trigger="click"
		>
			<el-input v-model="keyword" :prefix-icon="Search"> </el-input>

			<div class="menu-check__scroller scroller1">
				<el-tree
					ref="Tree"
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
				<el-input v-model="name" readonly placeholder="请选择" />
			</template>
		</el-popover>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useCool } from "/@/cool";
import { deepTree } from "/@/cool/utils";
import { Search } from "@element-plus/icons-vue";

export default defineComponent({
	name: "menu-check",

	props: {
		modelValue: [Number, String]
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		// 请求服务
		const { service } = useCool();

		// 关键字
		const keyword = ref<string>("");

		// 树形列表
		const list = ref<any[]>([]);

		// 展开值
		const expandedKeys = ref<any[]>([]);

		// el-tree 组件
		const Tree = ref<any>({});

		// 绑定值回调
		function onCurrentChange({ id }: any) {
			emit("update:modelValue", id);
		}

		// 刷新列表
		function refresh() {
			service.base.sys.menu.list().then((res) => {
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
			Tree.value.filter(val);
		});

		onMounted(function () {
			refresh();
		});

		return {
			keyword,
			list,
			expandedKeys,
			Tree,
			name,
			treeList,
			refresh,
			filterNode,
			onCurrentChange,
			Search
		};
	}
});
</script>

<style lang="scss">
.menu-check {
	box-sizing: border-box;

	.el-input {
		margin-bottom: 10px;
	}

	&__scroller {
		max-height: 300px;
		overflow: hidden auto;
	}
}
</style>
