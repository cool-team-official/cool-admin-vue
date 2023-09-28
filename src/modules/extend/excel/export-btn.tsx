import { defineComponent, PropType } from "vue";
import { useCrud, useForm } from "@cool-vue/crud";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { isEmpty, orderBy } from "lodash-es";
import { ref } from "vue";
import { export_json_to_excel } from "./utils";
import { deepFind } from "/$/dict/utils";

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
			type: Array as PropType<ClTable.Column[]>
		},
		data: [Function, Array],
		maxExportLimit: Number // 最大导出条数，不传或者小于等于0为不限制
	},

	setup(props, { slots }) {
		// crud
		const Crud = useCrud();

		// 表单
		const Form = useForm();

		// 加载状态
		const loading = ref(false);

		// 获取表头数据
		async function getHeader(columns: any[], fields: any[]) {
			return columns.filter((e) => !e.hidden && fields.includes(e.prop)).map((e) => e.label);
		}

		// 获取表格数据
		async function getData(): Promise<any[]> {
			const params = {
				...Crud.value?.paramsReplace(Crud.value.params),
				maxExportLimit: props.maxExportLimit,
				isExport: true
			};

			if (typeof props.data === "function") {
				return props.data(params);
			} else {
				if (props.data) {
					return props.data;
				} else {
					if (Crud.value?.service) {
						return Crud.value?.service
							.page(params)
							.then((res) => {
								return res.list.map((e, i) => {
									for (const k in e) {
										const col = props.columns?.find((c) => c.prop == k);

										if (col) {
											// 格式化
											if (col.formatter) {
												e[k] = col.formatter(e, col, e[k], i);
											}

											// 字典
											if (col.dict) {
												e[k] = deepFind(e[k], col.dict)?.label || e[k];
											}
										}
									}

									return e;
								});
							})
							.catch((err) => {
								ElMessage.error(err.message);
								return [];
							});
					} else {
						console.error("Crud 中未配置 service 参数");
						return [];
					}
				}
			}
		}

		// 获取文件名
		async function getFileName() {
			if (typeof props.filename === "function") {
				return await props?.filename();
			} else {
				return props.filename || `报表（${dayjs().format("YYYY-MM-DD HH_mm_ss")}）`;
			}
		}

		// 导出
		async function toExport(columns: ClTable.Column[]) {
			// 加载
			loading.value = true;

			// 字段
			const fields = columns.map((e) => e.prop).filter(Boolean);

			// 表头
			const header = await getHeader(columns, fields);

			// 数据
			let data = await getData();

			if (!data) {
				loading.value = false;
				return ElMessage.error("导出数据异常");
			}

			// 文件名
			const filename = await getFileName();

			// 过滤
			data = data.map((d) => fields.map((f) => d[f]));

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

		function open() {
			if (!props.columns) {
				return console.error("columns is required");
			}

			// 表格列
			const columns = orderBy(props.columns, "orderNum", "asc").filter(
				(e) =>
					!(
						e.hidden === true ||
						["selection", "expand", "index", "op"].includes(e.type) ||
						e.filterExport ||
						e["filter-export"]
					)
			);

			Form.value?.open({
				title: "导出",
				width: "600px",
				props: {
					labelPosition: "top"
				},
				form: {
					checked: columns.map((e) => e.prop)
				},
				items: [
					{
						label: "选择列",
						prop: "checked",
						component: {
							name: "el-checkbox-group",
							options: columns.map((e) => {
								return {
									label: String(e.label),
									value: e.prop
								};
							})
						}
					}
				],
				on: {
					submit(data, { close, done }) {
						if (isEmpty(data.checked)) {
							ElMessage.warning("请先选择要导出的列");
							done();
						} else {
							toExport(columns.filter((e) => data.checked.includes(e.prop)));
							close();
						}
					}
				}
			});
		}

		return () => {
			return (
				<el-button loading={loading.value} onClick={open}>
					{slots.default ? slots.default() : "导出"}

					<cl-form ref={Form} />
				</el-button>
			);
		};
	}
});
