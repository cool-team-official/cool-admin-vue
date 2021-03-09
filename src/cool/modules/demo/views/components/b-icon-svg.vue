<template>
	<div class="scope">
		<div class="h">
			<span>icon-svg</span>
			svg图片库
		</div>
		<div class="c _svg">
			<el-tooltip content="icon-like" v-for="(item, index) in list" :key="index">
				<icon-svg :size="18" :name="`icon-${item}`"></icon-svg>
			</el-tooltip>
		</div>
		<div class="f">
			<span class="date">2019/09/25</span>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			list: ["like", "video", "rank", "menu", "favor"]
		};
	}
};
</script>
