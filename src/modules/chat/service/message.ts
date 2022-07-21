import { BaseService, Service } from "/@/cool";
import Mock from "mockjs";

@Service("chat/message")
class ChatMessage extends BaseService {
	page(): Promise<any> {
		return new Promise((resolve) => {
			const data = Mock.mock({
				"list|20": [
					{
						id: "@id",
						nickName: "@name",
						createTime: "@datetime(HH:mm:ss)",
						text: "@cparagraph(5)",
						"contentType|0-1": 0,
						"userId|1-2": 1,
						avatar() {
							return Mock.Random.image(
								"40x40",
								Mock.Random.color(),
								"#FFF",
								"png",
								this.nickName[0]
							);
						},
						content() {
							return JSON.stringify({
								text: this.text,
								imageUrl: Mock.Random.image(
									"100x100",
									Mock.Random.color(),
									"#FFF",
									"png",
									this.nickName
								)
							});
						}
					}
				]
			});

			setTimeout(() => {
				resolve({
					list: data.list,
					pagination: {
						total: 20,
						page: 1,
						size: 20
					}
				});
			}, 1000);
		});
	}
}

export default ChatMessage;
