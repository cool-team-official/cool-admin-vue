<template>
	<el-button :icon="icon" :disabled="disabled" :type="type" @click="open">导入</el-button>

	<cl-form ref="Form">
		<template #slot-upload>
			<div class="upload">
				<div class="tips">
					<span>{{ tips }}</span>
					<el-button type="primary" text bg @click="download">下载模版</el-button>
				</div>

				<div class="inner">
					<cl-upload
						drag
						:limit-size="limitSize"
						:accept="accept"
						:disabled="disabled"
						type="file"
						:before-upload="onUpload"
						:size="[220, '100%']"
					/>
				</div>

				<div class="progress" v-if="progress > 0">
					<el-progress type="dashboard" :percentage="progress" />
				</div>
			</div>
		</template>
	</cl-form>
</template>

<script lang="ts" setup name="cl-import-btn">
import { useForm } from "@cool-vue/crud";
import { ElMessage } from "element-plus";
import { reactive, ref, PropType } from "vue";
import * as XLSX from "xlsx";
import chardet from "chardet";
import { extname } from "/@/cool/utils";

const props = defineProps({
	onConfig: Function,
	onSubmit: Function,
	template: {
		type: String,
		default: ""
	},
	tips: {
		type: String,
		default: "请按照模版填写信息"
	},
	limitSize: {
		type: Number,
		default: 10
	},
	type: {
		type: String as PropType<
			"default" | "success" | "warning" | "info" | "text" | "primary" | "danger"
		>,
		default: "success"
	},
	icon: String,
	disabled: Boolean,
	accept: {
		type: String,
		default:
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel,text/csv"
	}
});

const emit = defineEmits(["change"]);

const Form = useForm();

// 上传信息
const upload = reactive({
	filename: "",
	data: [] as any[]
});

// 进度
const progress = ref(0);

// 清空
function clear() {
	progress.value = 0;
	upload.filename = "";
	upload.data = [];
}

// 打开
function open() {
	clear();

	Form.value?.open({
		title: "导入",
		width: "800px",
		dialog: {
			"close-on-press-escape": false
		},
		items: [
			...(props.onConfig ? props.onConfig(Form) : []),
			{
				label: "",
				prop: "file",
				props: {
					labelWidth: "0"
				},
				component: {
					name: "slot-upload"
				}
			}
		],
		op: {
			saveButtonText: "提交"
		},
		on: {
			submit(data, { done, close }) {
				if (!upload.filename) {
					done();
					return ElMessage.error("请选择文件");
				}

				if (props.onSubmit) {
					props.onSubmit(
						{
							...data,
							list: upload.data
						},
						{ done, close, setProgress }
					);
				} else {
					console.error("cl-import-btn 未配置 onSubmit");
				}
			}
		}
	});
}

function onUpload(raw: File, _: any, { next }: any) {
	const reader = new FileReader();
	const ext = extname(raw.name);

	reader.onload = (event: any) => {
		let data = "";

		if (ext == "csv") {
			const detected: any = chardet.detect(new Uint8Array(event.target.result));
			const decoder = new TextDecoder(detected);
			data = decoder.decode(event.target.result);
		} else {
			data = event.target.result;
		}

		const workbook = XLSX.read(data, { type: "binary", raw: ext == "csv" });

		let json: any[] = [];
		for (const sheet in workbook.Sheets) {
			if (workbook.Sheets.hasOwnProperty(sheet)) {
				json = json.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
			}
		}

		upload.data = json;
		upload.filename = raw.name;

		emit("change", json);
	};

	if (ext == "csv") {
		reader.readAsArrayBuffer(raw);
	} else {
		reader.readAsBinaryString(raw);
	}

	next();

	return false;
}

// 下载模版
function download() {
	const link = document.createElement("a");
	link.setAttribute("href", props.template);
	link.setAttribute("download", "");
	link.click();
}

// 设置进度值
function setProgress(val: string) {
	progress.value = parseInt(val);
}

defineExpose({
	open,
	clear,
	setProgress,
	Form
});
</script>

<style lang="scss" scoped>
.upload {
	display: flex;
	flex-direction: column;

	.inner {
		width: 100%;

		:deep(.cl-upload) {
			.cl-upload__footer,
			.cl-upload__list,
			.el-upload,
			.is-drag {
				width: 100% !important;
			}
		}
	}
}

.tips {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;

	& > span {
		color: var(--el-color-warning);
	}
}

.progress {
	margin-top: 20px;
	display: flex;
	justify-content: center;
}
</style>
