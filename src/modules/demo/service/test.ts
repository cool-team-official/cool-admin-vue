import { Service } from "/@/cool";
import Mock from "mockjs";
import { uuid } from "/@/cool/utils";
import { orderBy } from "lodash-es";

interface User {
	id: string;
	name: string;
	wages: number;
	status: 0 | 1;
	occupation: number;
	avatar: string;
	phone: string;
	createTime: string;
}

// 模拟数据
const data = Mock.mock({
	"list|66": [
		{
			id: "@id",
			name: "@cname",
			createTime: "@datetime(yyyy-MM-dd)",
			"wages|50000-100000": 50000,
			"status|0-1": 0,
			account() {
				return Mock.Random.string("lower", 8);
			},
			occupation() {
				return Mock.Random.integer(0, 5);
			},
			avatar() {
				return Mock.Random.image("40x40", Mock.Random.color(), "#FFF", "png", this.name[0]);
			},
			phone() {
				return Mock.Random.integer(13000000000, 19999999999);
			}
		}
	]
});

const userList: User[] = data.list;

@Service("test")
class Test {
	// 分页列表
	async page(params: any) {
		const { keyWord, page, size, sort, order } = params || {};

		console.log("[test]", params);

		// 关键字查询
		const keyWordLikeFields = ["phone", "name"];

		// 等值查询
		const fieldEq = ["createTime", "occupation", "status"];

		// 模糊查询
		const likeFields = ["phone", "name"];

		// 过滤后的列表
		const list = orderBy(userList, order, sort).filter((e: any) => {
			let f = true;

			if (keyWord !== undefined) {
				f = !!keyWordLikeFields.find((k) => String(e[k]).includes(String(params.keyWord)));
			}

			fieldEq.forEach((k) => {
				if (f) {
					if (params[k] !== undefined) {
						f = e[k] == params[k];
					}
				}
			});

			likeFields.forEach((k) => {
				if (f) {
					if (params[k] !== undefined) {
						f = String(e[k]).includes(String(params[k]));
					}
				}
			});

			return f;
		});

		return new Promise((resolve) => {
			// 模拟延迟
			setTimeout(
				() => {
					resolve({
						list: list.slice((page - 1) * size, page * size),
						pagination: {
							total: list.length,
							page,
							size
						},
						subData: {
							wages: list.reduce((a, b) => {
								return a + b.wages;
							}, 0)
						}
					});
				},
				Mock.Random.integer(300, 600)
			);
		});
	}

	// 更新
	async update(params: { id: any; [key: string]: any }) {
		const item = userList.find((e) => e.id == params.id);

		if (item) {
			Object.assign(item, params);
		}
	}

	// 新增
	async add(params: any) {
		const id = uuid();

		userList.push({
			id,
			...params
		});

		return id;
	}

	// 详情
	async info(params: { id: any }) {
		const { id } = params || {};
		return userList.find((e) => e.id == id);
	}

	// 删除
	async delete(params: { ids: any[] }) {
		const { ids = [] } = params || {};

		ids.forEach((id) => {
			const index = userList.findIndex((e) => e.id == id);
			userList.splice(index, 1);
		});
	}

	// 全部列表
	async list() {
		return userList;
	}
}

export default Test;
