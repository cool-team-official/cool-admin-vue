<template>
	<div class="cl-upload-item__wrap">
		<keep-alive>
			<div
				class="cl-upload-item"
				:class="[
					{
						'is-play': item.isPlay
					}
				]"
				@contextmenu.stop.prevent="onContextMenu"
			>
				<!-- 图片 -->
				<template v-if="item.type === 'image' && !item.error">
					<el-image
						class="cl-upload-item__image-cover"
						fit="contain"
						:src="item.preload || url"
						lazy
						@error="item.error = '加载失败'"
					/>
				</template>

				<!-- 视频 -->
				<template v-else-if="item.type === 'video' && item.url">
					<video :ref="setRefs('video')" :src="item.url" />
				</template>

				<!-- 其他 -->
				<template v-else>
					<!-- 图标 -->
					<div class="cl-upload-item__icon">
						<cl-svg :name="item.type" />
					</div>
					<!-- 文件名 -->
					<div class="cl-upload-item__name">
						<span>{{ fileName(item.name || url) }}</span>
						<span class="error" v-show="item.error">{{ item.error }}</span>
					</div>
				</template>

				<!-- 音频 -->
				<template v-if="item.type === 'audio'">
					<audio controls :ref="setRefs('audio')">
						<source :src="item.url" type="audio/mpeg" />
					</audio>
				</template>

				<!-- 上传中 -->
				<div
					class="cl-upload-item__progress"
					:class="{
						'is-show': item.progress >= 0 && item.progress < 100,
						'is-hide': item.progress == 100
					}"
				>
					<!-- 进度条 -->
					<div class="cl-upload-item__progress-bar">
						<el-progress :percentage="item.progress" :show-text="false" />
					</div>

					<!-- 进度值 -->
					<span class="cl-upload-item__progress-value">{{ item.progress }}</span>
				</div>

				<!-- 角标 -->
				<span
					class="cl-upload-item__tag"
					:style="{
						backgroundColor: tag.color
					}"
				>
					{{ tag.name }}
				</span>

				<template v-if="url">
					<!-- 工具 -->
					<div class="cl-upload-item__actions">
						<template v-if="media.isMedia">
							<el-icon @click.stop="media.pause()" v-if="item.isPlay">
								<video-pause />
							</el-icon>

							<el-icon @click.stop="media.play()" v-else>
								<video-play />
							</el-icon>
						</template>

						<template v-else>
							<el-icon @click.stop="preview">
								<zoom-in />
							</el-icon>
						</template>

						<el-icon @click.stop="remove">
							<delete />
						</el-icon>
					</div>
				</template>
			</div>
		</keep-alive>

		<!-- 预览 -->
		<viewer :ref="setRefs('viewer')" />
	</div>
</template>

<script lang="ts" name="cl-upload-item" setup>
import { computed, PropType, onMounted, watch, reactive } from "vue";
import { ZoomIn, Delete, VideoPause, VideoPlay } from "@element-plus/icons-vue";
import { ContextMenu } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { extname } from "/@/cool/utils";
import { fileName, getRule } from "../../utils";
import { ElMessage } from "element-plus";
import { useClipboard } from "@vueuse/core";
import Viewer from "./viewer.vue";
import { Upload } from "../../types";

const props = defineProps({
	item: {
		type: Object as PropType<Upload.Item>,
		required: true
	},
	list: {
		type: Array as PropType<Upload.Item[]>,
		default: () => []
	}
});

const emit = defineEmits(["remove"]);

const { refs, setRefs } = useCool();
const { copy } = useClipboard();

// 图片地址
const url = computed(() => props.item.url || "");

// 角标
const tag = computed(() => {
	const d = getRule(props.item.type);

	return {
		color: d.color,
		name: extname(props.item.name || url.value)
	};
});

// 移除
function remove() {
	emit("remove", props.item);
}

// 预览
function preview() {
	refs.viewer.open(props.item);
}

