<template>
	<div class="item-viewer">
		<el-image-viewer
			v-if="img.visible"
			:url-list="img.urls"
			:initial-index="img.index"
			infinite
			teleported
			@close="close"
		/>

		<wps :ref="setRefs('wps')" />
	</div>
</template>

<script lang="ts" setup name="item-viewer">
import { reactive, toRaw } from "vue";
import Wps from "./wps.vue";
import { useCool } from "/@/cool";

const { refs, setRefs } = useCool();

const img = reactive({
	visible: false,
	urls: [] as string[],
	index: 0
});

function open(item: Eps.SpaceInfoEntity, list: Eps.SpaceInfoEntity[]) {
	if (item?.type) {
		if (item.type == "image") {
			img.visible = true;
			img.urls = list.filter((e) => e.type == "image").map((e) => e.url || "");
			img.index = img.urls.findIndex((e) => e == item.url);

			return true;
		} else if (["Writer", "Spreadsheet", "Presentation", "PDF"].includes(item.type)) {
			return refs.wps?.open(Object.assign(toRaw(item), { officeType: item.type }));
		}
	}

	window.open(item.url);
}

function close() {
	img.visible = false;
}

defineExpose({
	open
});
</script>

<style lang="scss" scoped>
.item-viewer {
	position: absolute;
}
</style>
