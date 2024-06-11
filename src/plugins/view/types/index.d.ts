import { TreeData } from "element-plus/es/components/tree/src/tree.type";
import Node from "element-plus/es/components/tree/src/model/node";

export declare namespace ClViewGroup {
	interface Item {
		id: any;
		name: string;
		children: Item[];
		[key: string]: any;
	}

	type M<T> = T & Item;

	interface Ref<T = Item> {
		selected: M<T> | undefined;
		isExpand: boolean;
		select(data?: any): void;
		expand(value?: boolean): void;
		edit(item?: M<T>): void;
		remove(item: M<T>): void;
		refresh(params?: any): void;
	}

	interface Options<T = Item> {
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
		enableKeySearch?: boolean;
		custom?: boolean;
		onSelect?(item: M<T>): void;
		onEdit?(item?: M<T>): DeepPartial<ClForm.Options>;
		onContextMenu?(item: M<T>): ClContextMenu.Options;
		onData?(list: M<T>[]): any[];
		onDelete?(item: M<T>, { next }: { next(params: any): void }): Promise<void> | void;
	}
}
