import dayjs from "dayjs";

let id = 10;

export const UserList = [
	{
		id: 1,
		name: "刘一",
		createTime: "2019年09月02日",
		price: 75.99,
		status: 1
	},
	{
		id: 2,
		name: "陈二",
		createTime: "2019年09月05日",
		price: 242.1,
		status: 1
	},
	{
		id: 3,
		name: "张三",
		createTime: "2019年09月12日",
		price: 74.11,
		status: 0
	},
	{
		id: 4,
		name: "李四",
		createTime: "2019年09月13日",
		price: 276.64,
		status: 0
	},
	{
		id: 5,
		name: "王五",
		createTime: "2019年09月18日",
		price: 160.23,
		status: 1
	}
];

export const TestService = {
	page: (p: any) => {
		console.log("GET[page]", p);

		let total = 0;

		const list = UserList.filter((e, i) => {
			if (p.name) {
				return e.name.includes(p.name);
			}

			if (![undefined, null, ""].includes(p.status)) {
				return e.status === p.status;
			}

			total++;

			if (i >= (p.page - 1) * p.size && i < p.page * p.size) {
				return true;
			} else {
				return false;
			}
		});

		return Promise.resolve({
			list,
			pagination: {
				page: p.page,
				size: p.size,
				total
			}
		});
	},
	info: (d: any) => {
		console.log("GET[info]", d);
		return new Promise(resolve => {
			resolve(UserList.find(e => e.id == d.id));
		});
	},
	add: (d: any) => {
		console.log("POST[add]", d);
		UserList.push({
			...d,
			id: id++,
			createTime: dayjs().format("YYYY年MM月DD日")
		});
		return Promise.resolve();
	},
	delete: (d: any) => {
		console.log("POST[delete]", d);
		const ids = d.ids.split(",");
		ids.forEach((id: any) => {
			const index = UserList.findIndex(e => e.id == id);
			UserList.splice(index, 1);
		});
		return Promise.resolve();
	},
	update: (d: any) => {
		console.log("POST[update]", d);
		const item = UserList.find(e => e.id == d.id);
		Object.assign(item, d);
		return Promise.resolve();
	}
};
