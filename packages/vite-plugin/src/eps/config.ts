import { join } from "path";

// 打包目录
export const DistDir = join(__dirname, "../");

// 实体描述
export const Entity = {
	mapping: [
		// {
		// 	// 自定义匹配
		// 	custom: ({ propertyName, type }) => {
		// 		// 如果没有，返回null或者不返回，则继续遍历其他匹配规则
		// 		return null;
		// 	},
		// },
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
};
