import { BaseService, Service } from "/@/cool";
import Mock from "mockjs";

@Service("im/session")
class ImSession extends BaseService {
	page() {
		return new Promise((resolve) => {
			const data = Mock.mock({
				"list|20": [
					{
						id: "@id",
						nickName: "@name",
						createTime: "@datetime(HH:mm:ss)",
						text: "@cparagraph(5)",
						"num|0-99": 0,
						avatar() {
							return Mock.Random.image(
								"40x40",
								Mock.Random.color(),
								"#FFF",
								"png",
								this.nickName[0]
							);
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

export default ImSession;
