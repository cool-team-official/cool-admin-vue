import { orderBy } from "lodash-es";
import { uuid } from "../utils";

const userList = [
	{
		id: 1,
		name: "楚行云",
		createTime: "1996-09-14",
		wages: 73026,
		status: 1,
		account: "chuxingyun",
		occupation: 4,
		phone: 13797353874
	},
	{
		id: 2,
		name: "秦尘",
		createTime: "1977-11-09",
		wages: 74520,
		status: 0,
		account: "qincheng",
		occupation: 3,
		phone: 18593911044
	},
	{
		id: 3,
		name: "叶凡",
		createTime: "1982-11-28",
		wages: 81420,
		status: 0,
		account: "yefan",
		occupation: 1,
		phone: 16234136338
	},
	{
		id: 4,
		name: "白小纯",
		createTime: "2012-12-17",
		wages: 65197,
		status: 1,
		account: "baixiaochun",
		occupation: 2,
		phone: 16325661110
	},
	{
		id: 5,
		name: "韩立",
		createTime: "1982-07-10",
		wages: 99107,
		status: 1,
		account: "hanli",
		occupation: 2,
		phone: 18486594866
	},
	{
		id: 6,
		name: "唐三",
		createTime: "2019-07-31",
		wages: 80658,
		status: 1,
		account: "tangsan",
		occupation: 5,
		phone: 15565014642
	},
	{
		id: 7,
		name: "王林",
		createTime: "2009-07-26",
		wages: 57408,
		status: 1,
		account: "wanglin",
		occupation: 1,
		phone: 13852767084
	},
	{
		id: 8,
		name: "李强",
		createTime: "2016-04-26",
		wages: 71782,
		status: 1,
		account: "liqiang",
		occupation: 3,
		phone: 18365332834
	},
	{
		id: 9,
		name: "秦羽",
		createTime: "1984-01-18",
		wages: 87860,
		status: 1,
		account: "qinyu",
		occupation: 0,
		phone: 18149247129
	}
];

class TestService {
	// 分页列表
	async page(params: any) {
		const { keyWord, page, size, sort, order } = params || {};

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
