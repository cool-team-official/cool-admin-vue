<template>
	<div>
		<el-divider content-position="left"> 单选 </el-divider>

		<cl-upload-space v-model="v1" :multiple="false" accept="image/*" />
	</div>

	<div>
		<el-divider content-position="left"> 多选 </el-divider>

		<cl-upload-space v-model="v2" :limit="3" accept="image/*" />
	</div>

	<div>
		<el-divider content-position="left"> 自定义 </el-divider>

		<cl-upload-space
			v-model="v3"
			:multiple="false"
			:show-btn="false"
			accept="image/*"
			:ref="setRefs('uploadSpace')"
		>
			<div class="space-custom" @click="refs.uploadSpace?.open">
				<cl-avatar :size="50" :src="v3" />
				<p>选择头像</p>
			</div>
		</cl-upload-space>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useCool } from "/@/cool";

const { refs, setRefs } = useCool();

const v1 = ref("");
const v2 = ref<string[]>([]);
const v3 = ref("");
</script>

<style lang="scss" scoped>
.space-custom {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	padding: 5px 10px;
	font-size: 14px;
	box-sizing: border-box;
	height: 120px;
	width: 120px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;

	p {
		margin-top: 10px;
	}

	&:hover {
		border-color: var(--el-color-primary);
	}
}
</style>
