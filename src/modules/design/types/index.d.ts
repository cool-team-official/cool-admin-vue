export declare namespace Dp {
	interface DemoItem {
		label: string;
		name?: string;
		required?: boolean;
		getType?: "auto";
		component?: {
			name?: string;
			props?: {
				children?: any[];
				[key: string]: any;
			};
		};
		config?: {
			defs?: string[];
			tips?: string;
			disabled?: boolean;
			items?: ClForm.Item[];
			[key: string]: any;
		};
		group?: DemoItem[];
		[key: string]: any;
	}

	interface Provide {
		form: {
			[key: string]: any;
		};
		get(prop: string): any;
		getGroup(id: string): any;
		getData(): any[];
		toDet(item: any): void;
		setActive(id: string): void;
		add(data: any): void;
		remove(index: number): void;
		removeBy(options: { id?: string; index?: number }): void;
		clear(): boolean;
		hasTemp(): boolean;
		clearConfig(id?: string): void;
		saveDraft(): void;
		scrollToBottom(): void;
	}
}
