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
import Design from "../components/design.vue";
import ClForm from "../components/form.vue";

const list = [ContextMenu, ClForm, Crud, Upload, Editor, Svg, Copy, File, Design];
</script>

<style lang="scss" scoped>
.demo {
	overflow-x: hidden;

	:deep(.scope) {
		background-color: #fff;
		border-radius: 4px;
		margin-bottom: 10px;
		white-space: nowrap;

		.h {
			display: flex;
			align-items: center;
			height: 30px;
			padding: 10px;
			font-size: 12px;
			color: #666;

			.el-tag {
				margin-right: 10px;
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
