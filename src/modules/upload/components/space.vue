<template>
	<div class="cl-upload-space__wrap">
		<slot>
			<el-button @click="open" v-if="showBtn">点击上传</el-button>
		</slot>

		<!-- 弹框 -->
		<cl-dialog
			v-model="visible"
			:title="title"
			height="650px"
			width="1070px"
			keep-alive
			custom-class="cl-upload-space__dialog"
			:close-on-click-modal="false"
			append-to-body
		>
			<cl-upload-panel :limit="limit" :accept="accept" ref="Panel" />

			<template #footer>
				<el-button @click="close">取消</el-button>
				<el-button :disabled="selection.length == 0" type="success" @click="confirm"
					>选择 {{ selection.length }}/{{ limit }}</el-button
				>
			</template>
		</cl-dialog>
	</div>
</template>

<script lang="ts" setup name="cl-upload-space">
import { computed, nextTick, ref } from "vue";

defineProps({
	// 标题
	title: {
		type: String,
		default: "文件空间"
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

// 是否可见
const visible = ref(false);

// cl-upload-panel
const Panel = ref();

// 选中列表
const selection = computed<any[]>(() => Panel.value?.selection || []);

function open() {
	visible.value = true;

	nextTick(() => {
		Panel.value?.clear();
	});
}

// 关闭
function close() {
	visible.value = false;
}

// 确认
function confirm() {
	emit("confirm", selection.value);
	close();
}

defineExpose({
	open,
	close
});
</script>

<style lang="scss">
.cl-upload-space__dialog {
	.el-dialog__footer {
		border-top: 1px solid #f7f7f7;
	}
}
</style>
