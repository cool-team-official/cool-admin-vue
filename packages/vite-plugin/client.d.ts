declare module "virtual:ctx" {
	const ctx: {
		serviceLang: string;
		modules: string[];
	};

	export { ctx };
}

declare module "virtual:eps" {
	const eps: {
		list: any[];
		service: any;
	};

	export { eps };
}

declare module "virtual:demo";
declare module "virtual:svg-register";

declare module "virtual:svg-icons" {
	const svgIcons: string[];
	export { svgIcons };
}
