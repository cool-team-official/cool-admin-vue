<template>
	<div class="cl-upload-space__wrap">
		<slot>
			<el-button @click="open" v-if="showBtn">点击上传</el-button>
		</slot>

		<!-- 弹框 -->
		<cl-dialog
			v-model="visible"
			title="文件空间"
			height="630px"
			width="1000px"
			keep-alive
			custom-class="cl-upload-space__dialog"
			:close-on-click-modal="false"
			append-to-body
			:controls="['slot-expand', 'cl-flex1', 'fullscreen', 'close']"
		>
			<div class="cl-upload-space">
				<!-- 类目 -->
				<category />

				<!-- 内容 -->
				<div class="cl-upload-space__content">
					<!-- 操作栏 -->
					<div class="cl-upload-space__header scroller1">
						<el-button @click="refresh({ page: 1 })">刷新</el-button>

						<div :style="{ marginLeft: '10px' }">
							<cl-upload
								ref="Upload"
								type="file"
								:show-file-list="false"
								:disabled="disabled"
								:limit="9999"
								multiple
								@success="onSuccess"
								@upload="onUpload"
							>
								<el-button type="primary">点击上传</el-button>
							</cl-upload>
						</div>

						<el-button type="success" :disabled="!isSelected" @click="confirm()"
							>使用选中文件 {{ selection.length }} / {{ limit }}</el-button
						>

						<el-button type="danger" :disabled="!isSelected" @click="remove()"
							>删除选中文件</el-button
						>
					</div>

					<!-- 文件区域 -->
					<div
						class="cl-upload-space__file scroller1"
						v-infinite-scroll="loadmore"
						v-loading="loading"
						@dragover="onDragover"
						@drop="onDrop"
					>
						<!-- 文件列表 -->
						<template v-if="list.length > 0">
							<div class="cl-upload-space__file-list">
								<el-row :gutter="10">
									<el-col
										:xs="12"
										:sm="6"
										v-for="item in list"
										:key="item.preload || item.url"
									>
										<file-item :data="item" @select="select" @remove="remove" />
									</el-col>
								</el-row>
							</div>
						</template>

						<!-- 空态 -->
						<div v-else class="cl-upload-space__file-empty">
							<el-icon class="el-icon--upload"><upload-filled /></el-icon>
							<p>将文件拖到此处，或点击上传</p>
						</div>
					</div>
				</div>
			</div>

			<!-- 展开按钮 -->
			<template #slot-expand>
				<button class="cl-dialog__controls-icon">
					<el-icon @click="category.visible = false" v-if="category.visible">
						<notebook />
					</el-icon>
					<el-icon @click="category.visible = true" v-else>
						<arrow-left />
					</el-icon>
				</button>
			</template>
		</cl-dialog>
	</div>
</template>

<script lang="ts">
export default {
	name: "cl-upload-space"
};
</script>

