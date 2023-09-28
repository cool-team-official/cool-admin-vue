import { provide, ref } from "vue";
import { useParent } from "/@/cool";

export declare namespace ClViewGroup {
	interface Item {
		id: string;
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

export function useViewGroup(options?: DeepPartial<ClViewGroup.Options>) {
	const ViewGroup = ref<ClViewGroup.Ref>();
	useParent("cl-view-group", ViewGroup);

	if (options) {
		provide("useViewGroup__options", options);
	}

	return { ViewGroup };
}
