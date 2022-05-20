<template>
	<svg :class="svgClass" :style="style" aria-hidden="true">
		<use :xlink:href="iconName" />
	</svg>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { isNumber } from "lodash";

export default defineComponent({
	name: "icon-svg",

	cool: {
		global: true
	},

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
		const style = ref<any>({
			fontSize: isNumber(props.size) ? props.size + "px" : props.size
		});

		const iconName = computed<string>(() => `#icon-${props.name}`);
		const svgClass = computed<Array<string>>(() => {
			return ["icon-svg", `icon-svg__${props.name}`, String(props.className || "")];
		});

		return {
			style,
			iconName,
			svgClass
		};
	}
});
</script>

<style scoped>
.icon-svg {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}
</style>
