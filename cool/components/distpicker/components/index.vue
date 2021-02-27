<template>
	<div class="cl-distpicker">
		<el-cascader
			v-model="value2"
			:options="data"
			:filterable="filterable"
			:size="size"
			clearable
			:props="{
				label: 'name',
				value: 'code',
				multiple,
				...props
			}"
			@change="onChange"
		>
		</el-cascader>
	</div>
</template>

<script>
import DataList from "./data";

export default {
	name: "cl-distpicker",

	props: {
		value: [String, Array],
		filterable: Boolean,
		multiple: Boolean,
		size: String,
		props: Object
	},

	data() {
		return {
			value2: undefined,
			data: DataList
		};
	},

	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.value2 = val;
			}
		}
	},

	methods: {
		onChange(arr) {
			this.$emit("input", arr);
			this.$emit("change", arr);
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-distpicker {
	/deep/.el-cascader {
		width: 100%;
	}
}
</style>
