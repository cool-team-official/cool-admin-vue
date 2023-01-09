<template>
	<div class="demo">
		<el-row :gutter="10">
			<el-col v-for="(item, index) in list" :key="index" :xs="24" :sm="12" :md="8" :lg="6">
				<component :is="item" />
			</el-col>
		</el-row>
	</div>
</template>

<script lang="ts" setup name="demo">
import ContextMenu from "../components/context-menu.vue";
import Crud from "../components/crud.vue";
import Upload from "../components/upload.vue";
import Editor from "../components/editor.vue";
import Svg from "../components/svg.vue";
import Copy from "../components/copy.vue";
import File from "../components/file.vue";

const list = [ContextMenu, Crud, Upload, Editor, Svg, Copy, File];
</script>

<style lang="scss">
.demo {
	.scope {
		background-color: #fff;
		border-radius: 3px;
		margin-bottom: 10px;
		white-space: nowrap;

		.h {
			height: 30px;
			display: flex;
			align-items: center;
			padding: 10px;
			font-size: 12px;

			span {
				background-color: var(--color-primary);
				border-radius: 3px;
				padding: 2px 5px;
				margin-right: 10px;
				font-size: 14px;
				letter-spacing: 1px;
				color: #fff;
			}
		}

		.c {
			padding: 10px;
			height: 50px;
			box-sizing: border-box;

			&._svg {
				.cl-svg {
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
						background-color: var(--color-primary);
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
