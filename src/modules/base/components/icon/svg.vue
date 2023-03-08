<template>
	<svg :class="svgClass" :style="style" aria-hidden="true">
		<use :xlink:href="iconName" />
	</svg>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { isNumber } from "lodash-es";

export default defineComponent({
	name: "cl-svg",

	props: {
		name: {
			type: String
		},
		className: {
			type: String
		},
		size: {
			type: [String, Number]
		}
	},

	setup(props) {
		const style = ref({
			fontSize: isNumber(props.size) ? props.size + "px" : props.size
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
