<template>
	<div class="menu-file">
		<el-select v-model="path" allow-create filterable clearable placeholder="请选择">
			<el-option
				v-for="(item, index) in list"
				:key="index"
				:label="item.value"
				:value="item.value"
			/>
		</el-select>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

// 扫描文件
function findFiles() {
	const files = import.meta.globEager("/**/views/**/*.vue");
	let list = [];

	for (const i in files) {
		if (!i.includes("components")) {
			list.push({
				value: i.substr(5)
			});
		}
	}

	return list;
}

export default defineComponent({
	name: "menu-file",

	props: {
		modelValue: {
			type: String,
			default: ""
		}
	},

	emits: ["update:modelValue"],

	setup(props, { emit }) {
		// 路径
		const path = ref<string>(props.modelValue);

		// 数据列表
		const list = ref<any[]>(findFiles());

		watch(
			() => props.modelValue,
			(val) => {
				path.value = val || "";
			}
		);

		watch(path, (val) => {
			emit("update:modelValue", val);
		});

		return {
			path,
			list
		};
	}
});
</script>

<style lang="scss" scoped>
.menu-file {
	width: 100%;

	.el-select {
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
