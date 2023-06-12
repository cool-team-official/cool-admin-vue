import { defineComponent, h, ref, inject, reactive } from "vue";
import { useRow, useHeight, useRender, useSort, useData, useSelection, useOp } from "./helper";
import { useCore, useTools, useProxy, useElApi } from "../../hooks";
import { mergeConfig } from "../../utils";

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
		contextMenu: Array,
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
		const { getValue, style } = useTools();

		// 配置
		const config = reactive<ClTable.Config>(
			mergeConfig(props, inject("useTable__options") || {})
		);

		// 列表项动态处理
		config.columns = (config.columns || []).map((e) => getValue(e));

		// el-table
		const Table = ref();

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

		return () => {
			const { renderColumn, renderAppend, renderEmpty } = useRender();

			return (
				ctx.visible.value &&
				h(
					<el-table class="cl-table" ref={Table} v-loading={crud.loading} />,
					{
						maxHeight: ctx.isAuto.value ? ctx.maxHeight.value : null,
						height: ctx.isAuto.value ? config.height : null,
						defaultSort: ctx.defaultSort,
						rowKey: config.rowKey,
						size: style.size,
						border: true,
						highlightCurrentRow: true,
						data: ctx.data.value,
						onRowContextmenu: ctx.onRowContextMenu,
						onSelectionChange: ctx.onSelectionChange,
						onSortChange: ctx.onSortChange
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
