<template>
	<div class="cl-upload-space-file__wrap">
		<div
			class="cl-upload-space-file"
			:class="[`is-${info.type}`]"
			@click="select"
			@contextmenu.stop.prevent="onContextMenu"
		>
			<!-- 错误 -->
			<template v-if="info.error">
				<div class="cl-upload-space-file__error">上传失败：{{ info.error }}</div>
			</template>

			<!-- 成功 -->
			<template v-else>
				<!-- 图片 -->
				<template v-if="info.type === 'image'">
					<el-image fit="contain" :src="url" lazy>
						<template #error>
							<div class="image-error">
								<span>{{ url }}</span>
							</div>
						</template>
					</el-image>
				</template>

				<!-- 其他 -->
				<template v-else>
					<!-- 文件名 -->
					<span class="cl-upload-space-file__name"
						>{{ fileName(url) }}.{{ extname(url) }}</span
					>
				</template>

				<!-- 文件类型 -->
				<span
					class="cl-upload-space-file__type"
					:style="{
						backgroundColor: type.color
					}"
					>{{ type.label }}</span
				>

				<!-- 进度条 -->
				<div
					class="cl-upload-space-file__progress"
					v-if="info.progress > 0 && info.progress < 100"
				>
					<el-progress :percentage="info.progress" :show-text="false"></el-progress>
				</div>
			</template>

			<!-- 遮罩层 -->
			<div v-if="isSelected" class="cl-upload-space-file__mask">
				<span>{{ index + 1 }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";
import { ContextMenu } from "@cool-vue/crud";
import { extname } from "/@/cool/utils";
import { fileName, fileType } from "../../utils";
import { useClipboard } from "@vueuse/core";
import { ElMessage } from "element-plus";

const { copy } = useClipboard();

const props = defineProps({
	data: Object
});

const emit = defineEmits(["select", "remove"]);

// 接收
const space = inject<any>("space");

// 文件信息
const info = computed(() => props.data || {});

// 已选的序号
const index = computed(() => space.selection.value.findIndex((e: any) => e.id === info.value.id));

// 是否已选择
const isSelected = computed(() => index.value >= 0);

// 地址
const url = computed(() => info.value.preload || info.value.url);

// 类型
const type = computed(() => fileType(info.value.url));

// 选择
function select() {
	emit("select", info.value);
}

// 移除
function remove() {
	emit("remove", info.value);
}

// 右键菜单
function onContextMenu(e: any) {
	ContextMenu.open(e, {
		hover: {
			target: "cl-upload-space-file__wrap"
		},
		list: [
			{
				label: "预览",
				callback(done) {
					window.open(info.value.url);
					done();
				}
			},
			{
				label: "复制地址",
				callback(done) {
					copy(info.value.url);
					ElMessage.success("复制成功");
					done();
				}
			},
			{
				label: isSelected.value ? "取消选中" : "选中",
				callback(done) {
					select();
					done();
				}
			},
			{
				label: "删除",
				callback(done) {
					remove();
					done();
				}
			}
		]
	});
}
</script>

<style lang="scss" scoped>
.cl-upload-space-file {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
	cursor: pointer;
	position: relative;
	border-radius: 5px;
	overflow: hidden;
	box-sizing: border-box;
	background-color: rgba(0, 0, 0, 0.1);
	margin-bottom: 10px;

	&__wrap {
		height: 100%;
		width: 100%;
	}

	&.is-image {
		overflow: hidden;

		:deep(.el-image) {
			max-height: 100%;
			max-width: 100%;
		}

		.image-error {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			color: #f56c6c;
			height: 150px;
			width: 150px;
			background-color: #fef0f0;
			padding: 10px;
			box-sizing: border-box;
		}
	}

	&:not(.is-image) {
		padding: 10px;

		.cl-upload-space-file {
			&__icon {
				display: flex;
				align-items: center;

				span {
					font-size: 13px;
					text-transform: uppercase;
					margin-left: 5px;
					color: #666;
				}
			}

			&__name {
				display: inline-block;
				width: 100%;
				font-size: 13px;
				text-align: center;
				word-break: break-all;
			}

			&__size {
				position: absolute;
				top: 5px;
				right: 5px;
				color: #999;
				font-size: 12px;
				line-height: 12px;
			}
		}
	}

	&__progress {
		position: absolute;
		bottom: 10px;
		left: 10px;
		width: calc(100% - 20px);
	}

	&__type {
		position: absolute;
		top: 5px;
		left: 5px;
		color: #fff;
		background-color: var(--color-primary);
		font-size: 12px;
		padding: 2px 5px;
		border-radius: 3px;
	}

	&__error {
		padding: 10px;
		color: red;
	}

	&__mask {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.3);

		span {
			position: absolute;
			right: 10px;
			top: 10px;
			background-color: #67c23a;
			color: #fff;
			display: inline-block;
			height: 20px;
			width: 20px;
			text-align: center;
			line-height: 20px;
			border-radius: 20px;
		}
	}
}
</style>
