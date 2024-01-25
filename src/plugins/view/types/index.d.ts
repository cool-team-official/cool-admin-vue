import { TreeData } from "element-plus/es/components/tree/src/tree.type";
import Node from "element-plus/es/components/tree/src/model/node";

export declare namespace ClViewGroup {
	interface Item {
		id: any;
		name: string;
		[key: string]: any;
	}

	interface Ref {
		selected: Item | undefined;
		isExpand: boolean;
		select(data?: any): void;
		expand(value?: boolean): void;
		edit(item?: Item): void;
		remove(item: Item): void;
	}

	interface Options {
		label: string;
		title: string;
		leftWidth: string;
		data: {
			[key: string]: any;
		};
		tree: {
			lazy?: boolean;
			props?: {
				label?: string | ((node: Node, data: any) => string);
				children?: any;
				disabled?: string | ((node: Node, data: any) => string);
				isLeaf?: string | ((node: Node, data: any) => string);
				class?: any;
			};
			onLoad?(node: Node, resolve: (data: TreeData) => void): void;
		};
		service: {
			_permission: {
				[key: string]: boolean;
			};
			permission: {
				[key: string]: string;
			};
			page(data?: any): Promise<{
				list: any[];
				pagination: { page: number; size: number; total: number };
			}>;
			list(data?: any): Promise<any[]>;
			update(data: any): Promise<any>;
			add(data: any): Promise<any>;
			delete(data: any): Promise<any>;
			[key: string]: any;
		};
		enableContextMenu?: boolean;
		enableAdd?: boolean;
		enableRefresh?: boolean;
		onSelect?(item: Item): void;
		onEdit?(item?: Item): DeepPartial<ClForm.Options>;
		onContextMenu?(item: Item): ClContextMenu.Options;
		onData?(list: any[]): any[];
	}
}
