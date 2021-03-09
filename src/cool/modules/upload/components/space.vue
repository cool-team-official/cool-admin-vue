<template>
	<div class="cl-upload-space__wrap">
		<slot>
			<el-button v-if="showButton" size="mini" @click="open">点击上传</el-button>
		</slot>

		<!-- 弹框 -->
		<cl-dialog :visible.sync="visible" v-bind="props" :op-list="['close']">
			<div class="cl-upload-space">
				<!-- 类目 -->
				<div class="cl-upload-space__category">
					<div class="cl-upload-space__category-search">
						<el-button type="primary" size="mini" @click="editCategory()"
							>添加分类</el-button
						>

						<el-input
							v-model="category.keyword"
							placeholder="输入关键字过滤"
							size="mini"
						></el-input>
					</div>

					<div class="cl-upload-space__category-list">
						<ul>
							<li
								v-for="(item, index) in categoryList"
								:key="index"
								:class="{
									'is-active': item.id == category.current.id
								}"
								@click="selectCategory(item)"
								@contextmenu.stop.prevent="openCategoryContextMenu($event, item)"
							>
								{{ item.name }}
							</li>
						</ul>
					</div>
				</div>

				<!-- 内容 -->
				<div class="cl-upload-space__content">
					<!-- 操作栏 -->
					<div class="cl-upload-space__opbar">
						<el-button
							type="success"
							size="mini"
							:disabled="selection.length === 0"
							@click="confirmFile()"
							>使用选中文件</el-button
						>

						<el-button
							type="danger"
							size="mini"
							:disabled="selection.length === 0"
							@click="deleteFile()"
							>删除选中文件</el-button
						>

						<cl-upload
							style="margin-left: 10px"
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
							:on-progress="onProgress"
							:before-upload="beforeUpload"
						>
							<el-button size="mini" type="primary">点击上传</el-button>
						</cl-upload>
					</div>

					<!-- 文件区域 -->
					<div
						class="cl-upload-space__file"
						v-loading="file.loading"
						element-loading-text="拼命加载中"
					>
						<!-- 文件列表 -->
						<el-row v-if="file.list.length > 0">
							<el-col :span="6" v-for="item in file.list" :key="item.id">
								<file-item
									:value="item"
									:element-loading-text="item.progress"
									v-loading="item.loading"
								></file-item>
							</el-col>
						</el-row>

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
					<el-pagination
						background
						:page-size="file.pagination.size"
						:current-page="file.pagination.page"
						:total="file.pagination.total"
						@current-change="onCurrentChange"
					></el-pagination>
				</div>
			</div>
		</cl-dialog>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { last, isEmpty } from "cl-admin/utils";

