<template>
	<el-select v-model="newValue" v-bind="props" multiple @change="onChange">
		<el-option
			v-for="(item, index) in list"
			:value="item.id"
			:label="item.name"
			:key="index"
		></el-option>
	</el-select>
</template>

<script>
export default {
	name: "cl-role-select",

	props: {
		value: [String, Number, Array],
		props: Object
	},

	data() {
		return {
			list: [],
			newValue: undefined
		};
	},

	watch: {
		value: {
			immediate: true,
			handler(val) {
				let arr = [];

				if (!(val instanceof Array)) {
					arr = [val];
				} else {
					arr = val;
				}

				this.newValue = arr.filter(Boolean);
			}
		}
	},

	async created() {
		this.list = await this.$service.system.role.list();
	},

	methods: {
		onChange(val) {
			this.$emit("input", val);
		}
	}
};
</script>
