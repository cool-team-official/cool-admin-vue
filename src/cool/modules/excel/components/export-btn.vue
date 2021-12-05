<template>
	<el-button
		:size="size"
		:type="type"
		:plain="plain"
		:round="round"
		:circle="circle"
		:icon="icon"
		:loading="loading"
		:disabled="disabled"
		@click="toExport"
	>
		<slot>导出</slot>
	</el-button>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
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
			type: Array,
			required: true
		},
		data: [Function, Array],
		maxExportLimit: Number, // 最大导出条数，不传或者小于等于0为不限制
		size: {
			type: String,
			default: "mini"
		},
		disabled: Boolean,
		type: String,
		plain: Boolean,
		round: Boolean,
		circle: Boolean,
		icon: String
	},

	setup(props) {
		const loading = ref<boolean>(false);
		const crud = inject<any>("crud");

		async function getHeader(columns: any[], fields: any[]) {
			return (
				props.header || columns.filter((e) => fields.includes(e.prop)).map((e) => e.label)
			);
		}

		function getData() {
			if (typeof props.data === "function") {
				return props.data();
			} else {
				if (props.data) {
					return props.data;
				} else {
					return crud.service
						.page({
							...crud.paramsReplace(crud.params),
							maxExportLimit: props.maxExportLimit,
							isExport: true
						})
						.then((res: any) => {
							return res.list.map((e: any) => {
								for (const i in e) {
									const col: any = props.columns.find((c: any) => c.prop == i);

									if (col) {
										if (col.dict) {
											const d = col.dict.find((d: any) => d.value == e[i]);

											if (d) {
												e[i] = d.label;
											}
										}
									}
								}

								return e;
							});
						})
						.catch((err: string) => {
							console.error(err);
							return null;
						});
				}
			}
		}

		async function getFileName() {
			if (typeof props.filename === "function") {
				return await props?.filename();
			} else {
				const { year, month, day, hour, minu, sec } = currentDate();
				return props.filename || `报表（${year}-${month}-${day} ${hour}_${minu}_${sec}）`;
			}
		}

		async function toExport() {
			if (!props.columns) {
				return console.error("cl-export-btn.columns 不能为空！");
			}

			// 加载
			loading.value = true;

			// 表格列
			const columns = props.columns.filter(
				(e: any) =>
					!["selection", "expand", "index"].includes(e.type) &&
					!(e.filterExport || e["filter-export"])
			);

			// 字段
			const fields = columns.map((e: any) => e.prop).filter(Boolean);

			// 表头
			let header = await getHeader(columns, fields);

			// 数据
			let data = await getData();

			if (!data) {
				loading.value = false;
				return console.error("导出数据异常");
			}

			// 文件名
			let filename = await getFileName();

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

		return {
			loading,
			toExport
		};
	}
});
</script>
