<template>
	<cl-upload
		:accept="accept"
		list-type
		:before-upload="onBeforeUpload"
		:on-progress="onUploadProgress"
		:on-success="onUploadSuccess"
	>
		<slot></slot>
	</cl-upload>
</template>

<script lang="ts">
import { ElFile } from "element-plus/lib/el-upload/src/upload.type";
import { defineComponent, inject } from "vue";
import { useStore } from "vuex";

export default defineComponent({
	props: {
		name: String,
		accept: String
	},

	emits: ["before-upload", "success"],

	setup(props, { emit }) {
		const store = useStore();
		const chat = inject<any>("chat");

		// 上传前
		function onBeforeUpload(file: ElFile) {
			// 先添加到列表中，等待上传
			function next(options = {}) {
				const data = {
					content: {
						[`${props.name}Url`]: ""
					},
					type: 0,
					uid: file.uid,
					loading: true,
					progress: "0%",
					contentType: chat.modes.indexOf(props.name),
					...options
				};

				emit("before-upload", data);
			}

			// 图片预览
			if (props.name == "image") {
				const fileReader = new FileReader();

				fileReader.onload = (e: any) => {
					const imageUrl = e.target.result;
					const image = new Image();

					image.onload = () => {
						let height = 0;
						let width = 0;

						if (image.width > 200) {
							width = 200;
							height = (image.height * 200) / image.width;
						}

						next({
							content: {
								imageUrl
							},
							style: {
								height: height + "px",
								width: width + "px"
							}
						});
					};

					image.src = imageUrl;
				};

				fileReader.readAsDataURL(file);
			} else {
				next();
			}
		}

		// 上传中
		function onUploadProgress(e: any, file: ElFile) {
			store.commit("UPDATE_MESSAGE", {
				file,
				data: {
					progress: e.percent + "%"
				}
			});
		}

		// 上传成功
		function onUploadSuccess(res: any, file: ElFile) {
			store.commit("UPDATE_MESSAGE", {
				file,
				data: {
					loading: false,
					content: {
						[`${props.name}Url`]: res.data
					}
				},
				callback: (data: any) => {
					emit("success", data);
				}
			});
		}

		return {
			onBeforeUpload,
			onUploadProgress,
			onUploadSuccess
		};
	}
});
</script>
