import { defineComponent, h } from "vue";
import {
	useRow,
	useHeight,
	useRender,
	useSort,
	useData,
	useSelection,
	useOp,
	useTable
} from "./helper";
import { useCore, useProxy, useElApi, useConfig } from "../../hooks";
import { usePlugins } from "./helper/plugins";

export default defineComponent({
	name: "cl-table",

	props: {
		// 列配置
		columns: {
			type: Array,
			default: () => []
		},
		// 是否自动计算高度
		autoHeight: {
			type: Boolean,
			default: null
		},
		// 固定高度
		height: null,
		// 右键菜单
		contextMenu: {
			type: [Array, Boolean],
			default: null
		},
		// 默认排序
		defaultSort: Object,
		// 排序后是否刷新
		sortRefresh: {
			type: Boolean,
			default: true
		},
		// 空数据显示文案
		emptyText: String,
		// 当前行的 key
		rowKey: {
			type: String,
			default: "id"
		}
	},

	emits: ["selection-change", "sort-change"],

	setup(props, { emit, expose }) {
		const { crud } = useCore();
		const { style } = useConfig();
		const { Table, config } = useTable(props);
		const plugin = usePlugins();

		// 排序
		const Sort = useSort({ config, emit, Table });

		// 行
		const Row = useRow({
			config,
			Table,
			Sort
		});

		// 高度
		const Height = useHeight({ config, Table });

		// 数据
		const Data = useData({ config, Table });

		// 多选
		const Selection = useSelection({ emit });

		// 操作
		const Op = useOp({ config });

		// 方法
		const ElTableApi = useElApi(
			[
				"clearSelection",
				"getSelectionRows",
				"toggleRowSelection",
				"toggleAllSelection",
				"toggleRowExpansion",
				"setCurrentRow",
				"clearSort",
				"clearFilter",
				"doLayout",
				"sort",
				"scrollTo",
				"setScrollTop",
				"setScrollLeft"
			],
			Table
		);

		const ctx = {
			Table,
			columns: config.columns,
			...Selection,
			...Data,
			...Sort,
			...Row,
			...Height,
			...Op,
			...ElTableApi
		};

		useProxy(ctx);
		expose(ctx);
		plugin.create(config.plugins);

		return () => {
			const { renderColumn, renderAppend, renderEmpty } = useRender();

			return (
				ctx.visible.value &&
				h(
					<el-table class="cl-table" ref={Table} v-loading={crud.loading} />,
					{
						// config
						maxHeight: config.autoHeight ? ctx.maxHeight.value : null,
						height: config.autoHeight ? config.height : null,
						rowKey: config.rowKey,

						// ctx
						defaultSort: ctx.defaultSort,
						data: ctx.data.value,
						onRowContextmenu: ctx.onRowContextMenu,
						onSelectionChange: ctx.onSelectionChange,
						onSortChange: ctx.onSortChange,

						// style
						size: style.size,
						border: style.table.border,
						highlightCurrentRow: style.table.highlightCurrentRow,
						resizable: style.table.resizable,
						stripe: style.table.stripe
					},
					{
						default() {
							return renderColumn(ctx.columns);
						},
						empty() {
							return renderEmpty(config.emptyText || crud.dict.label.empty);
						},
						append() {
							return renderAppend();
						}
					}
				)
			);
		};
	}
});
