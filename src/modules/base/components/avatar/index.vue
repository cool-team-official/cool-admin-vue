<template>
	<div class="cl-avatar" :class="[size, shape]" :style="[style]">
		<el-image :src="src || modelValue" alt="头像">
			<template #error>
				<div class="image-slot">
					<el-icon :size="20" :color="color"><user /></el-icon>
				</div>
			</template>
		</el-image>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { User } from "@element-plus/icons-vue";
import { parsePx } from "/@/cool/utils";

export default defineComponent({
	name: "cl-avatar",

	components: {
		User
	},

	props: {
		modelValue: String,
		src: String,
		size: {
			type: [String, Number],
			default: 36
		},
		shape: {
			type: String as PropType<"square" | "circle">,
			default: "square"
		},
		backgroundColor: {
			type: String,
			default: "#f7f7f7"
		},
		color: {
			type: String,
			default: "#ccc"
		}
	},

	setup(props) {
		const size = parsePx(props.size);

		const style = computed(() => {
			return {
				height: size,
				width: size,
				backgroundColor: props.backgroundColor
			};
		});

		return {
			style
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-avatar {
	overflow: hidden;
	margin: 0 auto;

	&.large {
		height: 50px;
		width: 50px;
	}

	&.medium {
		height: 40px;
		width: 40px;
	}

	&.small {
		height: 30px;
		width: 30px;
	}

	&.circle {
		border-radius: 100%;
	}

	&.square {
		border-radius: 10%;
	}

	img {
		height: 100%;
		width: 100%;
	}

	.el-image {
		height: 100%;
		width: 100%;

		.image-slot {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 100%;
		}
	}
}
</style>
