<template>
	<div class="demo scroller1">
		<el-row :gutter="10">
			<el-col v-for="(item, index) in list" :key="index" :xs="24" :sm="12" :md="8" :lg="6">
				<component :is="item" />
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts">
import BClUpload from "../components/demo/b-cl-upload.vue";
import BVCopy from "../components/demo/b-v-copy.vue";
import BIconSvg from "../components/demo/b-icon-svg.vue";
import BClCrud from "../components/demo/b-cl-crud.vue";
import BClContextMenu from "../components/demo/b-cl-context-menu.vue";
import BErrorPage from "../components/demo/b-error-page.vue";
import BClEditorQuill from "../components/demo/b-cl-editor-quill.vue";

export default {
	name: "demo",

	components: {
		BClUpload,
		BVCopy,
		BIconSvg,
		BClCrud,
		BClContextMenu,
		BErrorPage,
		BClEditorQuill
	},

	setup() {
		return {
			list: [
				"b-cl-upload",
				"b-cl-crud",
				"b-icon-svg",
				"b-v-copy",
				"b-cl-context-menu",
				"b-error-page",
				"b-cl-editor-quill"
			]
		};
	}
};
</script>

<style lang="scss">
.demo {
	.scope {
		background-color: #fff;
		border-radius: 3px;
		margin-bottom: 10px;

		.h {
			height: 30px;
			display: flex;
			align-items: center;
			padding: 10px;
			font-size: 12px;

			span {
				background-color: $color-primary;
				color: #fff;
				border-radius: 3px;
				padding: 2px 5px;
				margin-right: 10px;
				font-size: 14px;
				letter-spacing: 1px;
			}
		}

		.c {
			padding: 10px;
			height: 50px;
			box-sizing: border-box;

			&._svg {
				.icon-svg {
					margin-right: 15px;
				}
			}

			a {
				font-size: 13px;
				color: #666;
				position: relative;

				&:hover {
					&:after {
						content: "";
						width: 100%;
						height: 1px;
						position: absolute;
						bottom: -2px;
						left: 0;
						background-color: $color-primary;
					}
				}
			}
		}

		.f {
			height: 30px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px;
			font-size: 12px;

			.date {
				color: #999;
			}
		}
	}
}
</style>
