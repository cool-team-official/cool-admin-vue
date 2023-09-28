import { orderBy } from "lodash-es";
import { uuid } from "../utils";

const userList = [
	{
		id: "110000199206102819",
		name: "楚行云",
		createTime: "1996-09-14",
		wages: 73026,
		status: 1,
		account: "ihknssft",
		occupation: 4,
		phone: 13797353874
	},
	{
		id: "410000199208224044",
		name: "秦尘",
		createTime: "1977-11-09",
		wages: 74520,
		status: 0,
		account: "xlabchey",
		occupation: 3,
		phone: 18593911044
	},
	{
		id: "120000199708139664",
		name: "叶凡",
		createTime: "1982-11-28",
		wages: 81420,
		status: 0,
		account: "xpqbtkul",
		occupation: 1,
		phone: 16234136338
	},
	{
		id: "710000200203060278",
		name: "白小纯",
		createTime: "2012-12-17",
		wages: 65197,
		status: 1,
		account: "kirukkje",
		occupation: 2,
		phone: 16325661110
	},
	{
		id: "210000201007157714",
		name: "韩立",
		createTime: "1982-07-10",
		wages: 99107,
		status: 1,
		account: "rbrohvoj",
		occupation: 2,
		phone: 18486594866
	},
	{
		id: "420000200901038044",
		name: "唐三",
		createTime: "2019-07-31",
		wages: 80658,
		status: 1,
		account: "qtuwsfuh",
		occupation: 5,
		phone: 15565014642
	},
	{
		id: "150000197711136225",
		name: "王林",
		createTime: "2009-07-26",
		wages: 57408,
		status: 1,
		account: "gxyhlwdq",
		occupation: 1,
		phone: 13852767084
	},
	{
		id: "710000198106232170",
		name: "李强",
		createTime: "2016-04-26",
		wages: 71782,
		status: 1,
		account: "vruiimiy",
		occupation: 3,
		phone: 18365332834
	},
	{
		id: "530000199311309764",
		name: "秦羽",
		createTime: "1984-01-18",
		wages: 87860,
		status: 1,
		account: "dtvkpyag",
		occupation: 0,
		phone: 18149247129
	}
];

class TestService {
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
			}, 500);
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

export { TestService };
