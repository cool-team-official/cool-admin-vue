<template>
	<div class="demo">
		<el-image
			v-for="(item, index) in list"
			:key="index"
			:src="item"
			:style="{ width: '100px', marginRight: '10px' }"
		/>

		<div class="item">
			<p>普通上传</p>
			<cl-upload v-model="urls" />
		</div>

		<div class="item">
			<p>多图上传 multiple</p>
			<cl-upload v-model="urls" multiple drag />
		</div>

		<div class="item">
			<p>文件上传 file</p>
			<cl-upload v-model="urls" multiple text="文件上传" type="file" />
		</div>

		<div class="item">
			<p>自定义内容</p>
			<cl-upload text="选择图片" multiple drag>
				<div style="width: 100%">
					<el-button>上传</el-button>
				</div>
				<template #item="{ item }">
					<div class="cs-item">{{ item.url }}</div>
				</template>
			</cl-upload>
		</div>

		<div class="item">
			<p>自定义大小</p>
			<cl-upload text="选择图片" :size="[120, 200]" />
		</div>

		<div class="item">
			<p>文件空间</p>
			<cl-upload-space />
		</div>
	</div>
</template>

<script lang="ts" name="upload" setup>
import { computed, ref } from "vue";

const urls = ref("");
const list = computed(() => urls.value.split(",").filter(Boolean));
</script>

<style lang="scss" scoped>
.demo {
	background-color: var(--el-bg-color);
	.item {
		margin-bottom: 10px;
		padding: 10px;

		& > p {
			margin-bottom: 10px;
			font-size: 14px;
		}
	}

	.cs-item {
		border: 1px solid var(--el-border-color);
		padding: 5px 10px;
	}
}
</style>
