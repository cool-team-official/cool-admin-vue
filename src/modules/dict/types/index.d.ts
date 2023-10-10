export namespace Dict {
	interface Item {
		id: string;
		label: string;
		value: any;
		children?: Item[];
		[key: string]: any;
	}

	interface Data {
		[key: string]: Item[];
	}
}
