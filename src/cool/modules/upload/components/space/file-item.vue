<template>
	<div
		class="cl-upload-space-item"
		:class="[`is-${type}`]"
		@click.stop.prevent="select"
		@contextmenu.stop.prevent="openContextMenu"
	>
		<!-- 错误 -->
		<template v-if="info.error">
			<div class="cl-upload-space-item__error">上传失败：{{ info.error }}</div>
		</template>

		<!-- 成功 -->
		<template v-else>
			<!-- 图片 -->
			<template v-if="type === 'image'">
				<el-image fit="cover" :src="info.url" lazy />
			</template>

			<!-- 视频 -->
			<template v-else-if="type === 'video'">
				<video
					controls
					:src="info.url"
					:style="{
						maxHeight: '100%',
						maxWidth: '100%'
					}"
				></video>
			</template>

			<!-- 其他 -->
			<template v-else>
				<span>{{ info.url }}</span>
			</template>
		</template>

		<!-- 大小 -->
		<div class="cl-upload-space-item__size"></div>

		<!-- 遮罩层 -->
		<div v-if="isSelected" class="cl-upload-space-item__mask">
			<span>{{ index + 1 }}</span>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from "vue";
import { ContextMenu } from "cl-admin-crud-vue3";
import { ElMessage } from "element-plus";
import Clipboard from "clipboard";

export default defineComponent({
	name: "cl-upload-space-item",

	props: {
		modelValue: {
			type: Object,
			default: () => {
				return {};
			}
		}
	},

	emits: ["select", "remove"],

	setup(props, { emit }) {
		const space = inject<any>("space");

		// 文件信息
		const info = computed(() => props.modelValue);

		// 已选的序号
		const index = computed(() =>
			space.selection.value.findIndex((e: any) => e.id === info.value.id)
		);

		// 是否已选择
		const isSelected = computed(() => index.value >= 0);

		// 文件类型
		const type = computed(() => (info.value.type || "").split("/")[0]);

		// 选择
		function select() {
			emit("select", info.value);
		}

		// 移除
		function remove() {
			emit("remove", info.value);
		}

		// 右键菜单
		function openContextMenu(e: any) {
			ContextMenu.open(e, {
				list: [
					{
						label: "复制地址",
						callback: (e: any, done: Function) => {
							const clipboard: any = new Clipboard(e.target, {
								text: () => info.value.url
							});

							clipboard.on("success", () => {
								ElMessage.success("复制成功");
								clipboard.destroy();
							});

							clipboard.on("error", () => {
								clipboard.destroy();
							});

							clipboard.onClick(e);
							done();
						}
					},
					{
						label: isSelected.value ? "取消选中" : "选中",
						"suffix-icon": isSelected.value ? "el-icon-close" : "el-icon-check",
						callback: (_: any, done: Function) => {
							select();
							done();
						}
					},
					{
						label: "删除",
						"suffix-icon": "el-icon-delete",
						callback: (_: any, done: Function) => {
							remove();
							done();
						}
					}
				]
			});
		}

		return {
			info,
			index,
			type,
			isSelected,
			select,
			remove,
			openContextMenu
		};
	}
});
</script>

<style lang="scss" scoped>
.cl-upload-space-item {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 160px;
	width: 160px;
	max-width: calc(50% - 10px);
	cursor: pointer;
	position: relative;
	border-radius: 3px;
	box-sizing: border-box;
	border: 1px solid #eee;
	margin: 5px 10px 5px 0;

	&.is-image {
		overflow: hidden;
	}

	&.is-video {
		video {
			max-height: 100%;
			width: 100%;
		}
	}

	&__size {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.3);
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
