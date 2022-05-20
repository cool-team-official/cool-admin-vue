<template>
	<div class="demo-upload scroller1">
		<el-image
			v-for="(item, index) in list"
			:key="index"
			:src="item"
			:style="{ width: '100px', marginRight: '10px' }"
		/>

		<div class="demo-upload__item">
			<p>普通上传</p>
			<cl-upload v-model="urls" />
		</div>

		<div class="demo-upload__item">
			<p>多图上传 multiple</p>
			<cl-upload v-model="urls" multiple drag />
		</div>

		<div class="demo-upload__item">
			<p>文件上传 file</p>
			<cl-upload v-model="urls" multiple text="文件上传" type="file" />
		</div>

		<div class="demo-upload__item">
			<p>自定义</p>
			<cl-upload text="选择图片" :size="[120, 200]" />
		</div>

		<div class="demo-upload__item">
			<p>文件空间</p>
			<cl-upload-space />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

const urls = ref<string>("");

const list = computed(() => urls.value.split(",").filter(Boolean));
</script>

<style lang="scss" scoped>
.demo-upload {
	.demo-upload__item {
		margin-bottom: 10px;
		background-color: #fff;
		padding: 10px;

		& > p {
			margin-bottom: 10px;
			font-size: 14px;
		}
	}
}
</style>
