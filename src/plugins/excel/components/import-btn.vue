<template>
	<el-button :icon="icon" :disabled="disabled" :type="type" @click="open">导入</el-button>

	<cl-form ref="Form">
		<template #slot-upload>
			<div class="upload" v-if="!upload.filename">
				<div class="tips">
					<span>{{ tips }}</span>
					<el-button type="primary" text bg @click="download">下载模版</el-button>
				</div>

				<div class="inner">
					<cl-upload
						drag
						type="file"
						:limit-size="limitSize"
						:accept="accept"
						:disabled="disabled"
						:auto-upload="false"
						:before-upload="onUpload"
						:size="[220, '100%']"
					/>
				</div>
			</div>
		</template>

		<template #slot-list>
			<div class="data-table" v-if="list.length">
				<div class="head">
					<el-button type="success" @click="clear">重新上传</el-button>
					<el-button
						type="danger"
						:disabled="table.selection.length == 0"
						@click="table.del()"
						>批量删除</el-button
					>
				</div>

				<div class="cl-table">
					<el-table
						border
						small
						:data="list"
						max-height="600px"
						@selection-change="table.onSelectionChange"
						@row-click="
							(row) => {
								row._edit = true;
							}
						"
					>
						<el-table-column
							type="selection"
							width="60px"
							align="center"
							fixed="left"
						/>

						<el-table-column
							label="序号"
							type="index"
							width="80px"
							align="center"
							fixed="left"
							:index="table.onIndex"
						/>

						<el-table-column
							v-for="item in table.header"
							:key="item"
							:prop="item"
							:label="item"
							min-width="160px"
							align="center"
						>
							<template #default="scope">
								<span v-if="!scope.row._edit">{{ scope.row[item] }}</span>

								<template v-else>
									<el-input
										type="textarea"
										v-model="scope.row[item]"
										clearable
										:placeholder="item"
									/>
								</template>
							</template>
						</el-table-column>

						<el-table-column label="操作" width="100px" align="center" fixed="right">
							<template #default="scope">
								<el-button
									text
									bg
									type="danger"
									@click.stop="table.del(scope.$index)"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</el-table>
				</div>

				<div class="pagination">
					<el-pagination
						background
						layout="total, prev, pager, next"
						:total="upload.list.length"
						:page-size="pagination.size"
						v-model:current-page="pagination.page"
						@current-change="pagination.onCurrentChange"
					/>
				</div>
			</div>
		</template>
	</cl-form>
</template>

<script lang="ts" setup name="cl-import-btn">
import { useForm } from "@cool-vue/crud";
import { ElMessage } from "element-plus";
import { reactive, type PropType, computed } from "vue";
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
	file: null as File | null,
	list: [] as any[]
});

// 分页信息
const pagination = reactive({
	size: 20,
	page: 1,
	onCurrentChange(page: number) {
		pagination.page = page;
	}
});

// 数据表格
const table = reactive({
	// 表头
	header: [] as string[],

	// 选中列表
	selection: [] as any[],

	// 删除行
	del(index?: number) {
		if (index !== undefined) {
			upload.list.splice(index, 1);
		} else {
			upload.list = upload.list.filter((a) => {
				return !table.selection.includes(a._index);
			});
		}
	},

	// 序号
	onIndex(index: number) {
		return index + 1 + (pagination.page - 1) * pagination.size;
	},

	// 选中
	onSelectionChange(arr: any[]) {
		table.selection = arr.map((e) => e._index);
	}
});

// 数据列表
const list = computed(() => {
	return upload.list.filter((_, i) => {
		return (
			i >= (pagination.page - 1) * pagination.size && i < pagination.page * pagination.size
		);
	});
});

// 清空
function clear() {
	upload.filename = "";
	upload.file = null;
	upload.list = [];
	table.header = [];
	table.selection = [];
}

// 打开
function open() {
	clear();

	Form.value?.open({
		title: "导入",
		width: computed(() => (upload.filename ? "80%" : "800px")),
		dialog: {
			"close-on-press-escape": false
		},
		items: [
			...(props.onConfig ? props.onConfig(Form) : []),
			{
				prop: "file",
				component: {
					name: "slot-upload"
				}
			},
			{
				component: {
					name: "slot-list"
				}
			}
		],
		op: {
			saveButtonText: "提交"
		},
		on: {
			submit(_, { done, close }) {
				if (!upload.filename) {
					done();
					return ElMessage.error("请选择文件");
				}

				if (props.onSubmit) {
					props.onSubmit(upload, { done, close });
				} else {
					ElMessage.error("<cl-import-btn /> 未配置 onSubmit 参数");
					done();
				}
			}
		}
	});
}

// 上传
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

		upload.list = json.map((e, i) => {
			return {
				...e,
				_index: i
			};
		});
		upload.filename = raw.name;
		upload.file = raw;

		const sheet = workbook.Sheets[Object.keys(workbook.Sheets)[0]];

		for (let i in sheet) {
			if (i[0] === "!") continue;

			const row = i.match(/[0-9]+/)?.[0];

			if (row == "1") {
				table.header.push(sheet[i].v);
			}
		}

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

defineExpose({
	open,
	clear,
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

.data-table {
	.head {
		margin-bottom: 10px;
	}

	.pagination {
		display: flex;
		justify-content: flex-end;
		margin-top: 10px;
	}
}
</style>
