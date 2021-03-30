import { ContextMenuItem } from "./context-menu";
import { RenderOptions } from "./render";

export interface TableOptions {
	"context-menu"?:
		| boolean
		| Array<
				| ContextMenuItem
				| Function
				| "refresh"
				| "update"
				| "delete"
				| "order-desc"
				| "order-asc"
		  >;
}

export interface TableColumn {
	type?: "index" | "selection" | "expand" | "op";
	component?: RenderOptions;
	dict?: Array<{
		label: string;
		value?: any;
		type?: "primary" | "success" | "warning" | "info" | "danger";
	}>;
	buttons?: Array<"edit" | "delete" | string | RenderOptions>;
	align?: "left" | "center" | "right";
	label?: string;
	className?: string;
	prop?: string;
	width?: number;
	minWidth?: number | string;
	renderHeader?: Function;
	sortable?: boolean | string;
	sortMethod?: Function;
	sortBy?: string | Function | unknown[];
	resizable?: {
		type: boolean;
		default: true;
	};
	columnKey?: string;
	headerAlign?: string;
	showOverflowTooltip?: boolean;
	fixed?: boolean | string;
	formatter?: Function;
	selectable?: Function;
	reserveSelection?: boolean;
	filterMethod?: Function;
	filteredValue?: unknown[];
	filters?: unknown[];
	filterPlacement?: string;
	filterMultiple?: {
		type: boolean;
		default: true;
	};
	index?: number | Function;
	sortOrders?: unknown[];
}

export interface Table extends TableOptions {
	props?: {};
	columns: TableColumn[];
}
