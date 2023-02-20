export default {
	entity: {
		mapping: [
			{
				// 自定义匹配
				custom: ({ entityName, propertyName, type }) => {
					// status 原本是tinyint，如果是1的话，== true 是可以的，但是不能 === true，请谨慎使用
					if (propertyName === "status" && type == "tinyint") return "boolean";
					// 如果没有，返回null或者不返回，则继续遍历其他匹配规则
					return null;
				}
			},
			{
				type: "string",
				test: ["varchar", "text","simple-json"]
			},
			{
				type: "string[]",
				test: ["simple-array"]
			},
			{
				type: "Date",
				test: ["datetime", "date"]
			},
			{
				type: "number",
				test: ["tinyint", "int", "decimal"]
			},
			{
				type: "BigInt",
				test: ["bigint"]
			}
		]
	}
};
