<template>
	<div class="cl-upload__wrap">
		<div
			class="cl-upload"
			:class="[
				`cl-upload--${listType}`,
				{
					'is-multiple': multiple,
					'is-drag': drag
				}
			]"
		>
			<el-input class="cl-upload__hidden" type="hidden"></el-input>

			<el-upload
				:action="action"
				:accept="_accept"
				:multiple="multiple"
				:limit="limit"
				:data="data"
				:name="_name"
				:drag="drag"
				:list-type="listType"
				:file-list="fileList"
				:show-file-list="_showFileList"
				:auto-upload="autoUpload"
				:disabled="disabled"
				:headers="{
					Authorization: token,
					...headers
				}"
				:http-request="action ? undefined : httpRequest"
				:on-remove="_onRemove"
				:on-preview="_onPreview"
				:on-progress="onProgress"
				:on-change="onChange"
				:on-exceed="onExceed"
				:before-upload="_beforeUpload"
				:before-remove="beforeRemove"
				:style="_style"
				v-loading="_loading"
			>
				<slot>
					<!-- 多图上传 -->
					<template v-if="listType == 'picture-card'">
						<i :class="['cl-upload__icon', _icon]"></i>
						<span class="cl-upload__text" v-if="_text">{{ _text }}</span>
					</template>

					<!-- 文件上传 -->
					<template v-else-if="listType == 'text'">
						<el-button size="mini" type="primary" :loading="loading"
							>点击上传</el-button
						>
					</template>

					<!-- 默认上传 -->
					<template v-else>
						<template v-if="_file">
							<div class="cl-upload__cover">
								<!-- 图片 -->
								<img v-if="_file.type == 'image'" :src="_file.url" />

								<!-- 文件名 -->
								<span v-else>{{ _file.name }}</span>
							</div>

							<!-- 功能按钮 -->
							<div class="cl-upload__actions">
								<span
									class="cl-upload__actions-preview"
									v-if="_file.type == 'image'"
									@click.stop="_onPreview(_file)"
								>
									<i class="el-icon-zoom-in"></i>
								</span>

								<span
									class="cl-upload__actions-delete"
									@click.stop="_onRemove(_file)"
								>
									<i class="el-icon-delete"></i>
								</span>
							</div>
						</template>

						<!-- 空态 -->
						<template v-else>
							<i :class="['cl-upload__icon', _icon]"></i>
							<span class="cl-upload__text" v-if="_text">{{ _text }}</span>
						</template>
					</template>
				</slot>
			</el-upload>
		</div>

		<cl-dialog
			title="图片预览"
			v-model="preview.visible"
			:props="{
				width: previewWidth
			}"
		>
			<img style="width: 100%" :src="preview.url" alt="" />
		</cl-dialog>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { last, isArray, isNumber, isBoolean, basename } from "@/core/utils";
import { v4 as uuidv4 } from "uuid";
import { clone } from "@/core/utils";

