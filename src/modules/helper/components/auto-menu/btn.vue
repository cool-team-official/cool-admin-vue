<template>
	<el-badge is-dot v-if="!browser.isMini">
		<div class="btn" @click="toCode">
			<span>AI 极速编码</span>
		</div>
	</el-badge>
</template>

<script lang="ts" name="auto-menu" setup>
import { useCool } from "/@/cool";

const { router, browser } = useCool();

function toCode() {
	router.push("/helper/ai-code");
}
</script>

<style lang="scss" scoped>
.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 12px;
	background-color: #2f3447;
	color: #fff;
	position: relative;
	border-radius: 4px;
	padding: 5px 10px;
	letter-spacing: 1px;

	span {
		&:nth-child(1) {
			color: #fff;
		}
	}

	&:hover {
		background-color: var(--color-primary);
	}
}
</style>
