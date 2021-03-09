<template>
	<div class="cl-menu-file">
		<el-select v-model="newValue" allow-create filterable clearable placeholder="请选择">
			<el-option
				v-for="(item, index) in list"
				:key="index"
				:label="item.value"
				:value="item.value"
			>
			</el-option>
		</el-select>
	</div>
</template>

<script>
const files = require
	.context("@/", true, /views\/(?!(components)|(.*\/components)|(index\.js)).*.(js|vue)/)
	.keys();

export default {
	name: "cl-menu-file",

	props: {
		value: [String]
	},

	inject: ["form"],

	data() {
		return {
			newValue: "",
			list: []
		};
	},

	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.newValue = val || "";
			}
		},

		newValue(val) {
			this.$emit("input", val);
		}
	},

	created() {
		this.list = files.map(e => {
			return {
				value: e.substr(2)
			};
		});
	}
};
</script>

<style lang="scss" scoped>
.cl-menu-file {
	width: 100%;

	/deep/ .el-select {
		width: 100%;
	}

	&__module {
		display: inline-flex;

		.label {
			width: 40px;
			text-align: right;
			margin-right: 10px;
		}
	}
}
</style>
