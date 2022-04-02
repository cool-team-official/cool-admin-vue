// @ts-nocheck

const module = {
	set(list: any[]) {
		window.__modules__ = list;
	},

	get(name: string) {
		return name ? window.__modules__.find((e) => e.name == name) : window.__modules__;
	}
};

export default module;
