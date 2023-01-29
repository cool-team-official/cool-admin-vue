<template>
	<div class="scope">
		<div class="h">
			<span>cl-svg</span>
			svg图片库
		</div>
		<div class="c _svg">
			<el-tooltip v-for="(item, index) in list" :key="index" :content="`icon-${item}`">
				<cl-svg :size="18" :name="`icon-${item}`" />
			</el-tooltip>
		</div>
		<div class="f">
			<span class="date">2019/09/25</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const list = ref(["like", "video", "rank", "menu", "favor"]);
</script>

<style lang="scss" scoped>
._svg {
	color: #000;
}
</style>
