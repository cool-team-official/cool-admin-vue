<template>
	<div class="scope">
		<div class="h">
			<span>v-copy</span>
			复制到剪贴板
		</div>

		<div class="c">
			<el-button v-copy="'https://www.cool-admin.com/'" size="small">
				https://www.cool-admin.com
			</el-button>
		</div>

		<div class="f">
			<span class="date">2019/09/25</span>
		</div>
	</div>
</template>
