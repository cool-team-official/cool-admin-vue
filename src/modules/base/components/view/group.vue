<template>
	<div class="cl-view-group">
		<div class="cl-view-group__wrap">
			<!-- 组 -->
			<div class="cl-view-group__left" :class="[isExpand ? '_expand' : '_collapse']">
				<slot name="left"></slot>
			</div>

			<!-- 内容 -->
			<div class="cl-view-group__right">
				<div class="cl-view-group__right-head">
					<div class="icon" @click="toExpand()">
						<el-icon v-if="isExpand"><arrow-left /></el-icon>
						<el-icon v-else><arrow-right /></el-icon>
					</div>

					<span>{{ title }}</span>
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
import { useStore } from "../../store";

export default defineComponent({
	name: "cl-view-group",

	components: {
		ArrowLeft,
		ArrowRight
	},

	props: {
		title: String
	},

	setup() {
		const { app } = useStore();

		// 是否展开
		const isExpand = ref(true);

		// 收起、展开
		function toExpand(value?: boolean) {
			isExpand.value = value === undefined ? !isExpand.value : value;
		}

		// 小屏幕下
		function checkExpand(value?: boolean) {
			if (app.browser.isMini) {
				toExpand(value);
			}
		}

		// 监听屏幕大小变化
		watch(
			() => app.browser.isMini,
			(val: boolean) => {
				isExpand.value = !val;
			},
			{
				immediate: true
			}
		);

		provide("viewGroup", {
			checkExpand
		});

		return {
			isExpand,
			toExpand,
			checkExpand
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-view-group {
	height: 100%;
	width: 100%;

	&__wrap {
		display: flex;
		height: 100%;
		width: 100%;
		position: relative;
		background-color: var(--el-bg-color);
	}

	&__left {
		height: 100%;
		width: 300px;
		transition: width 0.3s;
		flex-shrink: 0;
		overflow: hidden;
		border-right: 1px solid var(--el-border-color);
		box-sizing: border-box;

		&._collapse {
			margin-right: 0;
			width: 0 !important;
			border-right: 0;
		}
	}

	&__right {
		width: calc(100% - 310px);
		flex: 1;
		overflow: hidden;

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

	@media only screen and (max-width: 768px) {
		.cl-view-group__left {
			width: 100%;
		}

		.cl-view-group__right {
			width: calc(100% - 100px);
		}
	}
}
</style>
