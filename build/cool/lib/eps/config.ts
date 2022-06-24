export default {
	// 实体生成
	entity: {
		// 是否生成
		enable: true,
		mapping: [
			{
				// 自定义匹配
				custom: ({ entityName, propertyName, type }) => {
					// status原本是tinyint，如果是1的话，== true是可以的，但是不能 === true，请谨慎使用
					if (propertyName === "status" && type == "tinyint") return "boolean";
					// 如果没有，返回null或者不返回，则继续遍历其他匹配规则
					return null;
				}
			},
			{
				// 返回类型
				type: "string",
				// 匹配列类型
				includes: ["varchar", "text"]
			},
			{
				type: "Date",
				includes: ["datetime", "date"]
			},
			{
				type: "number",
				includes: ["tinyint", "int", "decimal"]
			},
			{
				type: "BigInt",
				includes: ["bigint"]
			}
		]
	}
};
