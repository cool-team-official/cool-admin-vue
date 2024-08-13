import type { Config } from "../types";

export const config: Config.Data = {
	type: "admin",
	reqUrl: "",
	demo: false,
	eps: {
		enable: true,
		api: "",
		dist: "./build/cool",
		mapping: [
			{
				// 自定义匹配
				custom: ({ propertyName, type }) => {
					// 如果没有，返回null或者不返回，则继续遍历其他匹配规则
					return null;
				},
			},
			{
				type: "string",
				test: ["varchar", "text", "simple-json"],
			},
			{
				type: "string[]",
				test: ["simple-array"],
			},
			{
				type: "Date",
				test: ["datetime", "date"],
			},
			{
				type: "number",
				test: ["tinyint", "int", "decimal"],
			},
			{
				type: "BigInt",
				test: ["bigint"],
			},
		],
	},
};
