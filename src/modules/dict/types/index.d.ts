export namespace Dict {
	type List = {
		id: string;
		label: string;
		value: any;
		[key: string]: any;
	}[];

	interface Data {
		[key: string]: List;
	}
}
