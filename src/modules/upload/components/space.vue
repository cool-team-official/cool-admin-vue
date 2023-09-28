<template>
	<div class="cl-upload-space__wrap">
		<slot>
			<el-button @click="open" v-if="showBtn">{{ text }}</el-button>
		</slot>

		<!-- 弹框 -->
		<cl-dialog
			v-model="visible"
			:title="config.title"
			height="650px"
			width="1070px"
			padding="0"
			keep-alive
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<space-inner :ref="setRefs('inner')" v-bind="config" @confirm="confirm" />

			<template #footer>
				<el-button @click="close">取消</el-button>
				<el-button :disabled="selection.length == 0" type="success" @click="confirm()">
					选择 {{ selection.length }}/{{ config.limit }}
				</el-button>
			</template>
		</cl-dialog>
	</div>
</template>

<script lang="ts" setup name="cl-upload-space">
import { computed, nextTick, ref } from "vue";
import { useCool } from "/@/cool";
import SpaceInner from "./space-inner.vue";
import { Upload } from "../types";

const props = defineProps({
	// 标题
	title: {
		type: String,
		default: "文件空间"
	},
	// 按钮文本
	text: {
		type: String,
		default: "点击上传"
	},
	// 可选数量
	limit: {
		type: Number,
		default: 9
	},
	// 类型
	accept: String,
	// 显示按钮
	showBtn: {
		type: Boolean,
		default: true
	}
});

const emit = defineEmits(["confirm"]);

const { refs, setRefs } = useCool();

// 是否可见
const visible = ref(false);

// 配置
const config = ref({
	title: "",
	limit: 9
});

// 选中列表
const selection = computed<Upload.Item[]>(() => refs.inner?.selection || []);

// 打开
function open(options: any) {
	visible.value = true;
	config.value = Object.assign({ ...props }, options);

	nextTick(() => {
		refs.inner?.clear();
	});
}

// 关闭
function close() {
	visible.value = false;
}

// 确认
function confirm(arr?: Upload.Item[]) {
	emit("confirm", arr || selection.value);
	close();
}

defineExpose({
	open,
	close
});
</script>
