<template>
	<svg :class="svgClass" :style="style" aria-hidden="true">
		<use :xlink:href="iconName" />
	</svg>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import { parsePx } from "/@/cool/utils";

export default defineComponent({
	name: "cl-svg",

	props: {
		name: String,
		className: String,
		color: String,
		size: [String, Number]
	},

	setup(props) {
		const style = reactive({
			fontSize: parsePx(props.size!)
		});

		const iconName = computed(() => `#icon-${props.name}`);
		const svgClass = computed(() => {
			return ["cl-svg", `cl-svg__${props.name}`, String(props.className || "")];
		});

		return {
			style,
			iconName,
			svgClass
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-svg {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}
</style>
