// 解决热更新后失效问题;
const data = import.meta.hot?.data.getData?.() || {};

if (import.meta.hot) {
	import.meta.hot.data.getData = () => {
		return data;
	};
}

export const hmr = {
	data,

	setData(key: string, value: any) {
		data[key] = value;
	},

	getData(key: string, defaultValue?: any) {
		if (defaultValue !== undefined && !data[key]) {
			this.setData(key, defaultValue);
		}
		return data[key];
	}
};
