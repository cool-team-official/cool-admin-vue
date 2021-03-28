<template>
	<div class="demo-upload scroller1">
		<div class="demo-upload__item">
			<p>文件空间</p>
			<cl-upload-space v-model="urls"></cl-upload-space>

			<p style="margin-top: 10px">选择的文件：</p>

			<el-image
				v-for="(item, index) in urlList"
				:key="index"
				:src="item"
				:style="{ width: '100px', marginRight: '10px' }"
			></el-image>
		</div>

		<div class="demo-upload__item">
			<p>普通上传</p>
			<cl-upload></cl-upload>
		</div>

		<div class="demo-upload__item">
			<p>指定类型上传 accept=.jpg,.png</p>
			<cl-upload accept=".jpg,.png"></cl-upload>
		</div>

		<div class="demo-upload__item">
			<p>多图上传 picture-card</p>

			<cl-upload multiple :limit="3" listType="picture-card"></cl-upload>
		</div>

		<div class="demo-upload__item">
			<p>文件上传 text</p>
			<cl-upload v-model="urls" multiple :limit="5" accept="*" list-type="text"></cl-upload>
		</div>

		<div class="demo-upload__item">
			<p>自定义</p>
			<cl-upload icon="el-icon-picture" text="选择图片" :size="[120, 200]"></cl-upload>
		</div>

		<div class="demo-upload__item">
			<p>拖拽上传</p>
			<cl-upload drag>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			</cl-upload>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, ref } from "vue";

export default {
	name: "upload",

	setup() {
		const urls = ref<string>("");
		const urlList = computed(() => urls.value.split(",").filter(Boolean));

		return { urls, urlList };
	}
};
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
