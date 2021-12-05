<template>
	<div class="demo-upsert">
		<cl-upsert ref="upsertRef" :items="items" :dialog="dialog" />
	</div>
</template>

<script lang="ts">
import { UpsertItem, UpsertRef } from "@cool-vue/crud/types";
import { defineComponent, ref } from "vue";

export default defineComponent({
	setup() {
		const upsertRef = ref<UpsertRef>();

		const dialog = {
			props: {
				fullscreen: false,
				width: "1200px"
			}
		};

		const items = ref<UpsertItem[]>([
			{
				label: "多图",
				prop: "imgs",
				component: {
					name: "cl-upload",
					props: {
						listType: "picture-card",
						multiple: true
					}
				}
			},
			{
				label: "文件",
				prop: "file",
				component: {
					name: "cl-upload",
					props: {
						listType: "text",
						limit: 1
					}
				}
			},
			{
				label: "开关",
				prop: "switch",
				component: {
					name: "el-switch"
				}
			}
		]);

		return {
			items,
			upsertRef,
			dialog
		};
	}
});
</script>
