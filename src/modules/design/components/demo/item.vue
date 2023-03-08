<template>
	<div class="demo-item" :class="[{ 'is-required': required }, `demo-item--${name}`]">
		<span class="label">{{ label }}</span>
		<div class="value">
			<slot>
				<template v-if="name == 'file'">
					<div class="upload">
						<el-icon>
							<link />
						</el-icon>
						上传附件
					</div>
				</template>

				<template v-else-if="name == 'pic'">
					<div class="upload">
						<el-icon>
							<plus />
						</el-icon>
					</div>
				</template>

				<template v-else>
					<span class="placeholder">{{ placeholder }}</span>
					<el-icon v-if="arrowIcon" class="arrow-right">
						<arrow-right />
					</el-icon>
				</template>
			</slot>
		</div>
	</div>
</template>

<script lang="ts" name="demo-item" setup>
import { ArrowRight, Plus, Link } from "@element-plus/icons-vue";

defineProps({
	label: String,
	name: String,
	required: Boolean,
	placeholder: {
		type: String,
		default: "请输入"
	},
	arrowIcon: Boolean
});
</script>

<style lang="scss">
.demo-item {
	display: flex;
	align-items: center;
	min-height: 40px;
	font-size: 14px;
	background-color: #fff;

	.label {
		display: flex;
		align-items: center;
		height: 40px;
		width: 110px;
		flex-shrink: 0;
		padding-left: 12px;
		box-sizing: border-box;
		overflow: hidden;
	}

	.value {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		flex: 1;
		padding: 0 12px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;

		.placeholder,
		.arrow-right {
			color: #e5e5e5;
		}
	}

	&--textarea {
		flex-direction: column;
		align-items: flex-start;

		.label {
			width: 100%;
		}

		.value {
			.placeholder {
				display: block;
				height: 55px;
				width: 100%;
				text-align: left;
				white-space: pre-wrap;
				word-wrap: break-word;
			}
		}
	}

	&--file,
	&--pic {
		flex-direction: column;
		align-items: flex-start;

		.label {
			width: 100%;
		}

		.value {
			flex-direction: column;
			align-items: flex-start;
			width: 100%;
			box-sizing: border-box;
		}

		.upload {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 60px;
			width: 60px;
			border: 1px dashed #e5e5e5;
			border-radius: 3px;
			margin-bottom: 10px;

			.el-icon {
				font-size: 24px;
				color: #ccc;
			}
		}

		.tips {
			width: 100%;
			font-size: 12px;
			color: #666;
			padding-bottom: 10px;
			white-space: pre-wrap;
		}
	}

	&--file {
		.upload {
			width: 100%;
			height: 30px;
			font-size: 12px;

			.el-icon {
				color: #000;
				font-size: 15px;
			}
		}
	}

	&.is-required {
		.label {
			&::before {
				content: "*";
				color: red;
				margin-right: 2px;
			}
		}
	}

	&:hover {
		opacity: 0.8;
	}
}
</style>
