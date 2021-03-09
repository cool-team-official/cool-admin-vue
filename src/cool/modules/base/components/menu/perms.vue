<template>
	<el-cascader
		:options="options"
		:props="{ multiple: true }"
		separator=":"
		clearable
		filterable
		v-model="newValue"
		@change="onChange"
	></el-cascader>
</template>

<script>
export default {
	name: "cl-menu-perms",

	props: {
		value: [String, Number, Array]
	},

	data() {
		return {
			options: [],
			newValue: []
		};
	},

	watch: {
		value() {
			this.parse();
		}
	},

	created() {
		let options = [];
		let list = [];

		const flat = obj => {
			for (let i in obj) {
				let { permission } = obj[i];

				if (permission) {
					list = [...list, Object.values(permission)].flat();
				} else {
					flat(obj[i]);
				}
			}
		};

		flat(this.$service);

		list.filter(e => e.includes(":"))
			.map(e => e.split(":"))
			.forEach(arr => {
				const col = (i, d) => {
					let key = arr[i];

					let index = d.findIndex(e => e.label == key);

					if (index >= 0) {
						col(i + 1, d[index].children);
					} else {
						let isLast = i == arr.length - 1;

						d.push({
							label: key,
							value: key,
							children: isLast ? null : []
						});

						if (!isLast) {
							col(i + 1, d[d.length - 1].children || []);
						}
					}
				};

				col(0, options);
			});

		this.options = options;
	},

	mounted() {
		this.parse();
	},

	methods: {
		parse() {
			this.newValue = this.value ? this.value.split(",").map(e => e.split(":")) : [];
		},

		onChange(row) {
			this.$emit("input", row.map(e => e.join(":")).join(","));
		}
	}
};
</script>