// 右键菜单
function onContextMenu(e: any) {
	ContextMenu.open(e, {
		hover: {
			target: "cl-upload-item__wrap"
		},
		list: [
			{
				label: "预览",
				callback(done) {
					preview();
					done();
				}
			},
			{
				label: "复制链接",
				callback(done) {
					if (props.item.url) {
						copy(props.item.url);
						ElMessage.success("复制成功");
					}

					done();
				}
			},
			// {
			// 	label: isSelected.value ? "取消选中" : "选中",
			// 	callback(done) {
			// 		select();
			// 		done();
			// 	}
			// },
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

// 媒体
const media = reactive({
	isMedia: ["video", "audio"].includes(props.item.type!),

	play() {
		props.list.forEach((e) => {
			e.isPlay = e.uid ? props.item.uid == e.uid : props.item.id == e.id;
		});
	},

	pause() {
		props.item.isPlay = false;
	},

	create() {
		if (!media.isMedia) {
			return false;
		}

		// 媒体元素
		const el = refs[props.item.type!];

		// 监听播放\暂停
		watch(
			() => props.item.isPlay,
			(val) => {
				if (val) {
					el.play();
				} else {
					el.pause();
				}
			}
		);

		// 监听播放完成
		el?.addEventListener("ended", () => {
			media.pause();
		});
	}
});

onMounted(() => {
	media.create();
});
</script>

<style lang="scss" scoped>
.cl-upload-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	width: 100%;
	cursor: pointer;
	border-radius: 6px;
	overflow: hidden;
	background-color: var(--el-fill-color-light);
	border: 1px solid var(--el-fill-color-light);
	box-sizing: border-box;
	margin-bottom: 10px;
	position: relative;

	audio {
		visibility: hidden;
		height: 0;
	}

	video {
		height: 100%;
	}

	&__wrap {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
	}

	&__icon {
		.cl-svg {
			font-size: 100px;
			position: absolute;
			right: -24px;
			top: -24px;
			fill: var(--el-fill-color-dark);
		}
	}

	&__name {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 50px;
		width: 100%;
		font-size: 12px;
		overflow: hidden;
		padding: 0 10px;
		position: absolute;
		bottom: 0;
		left: 0;
		box-sizing: border-box;
		line-height: 1;

		span {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;

			&.error {
				color: var(--el-color-danger);
				margin-top: 5px;
			}
		}
	}

	&__progress {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		pointer-events: none;
		transition: opacity 0.3s;
		opacity: 0;

		&-bar {
			position: absolute;
			bottom: 10px;
			left: 10px;
			width: calc(100% - 20px);
		}

		&-value {
			position: absolute;
			font-size: 26px;
			color: #fff;

			&::after {
				content: "%";
				margin-left: 2px;
			}
		}

		&.is-show {
			opacity: 1;
		}

		&.is-hide {
			opacity: 0;
		}
	}

	&__tag {
		position: absolute;
		top: 5px;
		left: 5px;
		color: #fff;
		font-size: 12px;
		padding: 2px 4px;
		border-radius: 2px;
		text-transform: uppercase;
		line-height: 1;
		max-width: 80px;
		box-sizing: border-box;
		white-space: nowrap;
		overflow: hidden;
	}

	&__actions {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 9;
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 6px;
		opacity: 0;
		transition: opacity 0.3s cubic-bezier(0.55, 0, 0.1, 1);

		.el-icon {
			color: #fff;
			margin: 0 8px;
			font-size: 20px;

			&:hover {
				color: #eee;
			}
		}
	}

	&.is-play {
		animation: play 1s linear infinite;
	}

	&:hover {
		.cl-upload-item__actions {
			opacity: 1;
		}
	}
}

@keyframes play {
	0% {
		border-color: var(--el-color-primary);
	}
	100% {
		border-color: var(--el-fill-color-light);
	}
}
</style>
