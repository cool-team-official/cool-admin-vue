<template>
	<div class="cl-upload-space__wrap">
		<slot>
			<template v-if="showBtn">
				<el-button @click="open">{{ text }}</el-button>

				<div class="cl-upload-space__wrap-list" v-show="urls.length > 0 && showList">
					<cl-upload v-model="urls" disabled deletable draggable :multiple="multiple" />
				</div>
			</template>
		</slot>

		<!-- 弹框 -->
		<cl-dialog
			v-model="visible"
			:title="config.title"
			height="650px"
			width="1070px"
			padding="0"
			keep-alive
			:scrollbar="false"
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
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useCool } from "/@/cool";
import SpaceInner from "./space-inner.vue";
import { isString } from "lodash-es";

const props = defineProps({
	modelValue: [String, Array],
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
	// 是否多选
	multiple: {
		type: Boolean,
		default: true
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
	},
	// 显示列表
	showList: {
		type: Boolean,
		default: true
	}
});

const emit = defineEmits(["update:modelValue", "change", "confirm"]);

const { refs, setRefs } = useCool();

// 是否可见
const visible = ref(false);

// 配置
const config = ref({
	title: "",
	limit: 9
});

// 展示列表
const urls = ref<any[]>([]);

// 选中列表
const selection = computed<Eps.SpaceInfoEntity[]>(() => refs.inner?.selection || []);

// 打开
function open(options?: any) {
	visible.value = true;

	// 合并配置
	config.value = Object.assign({ ...props }, options);

	// 非多选情况
	if (!props.multiple) {
		config.value.limit = 1;
	}

	nextTick(() => {
		refs.inner?.clear();
	});
}

// 关闭
function close() {
	visible.value = false;
}

// 确认
function confirm(arr?: Eps.SpaceInfoEntity[]) {
	const list = arr || selection.value;

	// 读取文件地址
	urls.value = list.map((e) => e.url);

	// 返回值
	const v = props.multiple ? urls.value : urls.value[0];

	// 事件
	emit("update:modelValue", v);
	emit("change", v);
	emit("confirm", list);

	// 关闭
	close();
}

onMounted(() => {
	watch(
		() => props.modelValue,
		(val) => {
			if (val) {
				urls.value = isString(val) ? [val] : val;
			}
		},
		{
			immediate: true
		}
	);
});

defineExpose({
	open,
	close
});
</script>

<style lang="scss" scoped>
.cl-upload-space__wrap {
	&-list {
		margin-top: 10px;
	}
}
</style>
