<template>
	<div
		class="cl-image"
		:style="{
			justifyContent: justify,
			height: sty.h
		}"
	>
		<el-image
			:src="urls[0]"
			:fit="fit"
			:lazy="lazy"
			:preview-src-list="urls"
			:style="{
				height: sty.h,
				width: sty.w
			}"
			preview-teleported
		>
			<template #error>
				<div class="image-slot">
					<el-icon :size="20"><picture-filled /></el-icon>
				</div>
			</template>
		</el-image>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { isArray, isNumber, isString } from "lodash";
import { PictureFilled } from "@element-plus/icons-vue";

export default defineComponent({
	name: "cl-image",

	components: {
		PictureFilled
	},

	props: {
		modelValue: [String, Array],
		src: [String, Array],
		size: {
			type: [Number, Array],
			default: 100
		},
		lazy: {
			type: Boolean,
			default: true
		},
		fit: {
			type: String,
			default: "cover"
		},
		justify: {
			type: String,
			default: "center"
		}
	},

	setup(props) {
		const urls = computed(() => {
			const urls: any = props.modelValue || props.src;

			if (isArray(urls)) {
				return urls;
			}

			if (isString(urls)) {
				return (urls || "").split(",").filter(Boolean);
			}

			return [];
		});

		const sty = computed(() => {
			const [h, w]: any = isNumber(props.size) ? [props.size, props.size] : props.size;

			return {
				h: isNumber(h) ? h + "px" : h,
				w: isNumber(w) ? w + "px" : w
			};
		});

		return {
			urls,
			sty
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-image {
	display: flex;
	align-items: center;

	.el-image {
		display: block;

		.image-slot {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
			background-color: #f7f7f7;
			border-radius: 3px;
		}
	}
}
</style>