<script lang="ts" setup>
import { computed, onMounted, provide, reactive, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { isEmpty, module } from "/@/cool/utils";
import Category from "./space/category.vue";
import FileItem from "./space/file-item.vue";
import { useCool } from "/@/cool";
import { useBaseStore } from "/$/base";
import { Notebook, ArrowLeft, UploadFilled } from "@element-plus/icons-vue";

const props = defineProps({
	// 绑定值
	modelValue: String,
	// 选择图片的数量
	limit: Number,
	// 是否禁用
	disabled: Boolean,
	// 显示按钮
	showBtn: {
		type: Boolean,
		default: true
	}
});

const emit = defineEmits(["update:modelValue", "confirm"]);

const { service } = useCool();

// 缓存
const { app } = useBaseStore();

// 模块配置
const { options } = module.get("upload");

// cl-upload
const Upload = ref<any>();

// 选择图片的数量
const limit = props.limit || options.limit.select;

// 是否可见
const visible = ref<boolean>(false);

// 是否加载中
const loading = ref<boolean>(false);

// 已选列表
const selection = ref<any[]>([]);

// 文件列表
const list = ref<any[]>([]);

// 类目数据
const category = reactive<any>({
	id: null,
	visible: true
});

// 分页信息
const pagination = reactive<any>({
	page: 1,
	size: 20,
	total: 0
});

// 监听屏幕大小变化
watch(
	() => app.browser.isMini,
	(val) => {
		category.visible = val ? false : true;
	},
	{
		immediate: true
	}
);

// 是否选中
const isSelected = computed(() => !isEmpty(selection.value));

// 共享
provide("space", {
	category,
	selection,
	refresh,
	loading
});

// 打开
function open() {
	visible.value = true;
}

// 清空选择
function clear() {
	selection.value = [];
}

// 关闭
function close() {
	visible.value = false;
	clear();
}

// 上传成功
function onSuccess(data: any) {
	console.log(data.classifyId);
	service.space.info
		.add(data)
		.then((res) => {
			data.id = res.id;
		})
		.catch((err) => {
			ElMessage.error(err.message);
		});
}

// 上传时
function onUpload(data: any) {
	data.classifyId = category.id;
	list.value.unshift(data);
}

// 刷新资源文件
async function refresh(params: any = {}) {
	// 清空选择
	clear();

	const d = {
		...pagination,
		...params,
		classifyId: category.id
	};

	// 加载中
	if (d.page == 1) {
		loading.value = true;
	}

	await service.space.info.page(d).then((res) => {
		// 合并
		Object.assign(pagination, res.pagination);

		if (d.page == 1) {
			list.value = [];
		}

		list.value.push(...res.list);
	});

	// 加载完成
	loading.value = false;
}

// 确认选中
function confirm() {
	emit("update:modelValue", selection.value.map((e: any) => e.url).join(","));
	emit("confirm", selection.value);

	close();
}

// 选择
function select(item: any) {
	const index = selection.value.findIndex((e: any) => e.id === item.id);

	if (index >= 0) {
		selection.value.splice(index, 1);
	} else {
		if (selection.value.length < limit) {
			selection.value.push(item);
		}
	}
}

// 删除选中
function remove(item?: any) {
	// 已选文件 id
	const ids: number[] = item ? [item.id] : selection.value.map((e: any) => e.id);

	ElMessageBox.confirm("此操作将删除文件, 是否继续?", "提示", {
		type: "warning"
	})
		.then(() => {
			ElMessage.success("删除成功");

			// 删除文件及选择
			ids.forEach((id) => {
				[list.value, selection.value].forEach((list) => {
					const index = list.findIndex((e: any) => e.id === id);
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

function onDragover(e: any) {
	e.preventDefault();
}

function onDrop(e: any) {
	e.preventDefault();

	e.dataTransfer.files.forEach((f: File) => {
		Upload.value.upload(f);
	});
}

// 加载更多
function loadmore() {
	if (list.value.length && list.value.length < pagination.total) {
		refresh({
			page: pagination.page + 1
		});
	}
}

onMounted(() => {
	refresh();
});

defineExpose({
	open,
	close,
	clear,
	refresh
});
</script>

<style lang="scss">
.cl-upload-space {
	display: flex;
	height: 100%;
	box-sizing: border-box;
	background-color: #f7f7f7;
	padding: 5px;

	&__dialog {
		.el-dialog__body {
			padding: 0;
		}
	}

	&__content {
		flex: 1;
		max-width: 100%;
		padding: 0 10px;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 5px;
	}

	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		overflow: auto hidden;
	}

	&__file {
		height: calc(100% - 50px);
		position: relative;

		&-list {
			.el-row {
				width: 100%;
			}
		}

		&-empty {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: calc(50% - 90px);
			left: calc(50% - 180px);
			height: 180px;
			width: 360px;
			border-radius: 5px;
			border: 2px dashed #eee;
			cursor: pointer;

			&:hover {
				border-color: $color-primary;
			}

			i {
				font-size: 67px;
				color: #c0c4cc;
			}

			p {
				font-size: 14px;
				margin-top: 15px;
			}
		}
	}

	&__footer {
		padding: 9px 0;
	}
}
</style>
