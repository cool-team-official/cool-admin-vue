<template>
	<div class="cl-upload-space__wrap">
		<slot>
			<el-button v-if="showButton" size="mini" @click="open">点击上传</el-button>
		</slot>

		<!-- 弹框 -->
		<cl-dialog
			v-model="visible"
			title="文件空间"
			height="630px"
			width="1000px"
			keep-alive
			:props="{
				'close-on-click-modal': false,
				'append-to-body': true,
				customClass: 'dialog-upload-space'
			}"
			:controls="['slot-expand', 'cl-flex1', 'fullscreen', 'close']"
		>
			<div class="cl-upload-space">
				<!-- 类目 -->
				<category v-model="category.id" @change="refresh()" />

				<!-- 内容 -->
				<div class="cl-upload-space__content">
					<!-- 操作栏 -->
					<div class="cl-upload-space__header scroller1">
						<el-button size="mini" @click="refresh()">刷新</el-button>

						<cl-upload
							style="margin: 0 10px"
							list-type="slot"
							:action="action"
							:accept="accept"
							:limit-size="limitSize"
							:show-file-list="false"
							:headers="headers"
							:data="data"
							:disabled="disabled"
							:rename="rename"
							:on-success="onSuccess"
							:on-error="onError"
							:on-progress="onProgress"
							:before-upload="beforeUpload"
						>
							<el-button size="mini" type="primary">点击上传</el-button>
						</cl-upload>

						<el-button
							type="success"
							size="mini"
							:disabled="!isSelected"
							@click="confirm()"
							>使用选中文件 {{ limitTip }}</el-button
						>

						<el-button
							type="danger"
							size="mini"
							:disabled="!isSelected"
							@click="remove()"
							>删除选中文件</el-button
						>
					</div>

					<!-- 文件区域 -->
					<div
						v-loading="loading"
						class="cl-upload-space__file scroller1"
						element-loading-text="拼命加载中"
					>
						<!-- 文件列表 -->
						<template v-if="list.length > 0">
							<div class="cl-upload-space__file-list">
								<file-item
									v-for="item in list"
									:key="item.id"
									v-loading="item.loading"
									:modelValue="item"
									:element-loading-text="item.progress"
									@select="select"
									@remove="remove"
								/>
							</div>
						</template>

						<!-- 空态 -->
						<div v-else class="cl-upload-space__file-empty">
							<cl-upload
								drag
								:action="action"
								:accept="accept"
								:limit-size="limitSize"
								:headers="headers"
								:data="data"
								:disabled="disabled"
								:rename="rename"
								:on-success="onSuccess"
								:on-error="onError"
								:on-progress="onProgress"
								:before-upload="beforeUpload"
							>
								<i class="el-icon-upload"></i>
								<div class="el-upload__text">
									将文件拖到此处，或<em>点击上传</em>
								</div>
							</cl-upload>
						</div>
					</div>

					<!-- 分页 -->
					<div class="cl-upload-space__footer">
						<el-pagination
							background
							:page-size="pagination.size"
							:current-page="pagination.page"
							:total="pagination.total"
							@current-change="onCurrentChange"
						/>
					</div>
				</div>
			</div>

			<!-- 展开按钮 -->
			<template #slot-expand>
				<button>
					<i
						v-if="category.visible"
						class="el-icon-notebook-2"
						@click="category.visible = false"
					></i>
					<i v-else class="el-icon-arrow-left" @click="category.visible = true"></i>
				</button>
			</template>
		</cl-dialog>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, provide, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { ElFile } from "element-plus/lib/el-upload/src/upload.type";
import { isEmpty } from "/@/core/utils";
import Category from "./category.vue";
import FileItem from "./file-item.vue";

