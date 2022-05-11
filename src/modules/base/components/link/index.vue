<template>
	<a v-for="item in urls" :key="item" class="cl-link" :href="item" :target="target">
		<el-icon><icon-link /></el-icon>{{ filename(item) }}
	</a>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { isArray, isString, last } from "lodash";
import { Link } from "@element-plus/icons-vue";

export default defineComponent({
	name: "cl-link",

	components: {
		"icon-link": Link
	},

	props: {
		modelValue: [String, Array],
		href: [String, Array],
		text: {
			type: String,
			default: "查看"
		},
		target: {
			type: String,
			default: "_blank"
		}
	},

	setup(props) {
		const urls = computed(() => {
			const urls: any = props.modelValue || props.href;

			if (isArray(urls)) {
				return urls;
			}

			if (isString(urls)) {
				return (urls || "").split(",").filter(Boolean);
			}

			return [];
		});

		function filename(url: string) {
			return last(url.split("/"));
		}

		return {
			urls,
			filename
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-link {
	display: inline-flex;
	align-items: center;
	text-align: left;
	background-color: var(--color-primary);
	color: #fff;
	padding: 0 5px;
	border-radius: 5px;
	font-size: 12px;
	margin: 2px;

	.el-icon {
		margin-right: 2px;
	}

	&:hover {
		text-decoration: underline;
	}
}
</style>
