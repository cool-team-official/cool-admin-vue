export type Type = "app" | "admin";

export namespace Eps {
	interface Entity {
		api: {
			dts: {
				parameters?: {
					description: string;
					name: string;
					required: boolean;
					schema: {
						type: string;
					};
				}[];
			};
			name: string;
			method: string;
			path: string;
			prefix: string;
			summary: string;
			tag: string;
		}[];
		columns: {
			comment: string;
			length: string;
			nullable: boolean;
			propertyName: string;
			type: string;
		}[];
		module: string;
		name: string;
		prefix: string;
		[key: string]: any;
	}
}

export namespace Ctx {
	type Pages = {
		path?: string;
		style?: {
			[key: string]: any;
		};
		[key: string]: any;
	}[];

	type SubPackages = {
		root?: string;
		pages?: Ctx.Pages;
		[key: string]: any;
	}[];

	interface Data {
		appid?: string;
		pages?: Ctx.Pages;
		subPackages?: Ctx.SubPackages;
		modules?: string[];
		serviceLang: "Node" | "Java" | "Go" | "Python";
		[key: string]: any;
	}
}

export namespace Config {
	type Type = "app" | "admin";
	interface Eps {
		enable: boolean;
		api: "app" | "admin" | (string & {});
		dist: string;
		mapping: {
			type?: string;
			test?: string[];
			custom?(data: { propertyName: string; type: string }): any;
		}[];
	}
	interface Options {
		type: Config.Type;
		proxy: any;
		eps?: Partial<Config.Eps>;
		demo?: boolean;
	}
	interface Data {
		type: Config.Type;
		reqUrl: string;
		eps: Config.Eps;
		demo: boolean;
		[key: string]: any;
	}
}