export default defineComponent({
	name: "cl-upload-space",

	components: {
		Category,
		FileItem
	},

	props: {
		// 绑定值
		modelValue: String,
		// 上传的地址
		action: String,
		// 选择图片的长度
		limit: {
			type: Number,
			default: 9
		},
		// 最大允许上传文件大小(MB)
		limitSize: {
			type: Number,
			default: 10
		},
		// 是否禁用
		disabled: Boolean,
		// 是否以 uuid 重命名
		rename: Boolean,
		// 设置上传的请求头部
		headers: Object,
		// 上传时附带的额外参数
		data: Object,
		// 上传的文件类型
		accept: String,
		// 是否返回详细数据
		detailData: Boolean,
		// 是否显示按钮
		showButton: {
			type: Boolean,
			default: true
		}
	},

	emits: ["update:modelValue", "confirm"],

	setup(props, { emit }) {
		const store = useStore();
		const service = inject<any>("service");

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
			id: "",
			visible: true
		});

		// 分页信息
		const pagination = reactive<any>({
			page: 1,
			size: 12,
			total: 0
		});

		// 浏览器信息
		const browser = computed(() => store.getters.browser);

		// 监听屏幕大小变化
		watch(
			() => browser.value.isMini,
			(val) => {
				category.visible = val ? false : true;
			},
			{
				immediate: true
			}
		);

		// 提示信息
		const limitTip = computed(() => selection.value.length + "/" + props.limit);

		// 是否选中
		const isSelected = computed(() => !isEmpty(selection.value));

		// Provide
		provide("space", {
			category,
			selection
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
		function onSuccess(res: any, file: ElFile) {
			const item = list.value.find((e: any) => file.uid == e.uid);

			if (item) {
				item.url = res.data;

				service.upload.info
					.add({
						url: res.data,
						type: item.type,
						classifyId: item.classifyId
					})
					.then((res: any) => {
						item.loading = false;
						item.id = res.id;
					})
					.catch((err: string) => {
						ElMessage.error(err);
					});
			}
		}

		// 上传失败
		function onError(err: string, file: ElFile) {
			const item = list.value.find((e) => file.uid == e.uid);

			if (item) {
				item.loading = false;
				item.error = err;
			}
		}

		// 上传前，添加文件
		function beforeUpload({ tempFilePath, type, uid }: any) {
			list.value.unshift({
				url: tempFilePath,
				type,
				uid,
				classifyId: category.id,
				loading: true,
				progress: "0%"
			});
		}

		// 上传进度
		function onProgress({ percent }: any, file: ElFile) {
			const item = list.value.find(({ uid }: any) => uid == file.uid);

			if (item) {
				item.progress = percent + "%";
			}
		}

		// 刷新资源文件
		async function refresh(params: any = {}) {
			// 清空选择
			clear();

			// 加载中
			loading.value = true;

			await service.upload.info
				.page({
					...pagination,
					...params,
					classifyId: category.id,
					type: props.accept
				})
				.then((res: any) => {
					Object.assign(pagination, res.pagination);

					list.value = res.list.map((e: any) => {
						return {
							...e,
							loading: false
						};
					});
				});

			// 加载完成
			loading.value = false;
		}

		// 确认选中
		function confirm() {
			const urls = selection.value.map((e: any) => e.url).join(",");

			emit("update:modelValue", urls);
			emit("confirm", props.detailData ? selection.value : urls);

			close();
		}

		// 选择
		function select(item: any) {
			const index = selection.value.findIndex((e: any) => e.id === item.id);

			if (index >= 0) {
				selection.value.splice(index, 1);
			} else {
				if (selection.value.length < props.limit) {
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
					service.upload.info
						.delete({
							ids
						})
						.catch((err: string) => {
							ElMessage.error(err);
						});
				})
				.catch(() => null);
		}

		// 页面切换
		function onCurrentChange(page: number) {
			refresh({ page });
		}

		return {
			visible,
			loading,
			selection,
			list,
			category,
			pagination,
			browser,
			limitTip,
			isSelected,
			open,
			close,
			refresh,
			remove,
			confirm,
			select,
			onSuccess,
			onError,
			beforeUpload,
			onProgress,
			onCurrentChange
		};
	}
});
</script>

<style lang="scss">
.dialog-upload-space {
	.el-dialog {
		&__body {
			padding: 0 !important;
		}
	}
}

.cl-upload-space {
	display: flex;
	height: 100%;
	box-sizing: border-box;
	background-color: #f7f7f7;
	padding: 5px;

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
		height: calc(100% - 100px);
		position: relative;

		&-list {
			display: flex;
			flex-wrap: wrap;
		}

		&-empty {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: calc(50% - 90px);
			left: calc(50% - 160px);

			.cl-upload {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-radius: 6px;
				cursor: pointer;

				.el-upload-dragger {
					height: 180px;
					width: 320px;
				}

				i {
					font-size: 67px;
					color: #c0c4cc;
				}
			}
		}
	}

	&__footer {
		padding: 9px 0;
	}
}
</style>