export default {
	name: "cl-upload-space",

	componentName: "UploadSpace",

	props: {
		// 上传的地址
		action: String,
		// 选择图片的长度
		limit: {
			type: Number,
			default: 8
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
		fileItem: {
			props: {
				value: Object
			},

			computed: {
				parent() {
					let parent = this;

					while (parent.$options.componentName != "UploadSpace") {
						parent = parent.$parent;
					}

					return parent;
				}
			},

			methods: {
				onSelect() {
					this.parent.selectFile(this.value);
				},

				onContextMenu(e) {
					this.parent.openFileContextMenu(e, this.value);
					e.stopPropagation();
					e.preventDefault();
				}
			},

			render() {
				if (!this.value) {
					return null;
				}

				let itemEl = null;

				const { url, type, selected, id } = this.value;
				const fileType = (type || "").split("/")[0];

				switch (fileType) {
					case "image":
						itemEl = <el-image fit="cover" src={url} lazy></el-image>;
						break;

					case "video":
						itemEl = (
							<video
								controls
								src={url}
								style={{
									"max-height": "100%",
									"max-width": "100%"
								}}></video>
						);
						break;

					default:
						itemEl = <span>{url}</span>;
						break;
				}

				return (
					<div
						class={["cl-upload-space__file-item", `is-${fileType}`]}
						on-click={this.onSelect}
						on-contextmenu={this.onContextMenu}>
						{itemEl}

						<div class="cl-upload-space__file-size"></div>

						{selected && (
							<div class="cl-upload-space__file-mask">
								<i class="el-icon-success"></i>
							</div>
						)}
					</div>
				);
			}
		}
	},

	data() {
		return {
			visible: false,
			props: {
				title: "文件空间",
				props: {
					"close-on-click-modal": false,
					"append-to-body": true,
					width: "1000px"
				}
			},
			category: {
				list: [],
				current: {},
				keyword: ""
			},
			file: {
				list: [],
				pagination: {
					page: 1,
					size: 12,
					total: 0
				},
				loading: false
			}
		};
	},

	computed: {
		...mapGetters(["token"]),

		categoryList() {
			return this.category.list.filter(e => e.name.includes(this.category.keyword));
		},

		selection() {
			return this.file.list.filter(e => e.selected);
		}
	},

	filters: {
		file_name(url) {
			return last(url.split("."));
		}
	},

	created() {
		this.refreshCategory().then(() => {
			this.category.current = this.category.list[0];
			this.refreshFile();
		});
	},

	methods: {
		open(key) {
			this.visible = true;
		},

		close() {
			this.visible = false;

			this.$nextTick(() => {
				this.file.list.map(e => {
					this.$set(e, "selected", false);
				});
			});
		},

		// 上传成功
		onSuccess(res, file) {
			let item = this.file.list.find(e => file.uid == e.uid);

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

		// 上传前，添加文件
		beforeUpload({ tempFilePath, type, uid }) {
			this.file.list.unshift({
				url: tempFilePath,
				type,
				uid,
				classifyId: this.category.current.id,
				loading: true,
				progress: "0%"
			});
		},

		// 上传进度
		onProgress({ percent }, file) {
			let item = this.file.list.find(({ uid }) => uid == file.uid);

			if (item) {
				item.progress = percent + "%";
			}
		},

		// 刷新资源文件
		refreshFile(params) {
			this.file.loading = true;

			this.$service.space.info
				.page({
					...this.file.pagination,
					...params,
					classifyId: this.category.current.id,
					type: this.accept
				})
				.then(res => {
					this.file.pagination = res.pagination;
					this.file.list = res.list;
				})
				.done(() => {
					this.file.loading = false;
				});
		},

		// 刷新分类
		refreshCategory() {
			return this.$service.space.type.list().then(res => {
				res.unshift({
					name: "全部文件",
					id: null
				});
				this.category.list = res;
			});
		},

		// 编辑分类
		editCategory(item = {}) {
			this.$crud.openForm({
				title: "添加分类",
				width: "400px",
				items: [
					{
						label: "分类名称",
						prop: "name",
						value: item.name,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写分类名称"
							}
						},
						rules: {
							required: true,
							message: "分类名称不能为空"
						}
					}
				],
				on: {
					submit: (data, { done, close }) => {
						let next = null;

						if (!item.id) {
							next = this.$service.space.type.add(data);
						} else {
							next = this.$service.space.type.update({
								...data,
								id: item.id
							});
						}

						next.then(() => {
							this.refreshCategory();
							close();
						}).catch(err => {
							this.$message.error(err);
							done();
						});
					}
				}
			});
		},

		// 选择类目
		selectCategory(item) {
			this.category.current = item;
			this.file.pagination = {
				page: 1,
				size: 12,
				total: 0
			};
			this.refreshFile({
				classifyId: item.id
			});
		},

		// 打开类目列表右键菜单
		openCategoryContextMenu(e, { id, name }) {
			if (!id) {
				return false;
			}
			this.$crud.openContextMenu(e, {
				list: [
					{
						label: "编辑",
						"suffix-icon": "el-icon-edit",
						callback: (_, done) => {
							done();
							this.editCategory({ id, name });
						}
					},
					{
						label: "删除",
						"suffix-icon": "el-icon-delete",
						callback: (_, done) => {
							done();

							this.$confirm(`此操作将删除【${name}】下的文件, 是否继续?`, "提示", {
								type: "warning"
							})
								.then(() => {
									this.$service.space.type
										.delete({
											ids: id
										})
										.then(() => {
											this.$message.success("删除成功");
											this.refreshCategory();

											// 删除当前类目时，重置选择
											if (id == this.category.current.id) {
												this.category.current = this.category.list[0];
												this.refreshFile();
											}
										})
										.catch(err => {
											console.error(err);
											this.$message.error(err);
										});
								})
								.catch(() => {});
						}
					}
				]
			});
		},

		// 打开文件列表右键菜单
		openFileContextMenu(e, data) {
			this.$crud.openContextMenu(e, {
				list: [
					{
						label: data.selected ? "取消选中" : "选中",
						"suffix-icon": data.selected ? "el-icon-close" : "el-icon-check",
						callback: (_, done) => {
							this.selectFile(data);
							done();
						}
					},
					{
						label: "删除",
						"suffix-icon": "el-icon-delete",
						callback: (_, done) => {
							this.deleteFile(data);
							done();
						}
					}
				]
			});
		},

		// 确认选中文件
		confirmFile() {
			const selection = this.selection.filter((e, i) => i < this.limit);
			const urls = selection.map(e => e.url).join(",");

			this.$emit("input", urls);
			this.$emit("confirm", this.detailData ? selection : urls);

			this.close();
		},

		// 选择文件
		selectFile(item) {
			this.$set(item, "selected", !item.selected);
		},

		// 删除选中文件
		deleteFile(...selection) {
			if (isEmpty(selection)) {
				selection = this.selection;
			}

			this.$confirm("此操作将删除文件, 是否继续?", "提示", {
				type: "warning"
			})
				.then(() => {
					this.$message.success("删除成功");

					this.file.list = this.file.list.filter(
						e => !selection.map(e => e.id).includes(e.id)
					);

					this.$service.space.info
						.delete({
							ids: selection.map(e => e.id).join(",")
						})
						.catch(err => {
							this.$message.error(err);
						});
				})
				.catch(() => {});
		},

		// 选择页
		onCurrentChange(i) {
			this.refreshFile({
				page: i
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-upload-space {
	display: flex;
	min-height: 520px;

	&__category {
		width: 250px;
		margin-right: 20px;

		&-search {
			display: flex;
			align-items: center;
			margin-bottom: 5px;

			.el-button {
				margin-right: 10px;
			}
		}

		&-list {
			overflow: hidden auto;

			ul {
				li {
					list-style: none;
					font-size: 14px;
					height: 40px;
					line-height: 40px;
					border-bottom: 1px dashed #eee;
					padding: 0 5px;
					cursor: pointer;

					&.is-active {
						color: #409eff;
					}
				}
			}
		}
	}

	&__content {
		flex: 1;
	}

	&__opbar {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	&__file {
		height: calc(100% - 80px);
		overflow: hidden auto;
		margin-bottom: 10px;

		/deep/.cl-upload-space__file-item {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 160px;
			width: 160px;
			cursor: pointer;
			position: relative;
			border-radius: 3px;
			box-sizing: border-box;
			border: 1px solid #eee;
			margin: 5px 0;

			&.is-image {
				overflow: hidden;

				img {
					height: 100%;
					width: 100%;
				}
			}

			&.is-video {
				video {
					max-height: 100%;
					width: 100%;
				}
			}

			.cl-upload-space__file-size {
				position: absolute;
				bottom: 0;
				left: 0;
				background-color: rgba(0, 0, 0, 0.5);
			}

			.cl-upload-space__file-mask {
				position: absolute;
				left: 0;
				top: 0;
				height: 100%;
				width: 100%;
				background-color: rgba(0, 0, 0, 0.5);
				display: flex;
				justify-content: center;
				align-items: center;

				i {
					font-size: 30px;
					color: #67c23a;
				}
			}
		}

		&-empty {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 100px;

			& > div {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-radius: 6px;
				cursor: pointer;
				height: 180px;
				width: 360px;

				i {
					font-size: 67px;
					color: #c0c4cc;
				}
			}
		}
	}
}
</style>
