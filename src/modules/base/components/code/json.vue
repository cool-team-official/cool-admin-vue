<template v-if="text">
	<div class="cl-code-json__wrap" v-if="popover">
		<el-popover width="400px" placement="right" popper-class="cl-code-json__popper">
			<template #reference>
				<span class="text">{{ text }}</span>
			</template>

			<viewer />
		</el-popover>
	</div>

	<viewer v-else>
		<template #op>
			<slot name="op"> </slot>
		</template>
	</viewer>
</template>

<script lang="tsx" name="cl-code-json" setup>
import { useClipboard } from "@vueuse/core";
import { ElMessage } from "element-plus";
import { isObject, isString } from "lodash-es";
import { computed, defineComponent } from "vue";

const props = defineProps({
	modelValue: [String, Object],
	popover: Boolean,
	height: {
		type: [Number, String],
		default: "100%"
	},
	maxHeight: {
		type: [Number, String],
		default: 300
	}
});

const { copy } = useClipboard();

// 文本
const text = computed(() => {
	const v = props.modelValue;

	if (isString(v)) {
		return v;
	} else if (isObject(v)) {
		return JSON.stringify(v, null, 4);
	} else {
		return "";
	}
});

// 视图
const viewer = defineComponent({
	setup(_, { slots }) {
		function toCopy() {
			copy(text.value);
			ElMessage.success("复制成功");
		}

		return () => {
			return (
				<div class="cl-code-json">
					<div class="op">
						<el-button type="success" size="small" onClick={toCopy}>
							copy
						</el-button>

						{slots.op && slots.op()}
					</div>

					<el-scrollbar
						class="scrollbar"
						max-height={props.maxHeight}
						height={props.height}
					>
						<pre>
							<code>{text.value}</code>
						</pre>
					</el-scrollbar>
				</div>
			);
		};
	}
});
</script>

<style lang="scss">
.cl-code-json {
	background-color: var(--el-fill-color-lighter);
	border-radius: 5px;
	position: relative;

	.op {
		position: absolute;
		right: 10px;
		top: 10px;
		z-index: 9;
	}

	.scrollbar {
		code {
			display: block;
			padding: 10px;
			font-size: 14px;
		}
	}

	&__wrap {
		.text {
			display: block;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			cursor: pointer;

			&:hover {
				color: var(--color-primary);
			}
		}
	}

	&__popper {
		padding: 5px !important;
	}
}
</style>
