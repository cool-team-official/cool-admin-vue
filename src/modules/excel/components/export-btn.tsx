import { defineComponent, PropType } from "vue";
import { useCrud } from "@cool-vue/crud";
import { ElMessage } from "element-plus";
import { isRef, ref } from "vue";
import { currentDate, export_json_to_excel } from "../utils";

export default defineComponent({
	name: "cl-export-btn",

	props: {
		filename: [Function, String],
		autoWidth: {
			type: Boolean,
			default: true
		},
		bookType: {
			type: String,
			default: "xlsx"
		},
		header: Array,
		columns: {
			type: Array as PropType<any[]>,
			required: true
		},
		data: [Function, Array],
		maxExportLimit: Number // 最大导出条数，不传或者小于等于0为不限制
	},

	setup(props) {
		// 加载状态
		const loading = ref(false);

		// crud
		const Crud = useCrud();

		// 获取表头数据
		async function getHeader(columns: any[], fields: any[]) {
			return columns.filter((e) => !e.hidden && fields.includes(e.prop)).map((e) => e.label);
		}

		// 获取表格数据
		function getData() {
			if (typeof props.data === "function") {
				return props.data();
			} else {
				if (props.data) {
					return props.data;
				} else {
					return Crud.value?.service
						.page({
							...Crud.value?.paramsReplace(Crud.value.params),
							maxExportLimit: props.maxExportLimit,
							isExport: true
						})
						.then((res) => {
							return res.list.map((e) => {
								for (const i in e) {
									const col = props.columns.find((c) => c.prop == i);

									if (col) {
										if (col.formatter) {
											e = col.formatter(e);
										}

										if (col.dict) {
											const d = (
												isRef(col.dict) ? col.dict.value : col.dict
											).find((d: any) => d.value == e[i]);

											if (d) {
												e[i] = d.label;
											}
										}
									}
								}

								return e;
							});
						})
						.catch((err) => {
							ElMessage.error(err.message);
							return null;
						});
				}
			}
		}

		// 获取文件名
		async function getFileName() {
			if (typeof props.filename === "function") {
				return await props?.filename();
			} else {
				const { year, month, day, hour, minu, sec } = currentDate();
				return props.filename || `报表（${year}-${month}-${day} ${hour}_${minu}_${sec}）`;
			}
		}

		// 导出
		async function toExport() {
			if (!props.columns) {
				return console.error("columns is required");
			}

			// 加载
			loading.value = true;

			// 表格列
			const columns = props.columns.filter(
				(e: any) =>
					!(
						e.hidden === true ||
						["selection", "expand", "index"].includes(e.type) ||
						e.filterExport ||
						e["filter-export"]
					)
			);

			// 字段
			const fields = columns.map((e: any) => e.prop).filter(Boolean);

			// 表头
			const header = await getHeader(columns, fields);

			// 数据
			let data = await getData();

			if (!data) {
				loading.value = false;
				return console.error("导出数据异常");
			}

			// 文件名
			const filename = await getFileName();

			// 过滤
			data = data.map((d: any) => fields.map((f) => d[f]));

			// 导出 excel
			export_json_to_excel({
				header,
				data,
				filename,
				autoWidth: props.autoWidth,
				bookType: props.bookType
			});

			loading.value = false;
		}

		return () => {
			return (
				<el-button loading={loading.value} onClick={toExport}>
					<slot>导出</slot>
				</el-button>
			);
		};
	}
});
