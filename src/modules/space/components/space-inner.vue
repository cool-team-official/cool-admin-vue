<template>
	<div class="cl-upload-space-inner" @dragover="onDragover" @drop="onDrop">
		<cl-view-group ref="ViewGroup">
			<template #right>
				<div class="cl-upload-space-inner__right">
					<!-- 操作栏 -->
					<div class="cl-upload-space-inner__header">
						<el-button @click="refresh({ page: 1 })">刷新</el-button>

						<div :style="{ margin: '0px 10px' }">
							<cl-upload
								:ref="setRefs('upload')"
								menu="space"
								type="file"
								multiple
								:show-file-list="false"
								:limit="9999"
								:accept="accept"
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
					<el-scrollbar class="cl-upload-space-inner__file" v-loading="loading">
						<!-- 文件列表 -->
						<template v-if="list.length > 0">
							<div
								class="cl-upload-space-inner__file-list"
								:class="{
									'is-mini': browser.isMini
								}"
							>
								<div
									class="cl-upload-space-inner__file-item"
									v-for="item in list"
									:key="item.preload || item.url"
									@click="select(item)"
								>
									<upload-item :item="item" :list="list" @remove="remove" />

									<!-- 已选序号 -->
									<div
										class="cl-upload-space-inner__file-index"
										v-show="onIndex(item.id)"
									>
										<span>{{ onIndex(item.id) }}</span>
									</div>
								</div>
							</div>
						</template>

						<!-- 空态 -->
						<div v-else class="cl-upload-space-inner__file-empty">
							<el-icon class="el-icon--upload">
								<upload-filled />
							</el-icon>
							<p>将文件拖到此处，或点击按钮上传</p>
						</div>
					</el-scrollbar>

					<div class="cl-upload-space-inner__footer">
						<el-pagination
							:small="browser.isMini ? true : false"
							:total="pagination.total"
							:default-page-size="pagination.size"
							v-model:current-page="pagination.page"
							background
							layout="prev, pager, next"
							@current-change="refresh()"
						/>

						<span class="total" v-show="!browser.isMini"
							>共 {{ pagination.total }} 条</span
						>
					</div>
				</div>
			</template>
		</cl-view-group>
	</div>
</template>

<script lang="ts" name="cl-upload-space-inner" setup>
import { provide, reactive, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { useCool } from "/@/cool";
import { useViewGroup } from "/@/plugins/view";
import UploadItem from "/@/plugins/upload/components/upload-item/index.vue";

const props = defineProps({
	limit: {
		type: Number,
		default: 99
	},
	accept: String,
	selectable: Boolean
});

const emit = defineEmits(["selection-change", "confirm"]);

const { service, browser, refs, setRefs } = useCool();

const { ViewGroup } = useViewGroup({
	label: "分类",
	title: "文件列表",
	service: service.space.type,
	onEdit() {
		return {
			width: "400px",
			props: {
				labelPosition: "top"
			},
			dialog: {
				controls: ["close"]
			},
			items: [
				{
					label: "名称",
					prop: "name",
					value: "",
					required: true,
					component: {
						name: "el-input",
						props: {
							maxlength: 20,
							clearable: true
						}
					}
				}
			]
		};
	},
	onSelect(item) {
		refresh({
			classifyId: item.id,
			page: 1
		});
	}
});

// 是否加载中
const loading = ref(false);

// 已选列表
const selection = ref<Eps.SpaceInfoEntity[]>([]);

// 文件列表
const list = ref<Eps.SpaceInfoEntity[]>([]);

// 分页信息
const pagination = reactive({
	page: 1,
	size: 20,
	total: 0
});

// 清空选择
function clear() {
	selection.value = [];
}

// 上传成功
function onSuccess<T extends { id: number }>(data: T) {
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
	// 合并参数
	Object.assign(reqParams, {
		type: props.accept?.split("/")[0].replace("*", "") || undefined,
		...pagination,
		...params
	});

	// 加载中
	if (reqParams.page == 1) {
		loading.value = true;
	}

	await service.space.info.page(reqParams).then((res) => {
		// 设置分页
		Object.assign(pagination, res.pagination);

		// 设置列表
		list.value = res.list as Eps.SpaceInfoEntity[];
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
			} else {
				ElMessage.warning(`最多只能选择${props.limit}个文件`);
			}
		}
	}
}

// 选择序号
function onIndex(id?: number) {
	return selection.value.findIndex((e) => e.id === id) + 1;
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

// 拖拽
function onDragover(e: DragEvent) {
	e.preventDefault();
}

// 放下
function onDrop(e: DragEvent) {
	e.preventDefault();

	if (e.dataTransfer) {
		// @ts-ignore
		e.dataTransfer.files.forEach((file: File, index: number) => {
			setTimeout(() => {
				refs.upload.upload(file);
			}, index * 10);
		});
	}
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
.cl-upload-space-inner {
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
		height: calc(100% - 110px);
		padding: 0 10px;
		box-sizing: border-box;
		position: relative;

		&-item {
			height: 0;
			min-height: 140px;
			min-width: 140px;
			width: calc(12.5% - 10px);
			padding-top: calc(12.5% - 10px);
			margin: 0 10px 10px 0;
			position: relative;
			box-sizing: border-box;
		}

		&-index {
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			width: 100%;
			background-color: rgba(0, 0, 0, 0.4);
			border-radius: 5px;
			pointer-events: none;

			span {
				position: absolute;
				right: 5px;
				top: 5px;
				background-color: var(--el-color-success);
				color: #fff;
				display: inline-block;
				height: 20px;
				width: 20px;
				text-align: center;
				line-height: 20px;
				border-radius: 20px;
				font-size: 14px;
			}
		}

		&-list {
			display: flex;
			flex-wrap: wrap;

			&.is-mini {
				.cl-upload-space-inner__file-item {
					width: calc(50% - 10px);
				}
			}
		}

		&-empty {
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
			border-radius: 6px;
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
		height: 60px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;

		.total {
			font-size: 14px;
			margin: 0 10px;
		}
	}
}
</style>
