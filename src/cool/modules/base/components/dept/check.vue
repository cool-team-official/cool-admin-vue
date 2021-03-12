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
				:data="list"
				:props="props"
				:default-checked-keys="checked"
				:filter-node-method="filterNode"
				:check-strictly="!form.relevance"
				highlight-current
				node-key="id"
				show-checkbox
				ref="tree"
				@check-change="onCheckChange"
			>
			</el-tree>
		</div>
	</div>
</template>

<script>
import { deepTree } from "cl-admin/utils";

export default {
	name: "cl-dept-check",

	props: {
		value: Array,
		title: String
	},

	inject: ["form"],

	data() {
		return {
			list: [],
			checked: [],
			keyword: "",
			props: {
				label: "name",
				children: "children"
			},
			loading: false,
			visible: true
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
			this.checked = val || [];
		},

		refresh() {
			this.$service.system.dept
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

		onCheckStrictlyChange() {
			this.form.departmentIdList = [];
			this.visible = false;

			this.$nextTick(() => {
				this.visible = true;
			});
		},

		onCheckChange() {
			this.$emit("input", this.$refs["tree"].getCheckedKeys());
		}
	}
};
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
