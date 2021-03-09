<template>
	<div class="cl-menu-tree">
		<el-popover
			ref="popover"
			placement="bottom-start"
			trigger="click"
			popper-class="popper-menu-tree"
		>
			<el-input size="small" v-model="filterValue">
				<i slot="prefix" class="el-input__icon el-icon-search"></i>
			</el-input>

			<el-tree
				ref="tree"
				node-key="menuId"
				:data="treeList"
				:props="props"
				:highlight-current="true"
				:expand-on-click-node="false"
				:default-expanded-keys="expandedKeys"
				:filter-node-method="filterNode"
				@current-change="currentChange"
			>
			</el-tree>
		</el-popover>
		<el-input v-model="name" v-popover:popover readonly placeholder="请选择"></el-input>
	</div>
</template>

<script>
import { deepTree } from "cl-admin/utils";

export default {
	name: "cl-menu-tree",

	props: {
		value: [Number, String]
	},

	data() {
		return {
			filterValue: "",
			list: [],
			props: {
				label: "name",
				children: "children"
			},
			expandedKeys: []
		};
	},

	watch: {
		filterValue(val) {
			this.$refs.tree.filter(val);
		}
	},

	computed: {
		name() {
			const item = this.list.find(e => e.id == this.value);
			return item ? item.name : "一级菜单";
		},

		treeList() {
			return deepTree(this.list);
		}
	},

	mounted() {
		this.menuList();
	},

	methods: {
		currentChange({ id }) {
			this.$emit("input", id);
		},

		menuList() {
			this.$service.system.menu.list().then(res => {
				let list = res.filter(e => e.type != 2);

				list.unshift({
					name: "一级菜单",
					id: null
				});

				this.list = list;
			});
		},

		filterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		}
	}
};
</script>

<style lang="scss">
.popper-menu-tree {
	width: 480px;
	box-sizing: border-box;

	.el-input {
		margin-bottom: 10px;
	}
}
</style>
