<template>
	<div class="cl-view-group" :class="[isExpand ? 'is-expand' : 'is-collapse']">
		<div class="cl-view-group__wrap">
			<!-- 组 -->
			<div class="cl-view-group__left">
				<slot name="left"></slot>

				<!-- 收起按钮 -->
				<div class="collapse-btn" @click="expand(false)" v-if="browser.isMini">
					<el-icon>
						<arrow-right />
					</el-icon>
				</div>
			</div>

			<!-- 内容 -->
			<div class="cl-view-group__right">
				<div class="cl-view-group__right-head">
					<div class="icon" @click="expand()">
						<el-icon v-if="isExpand"><arrow-left /></el-icon>
						<el-icon v-else><arrow-right /></el-icon>
					</div>

					<span>{{ label }}</span>
				</div>

				<div class="cl-view-group__right-content">
					<slot name="right"></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, provide, ref, watch } from "vue";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import { useBrowser } from "/@/cool";

export default defineComponent({
	name: "cl-view-group",

	components: {
		ArrowLeft,
		ArrowRight
	},

	props: {
		title: String,
		leftWidth: {
			type: String,
			default: "300px"
		}
	},

	setup(props) {
		const { browser, onScreenChange } = useBrowser();

		// 是否展开
		const isExpand = ref(true);

		// 选中值
		const selected = ref();

		// 标题
		const label = ref(props.title);

		// 收起、展开
		function expand(value?: boolean) {
			isExpand.value = value === undefined ? !isExpand.value : value;
		}

		// 设置选中值
		function select(data?: any) {
			selected.value = data;

			if (browser.isMini) {
				expand(false);
			}
		}

		// 设置标题
		function setTitle(value?: string) {
			label.value = value || "";
		}

		// 监听屏幕变化
		onScreenChange(() => {
			expand(!browser.isMini);
		});

		// 监听标题
		watch(() => props.title, setTitle, {
			immediate: true
		});

		const ctx = {
			label,
			selected,
			isExpand,
			setTitle,
			expand,
			select,
			browser
		};

		provide("viewGroup", ctx);

		return ctx;
	}
});
</script>

<style lang="scss" scoped>
.cl-view-group {
	height: 100%;
	width: 100%;

	$left-width: v-bind("leftWidth");

	&__wrap {
		display: flex;
		height: 100%;
		width: 100%;
		position: relative;
		background-color: var(--el-bg-color);
	}

	&__left {
		position: relative;
		height: 100%;
		width: $left-width;
		background-color: #fff;

		.collapse-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			right: 20px;
			bottom: 30px;
			height: 40px;
			width: 40px;
			border-radius: 100%;
			background-color: var(--color-primary);
			box-shadow: 0 0 10px 1px #eee;

			.el-icon {
				color: #fff;
				font-size: 24px;
			}
		}
	}

	&__right {
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background-color: #fff;
		transition: width 0.3s;

		&-head {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 40px;
			position: relative;

			span {
				font-size: 14px;
				white-space: nowrap;
				overflow: hidden;
			}

			.icon {
				display: flex;
				align-items: center;
				position: absolute;
				left: 0;
				top: 0;
				font-size: 18px;
				cursor: pointer;
				height: 40px;
				width: 80px;
				padding-left: 10px;
			}
		}

		&-content {
			height: calc(100% - 40px);
		}
	}

	&.is-expand {
		.cl-view-group__right {
			width: calc(100% - $left-width);
			border-left: 1px solid var(--el-border-color);
		}
	}

	@media only screen and (max-width: 768px) {
		.cl-view-group__left {
			overflow: hidden;
			transition: width 0.2s;
			width: 0;
			z-index: 9;
		}

		.cl-view-group__right {
			width: 100% !important;
		}

		&.is-expand {
			.cl-view-group__left {
				width: 100%;
			}
		}
	}
}
</style>
