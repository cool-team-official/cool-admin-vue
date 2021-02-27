<template>
	<div class="cl-editor-quill">
		<div class="editor" :style="style"></div>

		<cl-upload-space
			ref="upload-space"
			detail-data
			:show-button="false"
			@confirm="onUploadSpaceConfirm"
		>
		</cl-upload-space>
	</div>
</template>

<script>
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default {
	name: "cl-editor-quill",

	props: {
		value: null,
		height: [String, Number],
		width: [String, Number],
		options: Object
	},

	data() {
		return {
			uploadURL: "",
			content: "",
			quill: null,
			cursorIndex: 0
		};
	},

	computed: {
		style() {
			let h = this.height;
			let w = this.width;

			if (!isNaN(Number(h))) {
				h += "px";
			}

			if (!isNaN(Number(w))) {
				h += "px";
			}

			return {
				height: h,
				width: w
			};
		}
	},

	watch: {
		value(val) {
			if (val) {
				if (val !== this.content) {
					this.setContent(val);
				}
			} else {
				this.setContent("");
			}
		},

		content(val) {
			this.$emit("input", val);
		}
	},

	mounted() {
		this.quill = new Quill(this.$el.querySelector(".editor"), {
			theme: "snow",
			placeholder: "输入内容",
			modules: {
				toolbar: [
					["bold", "italic", "underline", "strike"],
					["blockquote", "code-block"],
					[{ header: 1 }, { header: 2 }],
					[{ list: "ordered" }, { list: "bullet" }],
					[{ script: "sub" }, { script: "super" }],
					[{ indent: "-1" }, { indent: "+1" }],
					[{ direction: "rtl" }],
					[{ size: ["small", false, "large", "huge"] }],
					[{ header: [1, 2, 3, 4, 5, 6, false] }],
					[{ color: [] }, { background: [] }],
					[{ font: [] }],
					[{ align: [] }],
					["clean"],
					["link", "image"]
				]
			},
			...this.options
		});

		this.quill.getModule("toolbar").addHandler("image", this.uploadFileHandler);

		this.quill.on("text-change", () => {
			this.content = this.quill.root.innerHTML;
		});

		this.setContent(this.value);
		this.$emit("load", this.quill);
	},

	methods: {
		uploadFileHandler() {
			const selection = this.quill.getSelection();

			if (selection) {
				this.cursorIndex = selection.index;
			}

			this.$refs["upload-space"].open();
		},

		onUploadSpaceConfirm(files) {
			if (files.length > 0) {
				files.forEach((file, i) => {
					let [type] = file.type.split("/");

					this.quill.insertEmbed(
						this.cursorIndex + i,
						type,
						file.url,
						Quill.sources.USER
					);
				});
			}
		},

		setContent(val) {
			this.quill.root.innerHTML = val || "";
		}
	}
};
</script>

<style lang="scss">
.cl-editor-quill {
	background-color: #fff;

	.ql-snow {
		line-height: 22px !important;
	}

	.el-upload,
	#quill-upload-btn {
		display: none;
	}

	.ql-snow {
		border: 1px solid #dcdfe6;
	}

	.ql-snow .ql-tooltip[data-mode="link"]::before {
		content: "请输入链接地址:";
	}

	.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
		border-right: 0px;
		content: "保存";
		padding-right: 0px;
	}

	.ql-snow .ql-tooltip[data-mode="video"]::before {
		content: "请输入视频地址:";
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item::before {
		content: "14px";
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
		content: "10px";
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
		content: "18px";
	}

	.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
	.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
		content: "32px";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item::before {
		content: "文本";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
		content: "标题1";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
		content: "标题2";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
		content: "标题3";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
		content: "标题4";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
		content: "标题5";
	}

	.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
	.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
		content: "标题6";
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item::before {
		content: "标准字体";
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
		content: "衬线字体";
	}

	.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
	.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
		content: "等宽字体";
	}
}
</style>
