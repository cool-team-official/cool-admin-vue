<template>
	<slot>
		<el-button @click="open()" v-if="showBtn">{{ text }}</el-button>
	</slot>

	<cl-dialog
		:height="height"
		:width="width"
		:title="title"
		:scrollbar="isScroll"
		append-to-body
		v-model="visible"
	>
		<div class="cl-editor-preview">
			<el-tabs v-model="active" type="card" v-if="list.length > 1" @tab-change="onTabChange">
				<el-tab-pane
					v-for="(item, index) in list"
					:key="index"
					:label="item.name"
					:name="index"
					:lazy="index != 0"
				/>
			</el-tabs>

			<div class="cl-editor-preview__container">
				<slot name="prepend"></slot>

				<cl-editor
					:name="`cl-editor-${name}`"
					:ref="setRefs('editor')"
					:key="active"
					height="100%"
					preview
					v-bind="editConfig"
					v-model="content"
				/>

				<slot name="append"></slot>
			</div>
		</div>

		<template #footer>
			<el-button @click="close">关闭</el-button>
			<el-button type="success" @click="toCopy" v-if="isCopy">复制</el-button>
		</template>
	</cl-dialog>
</template>

<script lang="ts" name="cl-editor-preview" setup>
import { useClipboard } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { isObject, isString } from "lodash-es";
import { nextTick, type PropType, ref, computed } from "vue";
import { useCool } from "/@/cool";
import "@wangeditor/editor/dist/css/style.css";

interface TabItem {
	name: string;
	data: string;
	language: string;
}

const props = defineProps({
	modelValue: String,
	title: String,
	name: {
		type: String as PropType<"monaco" | "wang">,
		required: true
	},
	text: {
		type: String,
		default: "点击查看"
	},
	showBtn: {
		type: Boolean,
		default: true
	},
	height: {
		type: String,
		default: "60vh"
	},
	width: {
		type: String,
		default: "60%"
	},

	// 多个内容展示
	tabs: Array as PropType<TabItem[]>,

	// 组件参数
	props: Object
});

const { refs, setRefs } = useCool();
const { copy } = useClipboard();

// 是否可见
const visible = ref(false);

// 内容
const content = ref("");

// 语言
const language = ref();

// 激活的标签
const active = ref(0);

// 列表
const list = ref<TabItem[]>([]);

// 标题
const title = computed(() => {
	return props.title || (props.name == "monaco" ? "代码预览" : "文本预览");
});

// 是否可以滚动
const isScroll = computed(() => {
	return props.name == "wang";
});

// 是否可以复制
const isCopy = computed(() => {
	return props.name == "monaco";
});

// 编辑器配置
const editConfig = computed(() => {
	return {
		language: language.value,
		...props.props
	};
});

// 打开
async function open(data?: string | TabItem[]) {
	if (!data) {
		data = props.modelValue;
	}

	if (props.tabs) {
		list.value = props.tabs;
		onTabChange(0);
	} else {
		setContent(data);
	}

	visible.value = true;
}

// 设置内容
function setContent(val: any) {
	if (isString(val)) {
		content.value = val;
	} else if (isObject(val)) {
		content.value = JSON.stringify(val, null, 4);
	}
}

// 切换
async function onTabChange(index: any) {
	const item = list.value[index];

	// 设置语言
	language.value = item.language;

	// 设置
	setContent(item.data);

	await nextTick();

	if (props.name == "monaco") {
		refs.editor?.formatCode?.();
	}
}

// 关闭
function close() {
	visible.value = false;
}

// 复制
function toCopy() {
	copy(content.value);
	ElMessage.success("复制成功");
}

defineExpose({
	open,
	close
});
</script>

<style lang="scss" scoped>
.cl-editor-preview {
	display: flex;
	flex-direction: column;
	height: 100%;

	:deep(img) {
		max-width: 100%;
	}

	&__container {
		flex: 1;
	}
}
</style>
