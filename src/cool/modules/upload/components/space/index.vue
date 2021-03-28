<template>
	<div class="cl-upload-space__wrap">
		<slot>
			<el-button v-if="showButton" size="mini" @click="open">点击上传</el-button>
		</slot>

		<!-- 弹框 -->
		<cl-dialog
			title="文件空间"
			height="630px"
			width="1000px"
			keep-alive
			v-model="visible"
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
						class="cl-upload-space__file scroller1"
						v-loading="loading"
						element-loading-text="拼命加载中"
					>
						<!-- 文件列表 -->
						<template v-if="list.length > 0">
							<div class="cl-upload-space__file-list">
								<file-item
									v-for="item in list"
									:key="item.id"
									:value="item"
									:element-loading-text="item.progress"
									v-loading="item.loading"
									@select="select"
									@remove="remove"
								></file-item>
							</div>
						</template>

						<!-- 空态 -->
						<div class="cl-upload-space__file-empty" v-else>
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
							@current-change="
								page => {
									refresh({ page });
								}
							"
						></el-pagination>
					</div>
				</div>
			</div>

			<!-- 展开按钮 -->
			<template #slot-expand>
				<button>
					<i
						class="el-icon-notebook-2"
						v-if="category.visible"
						@click="category.visible = false"
					></i>
					<i class="el-icon-arrow-left" v-else @click="category.visible = true"></i>
				</button>
			</template>
		</cl-dialog>
	</div>
</template>

<script>
import { isEmpty } from "@/core/utils";
import Category from "./category";
import FileItem from "./file-item";
import { mapGetters } from "vuex";

export default {
	name: "cl-upload-space",

	props: {
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

	components: {
		Category,
		FileItem
	},

	provide() {
		return {
			space: this
		};
	},

	data() {
		return {
			visible: false,
			loading: false,
			category: {
				id: null,
				visible: true
			},
			selection: [],
			list: [],
			pagination: {
				page: 1,
				size: 12,
				total: 0
			}
		};
	},

	computed: {
		...mapGetters(["browser"]),

		limitTip() {
			return this.selection.length + "/" + this.limit;
		},

		isSelected() {
			return !isEmpty(this.selection);
		}
	},

	watch: {
		"browser.isMini": {
			immediate: true,
			handler(val) {
				this.category.visible = val ? false : true;
			}
		}
	},

	methods: {
		open() {
			this.visible = true;
		},

		close() {
			this.visible = false;
			this.clear();
		},

		clear() {
			this.selection = [];
		},

		// 上传成功
		onSuccess(res, file) {
			const item = this.list.find(e => file.uid == e.uid);

			if (item) {
				item.url = res.data;

				this.$service.space.info
					.add({
						url: res.data,
						type: item.type,
						classifyId: item.classifyId
					})
					.then(res => {
						item.loading = false;
						item.id = res.id;
					})
					.catch(err => {
						this.$message.error(err);
					});
			}
		},

		// 上传失败
		onError(err, file) {
			const item = this.list.find(e => file.uid == e.uid);

			if (item) {
				item.loading = false;
				this.$set(item, "error", err);
			}
		},

		// 上传前，添加文件
		beforeUpload({ tempFilePath, type, uid }) {
			this.list.unshift({
				url: tempFilePath,
				type,
				uid,
				classifyId: this.category.id,
				loading: true,
				progress: "0%"
			});
		},

		// 上传进度
		onProgress({ percent }, file) {
			const item = this.list.find(({ uid }) => uid == file.uid);

			if (item) {
				item.progress = percent + "%";
			}
		},

		// 刷新资源文件
		refresh(params) {
			// 清空选择
			this.clear();

			this.loading = true;

			this.$service.space.info
				.page({
					...this.pagination,
					...params,
					classifyId: this.category.id,
					type: this.accept
				})
				.then(res => {
					this.pagination = res.pagination;

					this.list = res.list.map(e => {
						e.loading = false;
						return e;
					});
				})
				.done(() => {
					this.loading = false;
				});
		},

		// 确认选中
		confirm() {
			const urls = this.selection.map(e => e.url).join(",");

			this.$emit("update:modelValue", urls);
			this.$emit("confirm", this.detailData ? this.selection : urls);

			this.close();
		},

		// 选择
		select(item) {
			const index = this.selection.findIndex(e => e.id === item.id);

			if (index >= 0) {
				this.selection.splice(index, 1);
			} else {
				if (this.selection.length < this.limit) {
					this.selection.push(item);
				}
			}
		},

		// 删除选中
		remove(...selection) {
			if (isEmpty(selection)) {
				selection = this.selection;
			}

			// 已选文件 id
			const ids = selection.map(e => e.id);

			this.$confirm("此操作将删除文件, 是否继续?", "提示", {
				type: "warning"
			})
				.then(() => {
					this.$message.success("删除成功");

					// 删除文件及选择
					ids.forEach(id => {
						[this.list, this.selection].forEach(list => {
							const index = list.findIndex(e => e.id === id);
							list.splice(index, 1);
						});
					});

					// 删除请求
					this.$service.space.info
						.delete({
							ids
						})
						.catch(err => {
							this.$message.error(err);
						});
				})
				.catch(() => null);
		}
	}
};
</script>

<style lang="scss">
.dialog-upload-space {
	.el-dialog {
		&__body {
			padding: 0 !important;
		}
	}
}
</style>

<style lang="scss" scoped>
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

			:deep(.cl-upload) {
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
