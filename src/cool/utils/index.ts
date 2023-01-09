import { isArray, isNumber, isString, orderBy } from "lodash-es";
import { resolveComponent } from "vue";
import storage from "./storage";

// 首字母大写
export function firstUpperCase(value: string): string {
	return value.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
		return $1.toUpperCase() + $2;
	});
}

// 获取方法名
export function getNames(value: any) {
	return Object.getOwnPropertyNames(value.constructor.prototype);
}

// 深度合并
export function deepMerge(a: any, b: any) {
	let k;
	for (k in b) {
		a[k] =
			a[k] && a[k].toString() === "[object Object]" ? deepMerge(a[k], b[k]) : (a[k] = b[k]);
	}
	return a;
}

// 获取地址栏参数
export function getUrlParam(name: string): string | null {
	const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	const r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
}

// 路径转数组
export function deepPaths(paths: string[], splitor?: string) {
	const list: any[] = [];

	paths.forEach((e) => {
		const arr: string[] = e.split(splitor || "/").filter(Boolean);

		let c = list;

		arr.forEach((a, i) => {
			let d = c.find((e) => e.label == a);

			if (!d) {
				d = {
					label: a,
					value: a,
					children: arr[i + 1] ? [] : null
				};

				c.push(d);
			}

			if (d.children) {
				c = d.children;
			}
		});
	});

	return list;
}

// 文件名
export function filename(path: string): string {
	return basename(path.substring(0, path.lastIndexOf(".")));
}

// 路径名称
export function basename(path: string): string {
	let index = path.lastIndexOf("/");
	index = index > -1 ? index : path.lastIndexOf("\\");
	if (index < 0) {
		return path;
	}
	return path.substring(index + 1);
}

// 文件扩展名
export function extname(path: string): string {
	return path.substring(path.lastIndexOf(".") + 1);
}

// 横杠转驼峰
export function toCamel(str: string): string {
	return str.replace(/([^-])(?:-+([^-]))/g, function ($0, $1, $2) {
		return $1 + $2.toUpperCase();
	});
}

// uuid
export function uuid(): string {
	const s: any[] = [];
	const hexDigits = "0123456789abcdef";
	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
	s[8] = s[13] = s[18] = s[23] = "-";

	return s.join("");
}

// 浏览器信息
export function getBrowser() {
	const { clientHeight, clientWidth } = document.documentElement;

	// 浏览器信息
	const ua = navigator.userAgent.toLowerCase();

	// 浏览器类型
	let type = (ua.match(/firefox|chrome|safari|opera/g) || "other")[0];

	if ((ua.match(/msie|trident/g) || [])[0]) {
		type = "msie";
	}

	// 平台标签
	let tag = "";

	const isTocuh =
		"ontouchstart" in window || ua.indexOf("touch") !== -1 || ua.indexOf("mobile") !== -1;
	if (isTocuh) {
		if (ua.indexOf("ipad") !== -1) {
			tag = "pad";
		} else if (ua.indexOf("mobile") !== -1) {
			tag = "mobile";
		} else if (ua.indexOf("android") !== -1) {
			tag = "androidPad";
		} else {
			tag = "pc";
		}
	} else {
		tag = "pc";
	}

	// 浏览器内核
	let prefix = "";

	switch (type) {
		case "chrome":
		case "safari":
		case "mobile":
			prefix = "webkit";
			break;
		case "msie":
			prefix = "ms";
			break;
		case "firefox":
			prefix = "Moz";
			break;
		case "opera":
			prefix = "O";
			break;
		default:
			prefix = "webkit";
			break;
	}

	// 操作平台
	const plat = ua.indexOf("android") > 0 ? "android" : navigator.platform.toLowerCase();

	// 屏幕信息
	let screen = "full";

	if (clientWidth < 768) {
		screen = "xs";
	} else if (clientWidth < 992) {
		screen = "sm";
	} else if (clientWidth < 1200) {
		screen = "md";
	} else if (clientWidth < 1920) {
		screen = "xl";
	} else {
		screen = "full";
	}

	// 是否 ios
	const isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

	// 浏览器版本
	const version = (ua.match(/[\s\S]+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];

	// 是否 PC 端
	const isPC = tag === "pc";

	// 是否移动端
	const isMobile = isPC ? false : true;

	// 是否移动端 + 屏幕宽过小
	const isMini = screen === "xs" || isMobile;

	return {
		height: clientHeight,
		width: clientWidth,
		version,
		type,
		plat,
		tag,
		prefix,
		isMobile,
		isIOS,
		isPC,
		isMini,
		screen
	};
}

// 列表转树形
export function deepTree(list: any[]): any[] {
	const newList: any[] = [];
	const map: any = {};

	list.forEach((e) => (map[e.id] = e));

	list.forEach((e) => {
		const parent = map[e.parentId];

		if (parent) {
			(parent.children || (parent.children = [])).push(e);
		} else {
			newList.push(e);
		}
	});

	const fn = (list: Array<any>) => {
		list.map((e) => {
			if (isArray(e.children)) {
				e.children = orderBy(e.children, "orderNum");
				fn(e.children);
			}
		});
	};

	fn(newList);

	return orderBy(newList, "orderNum");
}

// 树形转列表
export function revDeepTree(list: any[]) {
	const arr: any[] = [];
	let id = 0;

	function deep(list: any[], parentId: number) {
		list.forEach((e) => {
			if (!e.id) {
				e.id = id++;
			}

			if (!e.parentId) {
				e.parentId = parentId;
			}

			arr.push(e);

			if (e.children && isArray(e.children)) {
				deep(e.children, e.id);
			}
		});
	}

	deep(list || [], 0);

	return arr;
}

// 合并 service
export function mergeService(list: any[]) {
	const data: any = {};

	list.forEach(({ path, value }) => {
		const arr: string[] = path.split("/");
		const parents = arr.slice(0, arr.length - 1);
		const name = basename(path).replace(".ts", "");

		let curr = data;

		parents.forEach((k) => {
			if (!curr[k]) {
				curr[k] = {};
			}

			curr = curr[k];
		});

		curr[name] = value;
	});

	return data;
}

// 是否是组件
export function isComponent(name: string) {
	return !isString(resolveComponent(name));
}

// 是否Promise
export function isPromise(val: any) {
	return val && Object.prototype.toString.call(val) === "[object Promise]";
}

// 单位转换
export function parsePx(val: string | number) {
	return isNumber(val) ? `${val}px` : val;
}

export { storage };
export * from "./data";
export * from "./loading";
