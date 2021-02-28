<template>
	<el-scrollbar
		class="cl-scrollbar"
		:view-style="[
			{
				'overflow-x': 'hidden',
				width
			},
			viewStyle
		]"
		:native="native"
		:wrap-style="wrapStyle"
		:wrap-class="wrapClass"
		:view-class="viewClass"
		:noresize="noresize"
		:tag="tag"
	>
		<slot></slot>
	</el-scrollbar>
</template>

<script>
import { getBrowser } from "cl-admin/utils";

const { plat } = getBrowser();

export default {
	name: "cl-scrollbar",

	props: {
		native: Boolean,
		wrapStyle: Object,
		wrapClass: Object,
		viewClass: Object,
		viewStyle: Object,
		noresize: Boolean,
		tag: {
			type: String,
			default: "div"
		},
		direction: {
			type: String,
			default: "vertical" // auto, vertical, horizontal
		}
	},

	computed: {
		width() {
			return `calc(100% - ${plat == "iphone" ? "10px" : "0px"})`;
		}
	}
};
</script>
