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
		const { status, occupation, keyWord, page, size, phone, name, sort, order } = params || {};

		// 过滤后的列表
		const list = orderBy(userList, order, sort).filter((e) => {
			if (status !== undefined) {
				return e.status == status;
			}

			if (phone !== undefined) {
				return String(e.phone).includes(phone);
			}

			if (name !== undefined) {
				return e.name.includes(name);
			}

			if (keyWord !== undefined) {
				return e.name.includes(keyWord) || String(e.phone).includes(keyWord);
			}

			if (occupation !== undefined) {
				return e.occupation == occupation;
			}

			return true;
		});

		return new Promise((resolve) => {
			// 模拟延迟
			setTimeout(() => {
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
			}, Mock.Random.integer(300, 600));
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
