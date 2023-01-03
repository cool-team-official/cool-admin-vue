const d: any = window;

// window 数据临时存储，解决热更新后失效问题
export const Data = {
	set(key: string, value: any) {
		d[`__${key}__`] = value;
	},

	get(key: string, value?: any) {
		if (value !== undefined && !d[`__${key}__`]) {
			d[`__${key}__`] = value;
		}
		return d[`__${key}__`];
	}
};