export default {
	name: "cl-upload",

	props: {
		modelValue: [Array, String],
		// 尺寸
		size: [Array, String, Number],
		// 显示图标
		icon: String,
		// 显示文案
		text: String,
		// 是否以 uuid 重命名
		rename: {
			type: Boolean,
			default: undefined
		},
		// 最大允许上传文件大小(MB)
		limitSize: Number,
		// 预览图片的宽度
		previewWidth: {
			type: String,
			default: "500px"
		},
		// 上传的地址
		action: {
			type: String,
			default: ""
		},
		// 设置上传的请求头部
		headers: Object,
		// 是否多选
		multiple: Boolean,
		// 上传时附带的额外参数
		data: Object,
		// 上传的文件字段名
		name: String,
		// 支持发送 cookie 凭证信息
		withCredentials: Boolean,
		// 是否显示已上传文件列表
		showFileList: {
			type: Boolean,
			default: undefined
		},
		// 是否拖拽
		drag: Boolean,
		// 上传的文件类型
		accept: String,
		// 文件列表的类型
		listType: {
			type: String,
			default: "default"
		},
		// 是否自带上传
		autoUpload: {
			type: Boolean,
			default: true
		},
		// 是否禁用
		disabled: Boolean,
		// 最大允许上传个数
		limit: Number,
		// 文件列表移除文件时的钩子
		onRemove: Function,
		// 点击文件列表中已上传的文件时的钩子
		onPreview: Function,
		// 文件上传成功时的钩子
		onSuccess: Function,
		// 文件上传失败时的钩子
		onError: Function,
		// 文件上传时的钩子
		onProgress: Function,
		// 文件状态改变时的钩子
		onChange: Function,
		// 文件超出个数限制时的钩子
		onExceed: Function,
		// 上传文件之前的钩子
		beforeUpload: Function,
		// 删除文件之前的钩子
		beforeRemove: Function
	},

	emits: ["update:modelValue", "change"],

	data() {
		return {
			fileList: [],
			urls: [],
			loading: false,
			preview: {
				visible: false,
				url: null
			}
		};
	},

	computed: {
		...mapGetters(["token", "modules"]),

		conf() {
			return this.modules.upload.options;
		},

		_size() {
			return this.size || this.conf.size || "128px";
		},

		_icon() {
			return this.icon || this.conf.icon || "el-icon-upload";
		},

		_text() {
			return this.text || this.conf.text || "选择文件";
		},

		_accept() {
			const d = this.accept || this.conf.accept;

			switch (this.listType) {
				case "picture-card":
					return d || "image/*";
				default:
					return d;
			}
		},

		_name() {
			return this.name || this.conf.name || "file";
		},

		_limitSize() {
			return this.limitSize || this.conf.limitSize || 10;
		},

		_rename() {
			return isBoolean(this.rename) ? this.rename : this.conf.rename;
		},

		_showFileList() {
			let f = null;

			switch (this.listType) {
				case "picture-card":
				case "text":
					f = true;
					break;
				default:
					f = false;
					break;
			}

			return this.showFileList === undefined ? f : this.showFileList;
		},

		_loading() {
			return this.listType == "default" ? this.loading : false;
		},

		_urls() {
			const format = {
				image: ["bmp", "jpg", "jpeg", "png", "tif", "gif", "svg"]
			};

			return this.urls
				.filter(e => Boolean(e.url))
				.map(e => {
					const arr = e.url.split(".");
					const suf = last(arr);
					e.type = format.image.includes(suf) ? "image" : null;
					return e;
				});
		},

		_file() {
			return this._urls[0];
		},

		_style() {
			let arr = [];

			if (isArray(this._size)) {
				arr = this._size;
			} else {
				arr = [this._size, this._size];
			}

			const [height, width] = arr.map(e => (isNumber(e) ? `${e}px` : e));

			if (this.listType == "default" && !this.drag) {
				return {
					height,
					width
				};
			} else {
				return {};
			}
		}
	},

	watch: {
		modelValue: {
			immediate: true,
			handler: "parseValue"
		}
	},

	methods: {
		// 解析参数
		parseValue(value) {
			let list = [];

			if (this.multiple) {
				if (value instanceof Array) {
					list = value;
				} else {
					list = (value || "").split(",");
				}
			} else {
				if (value) {
					list = [value];
				}
			}

			// 比较数据，避免重复动画
			if (
				!this.urls.some(e => {
					return list.includes(e.url);
				})
			) {
				this.fileList = list.filter(Boolean).map(url => {
					return {
						url,
						name: basename(url),
						uid: url
					};
				});

				// 设置 URLS
				this.urls = clone(this.fileList);
			}
		},

		// 更新值
		update() {
			const urls = this.urls
				.filter(e => Boolean(e.url))
				.map(e => e.url)
				.join(",");

			this.$emit("update:modelValue", urls);
			this.$emit("change", urls);
		},

		// 追加文件
		append(data) {
			if (this.multiple) {
				this.urls.push(data);
			} else {
				this.urls = [data];
			}

			this.update();
		},

		// 关闭上传加载中
		done() {
			this.loading = false;
		},

		// 删除文件
		_onRemove(file) {
			this.urls.splice(
				this.urls.findIndex(e => e.uid === file.uid),
				1
			);
			this.update();

			// 删除文件之前的钩子
			if (this.onRemove) {
				this.onRemove(file, this.urls);
			}
		},

		// 预览图片
		_onPreview(file) {
			this.preview.visible = true;
			this.preview.url = file.url;

			if (!file.url) {
				const item = this.urls.find(e => e.uid == file.uid);

				if (item) {
					this.preview.url = item.url;
				}
			}
		},

		// 上传前
		_beforeUpload(file) {
			this.loading = true;

			if (this._limitSize) {
				if (file.size / 1024 / 1024 >= this._limitSize) {
					this.$message.error(`上传文件大小不能超过 ${this._limitSize}MB!`);
					this.done();
					return false;
				}
			}

			if (this.beforeUpload) {
				return this.beforeUpload(file, {
					done: this.done
				});
			}

			return true;
		},

		// 上传成功
		_onSuccess(res, file) {
			this.loading = false;

			this.append({
				url: res.data,
				name: file.raw.name,
				uid: file.raw.uid
			});

			// 文件上传成功时的钩子
			if (this.onSuccess) {
				this.onSuccess(res, file.raw, this.urls);
			}
		},

		// 重设上传请求
		async httpRequest(req) {
			const mode = await this.uploadMode();

			// 多种上传请求
			const upload = file => {
				return new Promise((resolve, reject) => {
					const next = res => {
						const data = new FormData();

						for (const i in res) {
							if (i != "host") {
								data.append(i, res[i]);
							}
						}

						let fileName = file.name;

						// 是否以 uuid 重新命名
						if (this._rename) {
							fileName = uuidv4() + "." + last((file.name || "").split("."));
						}

						data.append("key", `app/${fileName}`);
						data.append("file", file);

						// 上传
						this.$service.common
							.request({
								url: res.host,
								method: "POST",
								headers: {
									"Content-Type": "multipart/form-data"
								},
								data,
								onUploadProgress: e => {
									if (this.onProgress) {
										e.percent = parseInt((e.loaded / e.total) * 100);
										this.onProgress(e, req.file);
									}
								}
							})
							.then(url => {
								if (mode === "local") {
									resolve(url);
								} else {
									resolve(`${res.host}/app/${fileName}`);
								}
							})
							.catch(err => {
								reject(err);
							});
					};

					if (mode == "local") {
						next({
							host: "/upload"
						});
					} else {
						this.$service.common
							.upload()
							.then(res => {
								next(res);
							})
							.catch(reject);
					}
				});
			};

			this.loading = true;

			upload(req.file)
				.then(url => {
					this._onSuccess({ data: url }, { raw: req.file });
				})
				.catch(err => {
					console.error("upload error", err);
					this.$message.error(err);

					// 	文件上传失败时的钩子
					if (this.onError) {
						this.onError(err, req.file);
					}
				})
				.done(() => {
					this.loading = false;
				});
		},

		// 上传模式
		uploadMode() {
			return this.$service.common.uploadMode().then(res => res.mode);
		}
	}
};
</script>

