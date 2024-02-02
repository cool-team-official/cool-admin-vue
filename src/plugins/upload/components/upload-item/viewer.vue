<template>
	<div class="viewer-image">
		<!-- 图片 -->
		<el-image-viewer
			v-if="img.visible"
			:url-list="[img.url]"
			infinite
			teleported
			@close="close"
		/>
	</div>

	<!-- 文档 -->
	<cl-dialog v-model="doc.visible" title="文档预览" height="70vh" width="80%" :scrollbar="false">
		<div class="viewer-doc" v-loading="doc.loading">
			<iframe :src="doc.url" :ref="setRefs('docIframe')" />
		</div>
	</cl-dialog>
</template>

<script lang="ts" setup name="file-viewer">
import { reactive, nextTick } from "vue";
import { getType } from "../../utils";
import type { Upload } from "../../types";
import { useCool } from "/@/cool";

const { refs, setRefs } = useCool();

// 图片预览
const img = reactive({
	visible: false,
	url: ""
});

// 文档预览
const doc = reactive({
	visible: false,
	loading: false,
	url: ""
});

// 打开
function open(item: Upload.Item) {
	if (item?.type) {
		// 链接
		const url = item.url || "";

		// 类型
		const type = getType(url);

		// 图片预览
		if (type == "image") {
			img.visible = true;
			img.url = url;

			return true;
		}

		// 文档预览
		if (["word", "excel", "ppt", "pdf"].includes(type)) {
			doc.visible = true;
			doc.loading = true;
			doc.url = `https://view.officeapps.live.com/op/view.aspx?src=${decodeURIComponent(url)}`;

			nextTick(() => {
				refs.docIframe.onload = () => {
					doc.loading = false;
				};
			});

			return true;
		}

		window.open(item.url);
	}
}

// 关闭
function close() {
	img.visible = false;
}

defineExpose({
	open
});
</script>

<style lang="scss" scoped>
.viewer-image {
	position: absolute;
}

.viewer-doc {
	height: 100%;
	width: 100%;

	iframe {
		border: 0;
		height: 100%;
		width: 100%;
	}
}
</style>
