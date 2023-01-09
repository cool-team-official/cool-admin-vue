<template>
	<div class="cl-upload-panel" @dragover="onDragover" @drop="onDrop">
		<cl-view-group ref="ViewGroup" title="全部文件">
			<template #left>
				<item-category />
			</template>

			<template #right>
				<div class="cl-upload-panel__right" ref="Content">
					<!-- 操作栏 -->
					<div class="cl-upload-panel__header">
						<el-button @click="refresh({ page: 1 })">刷新</el-button>

						<div :style="{ margin: '0px 10px' }">
							<cl-upload
								ref="Upload"
								type="file"
								:show-file-list="false"
								:limit="limit"
								:limit-upload="false"
								:accept="accept"
								multiple
								@success="onSuccess"
								@upload="onUpload"
							>
								<el-button type="primary">点击上传</el-button>
							</cl-upload>
						</div>

						<template v-if="!selectable">
							<el-button
								type="danger"
								:disabled="selection.length == 0"
								@click="remove()"
								>删除选中文件</el-button
							>
						</template>
					</div>

					<!-- 文件区域 -->
					<el-scrollbar class="cl-upload-panel__file" v-loading="loading">
						<div v-infinite-scroll="loadmore" :infinite-scroll-immediate="false">
							<!-- 文件列表 -->
							<template v-if="list.length > 0">
								<div
									class="list"
									:class="{
										'is-mini': browser.isMini
									}"
								>
									<div
										class="item"
										v-for="item in list"
										:key="item.preload || item.url"
									>
										<item-file
											:data="item"
											:list="list"
											@select="select"
											@remove="remove"
										/>
									</div>
								</div>
							</template>

							<!-- 空态 -->
							<div v-else class="empty">
								<el-icon class="el-icon--upload">
									<upload-filled />
								</el-icon>
								<p>将文件拖到此处，或点击按钮上传</p>
							</div>
						</div>
					</el-scrollbar>
				</div>
			</template>
		</cl-view-group>
	</div>
</template>

<script lang="ts" setup name="cl-upload-panel">
import { provide, reactive, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { useCool } from "/@/cool";
import { useViewGroup } from "/$/base";
import ItemCategory from "./items/category.vue";
import ItemFile from "./items/file.vue";

const props = defineProps({
	limit: {
		type: Number,
		default: 99
	},
	accept: String,
	selectable: Boolean
});

const emit = defineEmits(["selection-change"]);

const { service, browser } = useCool();
const { ViewGroup } = useViewGroup();

// cl-upload
const Upload = ref();

// 右侧内容
const Content = ref();

// 是否加载中
const loading = ref(false);

// 已选列表
const selection = ref<Eps.SpaceInfoEntity[]>([]);

// 文件列表
const list = ref<Eps.SpaceInfoEntity[]>([]);

// 分页信息
const pagination = reactive({
	page: 1,
	size: 50,
	total: 0
});

// 清空选择
function clear() {
	selection.value = [];
}

// 上传成功
function onSuccess(data: any) {
	service.space.info
		.add({
			classifyId: ViewGroup.value?.selected?.id,
			...data
		})
		.then((res) => {
			data.id = res.id;
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});
}

// 上传时
function onUpload(data: any) {
	list.value.unshift(data);
}

// 请求参数
const reqParams = {
	page: 1
};

// 刷新列表
async function refresh(params?: any) {
	// 清空选择
	clear();

	// 合并参数
	Object.assign(reqParams, {
		type: props.accept?.split("/")[0],
		...pagination,
		...params
	});

	// 加载中
	if (reqParams.page == 1) {
		loading.value = true;
	}

	await service.space.info.page(reqParams).then((res) => {
		// 合并分页
		Object.assign(pagination, res.pagination);

		if (reqParams.page == 1) {
			list.value = [];
		}

		list.value.push(...res.list);
	});

	// 加载完成
	loading.value = false;
}

// 选择
function select(item: Eps.SpaceInfoEntity) {
	const index = selection.value.findIndex((e) => e.id === item.id);

	if (index >= 0) {
		selection.value.splice(index, 1);
	} else {
		if (props.limit == 1) {
			selection.value = [item];
		} else {
			if (selection.value.length < props.limit) {
				selection.value.push(item);
			}
		}
	}
}

// 删除选中
function remove(item?: Eps.SpaceInfoEntity) {
	// 已选文件 id
	const ids = item ? [item.id] : selection.value.map((e) => e.id);

	ElMessageBox.confirm("此操作将删除文件, 是否继续?", "提示", {
		type: "warning"
	})
		.then(() => {
			ElMessage.success("删除成功");

			// 删除文件及选择
			ids.forEach((id) => {
				[list.value, selection.value].forEach((list) => {
					const index = list.findIndex((e) => e.id === id);
					list.splice(index, 1);
				});
			});

			// 删除请求
			service.space.info
				.delete({
					ids
				})
				.catch((err) => {
					ElMessage.error(err.message);
				});
		})
		.catch(() => null);
}

// 监听选择
watch(
	selection,
	(val) => {
		emit("selection-change", val);
	},
	{
		deep: true
	}
);

// 加载更多
function loadmore() {
	if (list.value.length && list.value.length < pagination.total) {
		refresh({
			page: pagination.page + 1
		});
	}
}

function onDragover(e: any) {
	e.preventDefault();
}

function onDrop(e: any) {
	e.preventDefault();

	e.dataTransfer.files.forEach((f: File, i: number) => {
		setTimeout(() => {
			Upload.value.upload(f);
		}, i * 10);
	});
}

provide("space", {
	selection,
	refresh,
	loading,
	list
});

defineExpose({
	selection,
	open,
	close,
	clear,
	refresh
});
</script>

<style lang="scss">
.cl-upload-panel {
	height: 100%;
	user-select: none;

	&__right {
		height: 100%;
		width: 100%;
	}

	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		padding: 0 10px;
	}

	&__file {
		height: calc(100% - 50px);
		padding: 0 10px;
		box-sizing: border-box;
		position: relative;

		.list {
			display: flex;
			flex-wrap: wrap;

			.item {
				height: 0;
				min-height: 140px;
				min-width: 140px;
				width: calc(12.5% - 10px);
				padding-top: calc(12.5% - 10px);
				margin: 0 10px 10px 0;
				position: relative;
				box-sizing: border-box;
			}

			&.is-mini {
				.item {
					width: calc(50% - 10px);
				}
			}
		}

		.empty {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			height: 180px;
			width: 360px;
			max-width: 80%;
			border-radius: 5px;
			border: 1px dashed var(--el-border-color);
			box-sizing: border-box;
			cursor: pointer;

			&:hover {
				border-color: var(--color-primary);
			}

			i {
				font-size: 67px;
				color: #c0c4cc;
			}

			p {
				font-size: 14px;
				margin-top: 15px;
				color: #999;
			}
		}
	}

	&__footer {
		padding: 9px 0;
	}
}
</style>
