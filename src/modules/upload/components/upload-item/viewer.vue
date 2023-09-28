<template>
	<div class="file-viewer">
		<!-- 图片 -->
		<el-image-viewer
			v-if="img.visible"
			:url-list="[img.url]"
			infinite
			teleported
			@close="close"
		/>

		<!-- Wps -->
		<wps :ref="setRefs('wps')" />
	</div>
</template>

<script lang="ts" setup name="file-viewer">
import { reactive, toRaw } from "vue";
import { has } from "lodash-es";
import { useCool } from "/@/cool";
import Wps from "./wps.vue";
import { getType } from "../../utils";
import { Upload } from "../../types";

enum WpsType {
	word = "Writer",
	excel = "Spreadsheet",
	ppt = "Presentation",
	pdf = "Pdf"
}

const { refs, setRefs } = useCool();

const img = reactive({
	visible: false,
	url: ""
});

function open(item: Upload.Item) {
	if (item?.type) {
		// 链接
		const url = item.url || "";

		// 类型
		const type = getType(url);

		// 图片
		if (type == "image") {
			img.visible = true;
			img.url = url;

			return true;
		}

		// WPS
		if (has(WpsType, type)) {
			return refs.wps?.open(Object.assign(toRaw(item), { officeType: WpsType[item.type] }));
		}

		window.open(item.url);
	}
}

function close() {
	img.visible = false;
}

defineExpose({
	open
});
</script>

<style lang="scss" scoped>
.file-viewer {
	position: absolute;
}
</style>
