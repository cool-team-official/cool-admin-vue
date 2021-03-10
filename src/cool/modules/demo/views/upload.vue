<template>
	<div class="demo-upload">
		<div class="demo-upload__item">
			<p>普通上传</p>
			<cl-upload :before-upload="onBeforeUpload"></cl-upload>
		</div>

		<div class="demo-upload__item">
			<p>指定类型上传 accept=.jpg,.png</p>
			<cl-upload accept=".jpg,.png" :before-upload="onBeforeUpload"></cl-upload>
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

		<div class="demo-upload__item">
			<p>文件空间</p>
			<cl-upload-space v-model="urls"></cl-upload-space>

			<p style="margin-top: 10px">选择的文件：{{ urls }}</p>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			urls: ""
		};
	},

	methods: {
		onBeforeUpload(file, { done }) {
			done();

			return true;
		}
	}
};
</script>

<style lang="scss" scoped>
.demo-upload {
	overflow: hidden auto;

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
