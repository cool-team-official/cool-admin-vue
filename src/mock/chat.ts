import Mock from "mockjs";

Mock.mock("/im/session/page", "post", (options: any) => {
	const { keyWord = "" } = JSON.parse(options.body);

	const data = Mock.mock({
		"list|20": [
			{
				id: "@id",
				nickname: "@name",
				createTime: "@datetime(yy-MM-dd HH:mm:ss)",
				text: "@cparagraph(5)",
				content() {
					return JSON.stringify({ text: this.text });
				},
				"contentType|0-3": 0,
				"serviceUnreadCount|0-10": 0,
				headimgurl() {
					return Mock.Random.image(
						"40x40",
						Mock.Random.color(),
						"#FFF",
						"png",
						this.nickname[0]
					);
				}
			}
		]
	});

	return {
		code: 1000,
		data: {
			list: data.list.filter((e: any) => e.nickname.includes(keyWord)),
			pagination: {}
		}
	};
});

Mock.mock("/im/session/unreadCount", "get", () => {
	const data = Mock.mock({
		"count|1-50": 1
	});

	return {
		code: 1000,
		data: data.count
	};
});

Mock.setup({
	timeout: "500-1000"
});

Mock.mock("/im/message/page", "post", () => {
	const data = Mock.mock({
		"list|20": [
			{
				id: "@id",
				nickname: "@name",
				createTime: "@datetime",
				text: "@cparagraph(1, 4)",
				content() {
					return JSON.stringify({ text: this.text });
				},
				contentType: 0,
				"type|0-1": 1
			}
		]
	});

	return {
		code: 1000,
		data: {
			list: data.list,
			pagination: {}
		}
	};
});
