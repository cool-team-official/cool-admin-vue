<template>
	<div class="cl-menu-file">
		<el-select v-model="path" allow-create filterable clearable placeholder="请选择">
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

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

// 扫描文件
function findFiles() {
	const files = require
		.context("@/", true, /views\/(?!(components)|(.*\/components)|(index\.js)).*.(js|vue)/)
		.keys();

	return files.map(e => {
		return {
			value: e.substr(2)
		};
	});
}

export default defineComponent({
	name: "cl-menu-file",

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
			val => {
				path.value = val || "";
			}
		);

		watch(path, val => {
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
.cl-menu-file {
	width: 100%;

	:deep(.el-select) {
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
