export declare interface Entity {
	comment: string;
	length: number;
	nullable: boolean;
	propertyName: string;
	type: string;
}

export declare interface MenuData {
	api: { path: string; summary: string }[];
	columns: Entity[];
	prefix: string;
	router: string;
	module: string;
	[key: string]: any;
}
