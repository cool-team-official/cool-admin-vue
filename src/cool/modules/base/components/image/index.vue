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
		>
			<template #error>
				<div class="image-slot">
					<i class="el-icon-picture-outline"></i>
				</div>
			</template>
		</el-image>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { isArray, isNumber, isString } from "/@/core/utils";

export default defineComponent({
	name: "cl-image",

	props: {
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
		src: [String, Array],
		justify: {
			type: String,
			default: "center"
		}
	},

	setup(props) {
		const urls = computed(() => {
			const urls: any = props.src;

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

			i {
				font-size: 20px;
			}
		}
	}
}
</style>
