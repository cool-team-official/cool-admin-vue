let id = 10;

export const UserList = [
	{
		id: 1,
		name: "刘一",
		createTime: "2019年09月02日",
		price: 75.99,
		status: 1,
		hook: "1,2",
		user: {
			name: "神仙"
		},
		t2: JSON.stringify({ name: "icssoa" }),
		tags: [1, 3]
	},
	{
		id: 2,
		name: "陈二",
		createTime: "2019年09月05日",
		price: 242.1,
		status: 1,
		tags: [2, 3]
	},
	{
		id: 3,
		name: "张三",
		createTime: "2019年09月12日",
		price: 74.11,
		status: 0,
		tags: [1, 2]
	},
	{
		id: 4,
		name: "李四",
		createTime: "2019年09月13日",
		price: 276.64,
		status: 0,
		tags: [1, 2, 3]
	},
	{
		id: 5,
		name: "王五",
		createTime: "2019年09月18日",
		price: 160.23,
		status: 1,
		tags: [2]
	}
];

export const TestService = {
	page: (p: any) => {
		console.log("POST[page]", p);

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

		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					list,
					pagination: {
						page: p.page,
						size: p.size,
						total
					}
				});
			}, 50);
		});
	},
	list: (p: any) => {
		console.log("POST[list]", p);

		return new Promise((resolve) => {
			resolve(UserList);
		});
	},
	info: (d: any) => {
		console.log("GET[info]", d);
		return new Promise((resolve) => {
			const user = UserList.find((e) => e.id == d.id);
			setTimeout(() => {
				resolve({
					...user,
					startTime: "2021-12-02 00:00:00",
					endTime: "2021-12-12 00:00:00",
					hook: "1,2",
					user: {
						name: user?.name
					}
				});
			}, 500);
		});
	},
	add: (d: any) => {
		console.log("POST[add]", d);
		UserList.push({
			...d,
			id: id++,
			createTime: new Date()
		});
		return Promise.resolve();
	},
	delete: (d: any) => {
		console.log("POST[delete]", d);

		return new Promise((resolve, reject) => {
			d.ids.forEach((id: any) => {
				const index = UserList.findIndex((e) => e.id == id);
				UserList.splice(index, 1);
			});

			setTimeout(() => {
				resolve(true);
			}, 1000);
		});
	},
	update: (d: any) => {
		console.log("POST[update]", d);
		const item = UserList.find((e) => e.id == d.id);
		if (item) {
			Object.assign(item, d);
		}
		return Promise.resolve();
	}
};
