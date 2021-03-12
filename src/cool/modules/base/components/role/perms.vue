<template>
	<div class="cl-role-perms" v-loading="loading">
		<p v-if="title">{{ title }}</p>

		<el-input placeholder="输入关键字进行过滤" v-model="keyword" size="small"> </el-input>

		<div class="scroller">
			<el-tree
				:data="list"
				:props="props"
				:default-checked-keys="checked"
				:filter-node-method="filterNode"
				highlight-current
				node-key="id"
				show-checkbox
				ref="tree"
				@check-change="save"
			>
			</el-tree>
		</div>
	</div>
</template>

<script>
import { deepTree } from "cl-admin/utils";

export default {
	name: "cl-role-perms",

	props: {
		value: Array,
		title: String
	},

	data() {
		return {
			list: [],
			checked: [],
			keyword: "",
			props: {
				label: "name",
				children: "children"
			},
			loading: false
		};
	},

	watch: {
		keyword(val) {
			this.$refs["tree"].filter(val);
		},

		value(val) {
			this.refreshTree(val);
		}
	},

	mounted() {
		this.refresh();
	},

	methods: {
		refreshTree(val) {
			if (!val) {
				this.checked = [];
			}

			let ids = [];

			// 处理半选状态
			let fn = list => {
				list.forEach(e => {
					if (e.children) {
						fn(e.children);
					} else {
						ids.push(Number(e.id));
					}
				});
			};

			fn(this.list);

			this.checked = ids.filter(id => (val || []).find(e => e == id));
		},

		refresh() {
			this.$service.system.menu
				.list()
				.then(res => {
					this.list = deepTree(res);

					this.refreshTree(this.value);
				})
				.catch(err => {
					this.$message.error(err);
				});
		},

		filterNode(val, data) {
			if (!val) return true;
			return data.name.includes(val);
		},

		save() {
			const tree = this.$refs["tree"];

			// 选中的节点
			const checked = tree.getCheckedKeys();
			// 半选中的节点
			const halfChecked = tree.getHalfCheckedKeys();

			this.$emit("input", [...checked, ...halfChecked]);
		}
	}
};
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
