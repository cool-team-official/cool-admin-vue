<template>
	<div class="cl-avatar" :class="[size, shape]" :style="[style]">
		<el-image :src="src" alt="">
			<template #error>
				<div class="image-slot">
					<i class="el-icon-user-solid" :style="{ color }"></i>
				</div>
			</template>
		</el-image>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { isNumber } from "/@/core/utils";

export default defineComponent({
	name: "cl-avatar",

	props: {
		src: String,
		size: {
			type: [String, Number],
			default: 36
		},
		shape: {
			type: String,
			default: "circle"
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
		const size = isNumber(props.size) ? props.size + "px" : props.size;

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

			i {
				font-size: 20px;
			}
		}
	}
}
</style>
