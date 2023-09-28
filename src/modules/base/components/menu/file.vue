<template>
	<div class="cl-menu-file">
		<template v-if="isEdit">
			<el-input placeholder="请输入" v-model="text" @change="onTextChange"></el-input>

			<el-tooltip content="选择文件">
				<el-icon @click="toggle(false)">
					<FolderChecked />
				</el-icon>
			</el-tooltip>
		</template>

		<template v-else>
			<el-cascader
				v-model="path"
				:options="data"
				clearable
				filterable
				allow-create
				@change="onPathChange"
			/>

			<el-tooltip content="输入编辑">
				<el-icon @click="toggle(true)">
					<Edit />
				</el-icon>
			</el-tooltip>
		</template>
	</div>
</template>

<script lang="ts" name="cl-menu-file" setup>
import { ref, watch } from "vue";
import { deepPaths } from "/@/cool/utils";
import { FolderChecked, Edit } from "@element-plus/icons-vue";

const props = defineProps({
	modelValue: {
		type: String,
		default: ""
	}
});

const emit = defineEmits(["update:modelValue", "change"]);

// 扫描文件
function findFiles() {
	const files = import.meta.glob(["/src/modules/*/{views,pages}/**/*", "!**/components"]);
	const list: string[] = [];

	for (const i in files) {
		if (!i.includes("base/pages")) {
			list.push(i.substring(13));
		}
	}

	return deepPaths(list);
}

// 路径
const path = ref();

// 文本
const text = ref();

// 是否编辑
const isEdit = ref(false);

// 数据列表
const data = ref(findFiles());

// 路径值改变
function onPathChange(arr: string[]) {
	const v = "modules/" + (arr || []).join("/");
	emit("update:modelValue", v);
	emit("change", v);
}

// 文本值改变
function onTextChange(v: string) {
	emit("update:modelValue", v);
	emit("change", v);
}

// 切换
function toggle(f: boolean) {
	isEdit.value = f;
}

watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			if (val.includes("http")) {
				text.value = val;
				isEdit.value = true;
			} else {
				path.value = val.replace(/(modules\/|cool\/)/g, "").split("/");
			}
		}
	},
	{
		immediate: true
	}
);
</script>

<style lang="scss" scoped>
.cl-menu-file {
	display: flex;
	align-items: center;
	width: 100%;

	:deep(.el-cascader) {
		width: 100%;
	}

	.el-icon {
		margin: 0 0 0 10px;
		font-size: 18px;
		cursor: pointer;

		&:hover {
			color: var(--el-color-primary);
		}
	}
}
</style>
