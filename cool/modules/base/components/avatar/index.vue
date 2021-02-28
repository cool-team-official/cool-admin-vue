<template>
	<div class="cl-avatar" :class="[size, shape]" :style="[style2]">
		<el-image :src="src" alt="">
			<div slot="error" class="image-slot">
				<i class="el-icon-picture-outline"></i>
			</div>
		</el-image>
	</div>
</template>

<script>
export default {
	name: "cl-avatar",

	props: {
		src: String,
		size: {
			type: String,
			default: "large"
		},
		shape: {
			type: String,
			default: "circle"
		}
	},

	data() {
		return {
			style2: {}
		};
	},

	mounted() {
		if (typeof this.size == "number") {
			this.style2 = {
				height: this.size + "px",
				width: this.size + "px"
			};
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-avatar {
	overflow: hidden;
	background-color: #f7f7f7;

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

		/deep/.image-slot {
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

	.el-icon-picture-outline {
		color: #ccc;
	}
}
</style>
