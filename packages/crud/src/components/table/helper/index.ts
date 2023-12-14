import { inject, reactive, ref } from "vue";
import { useConfig } from "../../../hooks";
import { getValue, mergeConfig } from "../../../utils";

export function useTable(props: any) {
	const { style } = useConfig();

	const Table = ref();

	// 配置
	const config = reactive<ClTable.Config>(mergeConfig(props, inject("useTable__options") || {}));

	// 列表项动态处理
	config.columns = (config.columns || []).map((e) => getValue(e));

	// 自动高度
	config.autoHeight = config.autoHeight ?? style.table.autoHeight;

	// 右键菜单
	config.contextMenu = config.contextMenu ?? style.table.contextMenu;

	return { Table, config };
}

export * from "./data";
export * from "./height";
export * from "./op";
export * from "./render";
export * from "./row";
export * from "./selection";
export * from "./sort";
export * from "./header";