<style lang="scss">
.cl-upload {
	display: flex;
	flex-wrap: wrap;

	&__hidden {
		height: 0;
		width: 0;
	}

	&.is-multiple {
		.cl-upload__wrap {
			margin-right: 10px;
		}
	}

	&--default {
		&:not(.is-drag) {
			.el-upload {
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px dashed #d9d9d9;
				border-radius: 6px;
				cursor: pointer;
				position: relative;
				overflow: hidden;
				height: 100%;

				i {
					font-size: 28px;
					color: #8c939d;
				}

				.cl-upload__cover {
					position: relative;

					img {
						display: block;
						height: 100%;
						width: 100%;
					}
				}

				.cl-upload__actions {
					position: absolute;
					width: 100%;
					height: 100%;
					left: 0;
					top: 0;
					cursor: default;
					text-align: center;
					color: #fff;
					opacity: 0;
					font-size: 20px;
					background-color: rgba(0, 0, 0, 0.5);
					-webkit-transition: opacity 0.3s;
					transition: opacity 0.3s;

					&::after {
						display: inline-block;
						content: "";
						height: 100%;
						vertical-align: middle;
					}

					span {
						display: none;
						cursor: pointer;
					}

					span + span {
						margin-left: 15px;
					}

					i {
						color: #fff;
						font-size: 20px;
					}
				}

				&:hover {
					border-color: $color-primary;

					.cl-upload__actions {
						opacity: 1;

						span {
							display: inline-block;
						}
					}
				}
			}
		}
	}

	&--picture-card {
		.el-upload {
			background-color: #fff;

			.cl-upload__icon {
				position: relative;
				top: 4px;
			}
		}
	}

	&__icon + span {
		margin-left: 5px;
	}

	&__text {
		font-size: 14px;
	}
}
</style>
