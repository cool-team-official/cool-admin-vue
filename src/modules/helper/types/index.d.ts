export declare interface EpsColumn {
	comment: string;
	length: number;
	nullable: boolean;
	propertyName: string;
	type: string;
	component: string;
}

export declare interface EpsApi {
	path: string;
	summary: string;
	method?: string;
	prefix?: string;
	tag?: string;
	dts?: {};
	[key: string]: any;
}

export declare interface EpsModule {
	api: EpsApi[];
	columns: EpsColumn[];
	prefix: string;
	router: string;
	module: string;
	[key: string]: any;
}

export declare interface EpsData {
	[key: string]: EpsModule[];
}

export declare type CodeType = "entity" | "controller" | "vue";

export declare interface PropRule {
	value?: string;
	test?: any[];
	group?: string[];
	table?: DeepPartial<ClTable.Column>;
	form?: ClForm.Item;
	handler?: string;
	[key: string]: any;
}
