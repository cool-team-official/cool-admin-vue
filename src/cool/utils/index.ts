import { routerMode } from "../config";
import storage from "./storage";
import module from "./module";

// 是否Array类型
export function isArray(value: any): boolean {
	if (typeof Array.isArray === "function") {
		return Array.isArray(value);
	} else {
		return Object.prototype.toString.call(value) === "[object Array]";
	}
}

// 是否Object类型
export function isObject(value: any): boolean {
	return Object.prototype.toString.call(value) === "[object Object]";
}

// 是否Function类型
export function isFunction(value: any): boolean {
	return typeof value === "function";
}

// 是否String类型
export function isString(value: any): boolean {
	return typeof value === "string";
}

// 是否Boolean类型
export function isBoolean(value: any): boolean {
	return typeof value === "boolean";
}

// 是否数字类型
export function isNumber(value: any): boolean {
	return typeof value === "number" && !isNaN(value);
}

// 是否Promise类型
export function isPromise(value: any): boolean {
	return (
		value !== null &&
		(typeof value === "object" || typeof value === "function") &&
		typeof value.then === "function"
	);
}

// 是否为空
export function isEmpty(value: any): boolean {
	if (isArray(value)) {
		return value.length === 0;
	}

	if (isObject(value)) {
		return Object.keys(value).length === 0;
	}

	return value === "" || value === undefined || value === null;
}

// 比较值
export function compareValue(a: any, b: any) {
	return String(a) === String(b);
}

// 取最后一个值
export function last(data: string | any[]) {
	if (isArray(data) || isString(data)) {
		return data[data.length - 1];
	}
}

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

// 深拷贝
export function cloneDeep(v: any) {
	if (isObject(v)) {
		const d: any = {};

		for (const k in v) {
			if (v.hasOwnProperty && v.hasOwnProperty(k)) {
				if (v[k] && typeof v[k] === "object") {
					d[k] = cloneDeep(v[k]);
				} else {
					d[k] = v[k];
				}
			}
		}

		return d;
	} else if (isArray(v)) {
		return v.map(cloneDeep);
	} else {
		return v;
	}
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

// 根据某个字段排序
export function orderBy(list: any[], key: string): any[] {
	return list.sort((a, b) => b[key] - a[key]);
}

// 文件路径转对象
export function deepFiles(list: any[]) {
	const modules: any = {};

	list.forEach((e) => {
		const arr = e.path.split("/");
		const parents = arr.slice(0, arr.length - 1);
		const name = basename(e.path).replace(".ts", "");

		let curr: any = modules;
		let prev: any = null;
		let key: any = null;

		parents.forEach((k: string) => {
			if (!curr[k]) {
				curr[k] = {};
			}

			prev = curr;
			curr = curr[k];
			key = k;
		});

		if (name == "index") {
			prev[key] = e.value;
		} else {
			curr[name] = e.value;
		}
	});

	return modules;
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

// 跳转
export function href(path: string, newWindow?: boolean) {
	const { origin, pathname } = window.location;

	if (pathname == path) {
		return false;
	}

	let url = "";

	if (routerMode == "history") {
		url = origin + import.meta.env.BASE_URL + path.substr(1);
	} else {
		url = origin + import.meta.env.BASE_URL + "#" + path;
	}

	if (newWindow) {
		window.open(url);
	} else {
		window.location.href = url;
	}
}

// 列表转树形
export function deepTree(list: any[]): any[] {
	const newList: Array<any> = [];
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
			if (e.children instanceof Array) {
				e.children = orderBy(e.children, "orderNum");

				fn(e.children);
			}
		});
	};

	fn(newList);

	return orderBy(newList, "orderNum");
}

// 树形转列表
export function revDeepTree(list: Array<any> = []) {
	const d: Array<any> = [];
	let id = 0;

	const deep = (list: Array<any>, parentId: any) => {
		list.forEach((e) => {
			if (!e.id) {
				e.id = id++;
			}

			e.parentId = parentId;

			d.push(e);

			if (e.children && isArray(e.children)) {
				deep(e.children, e.id);
			}
		});
	};

	deep(list || [], null);

	return d;
}

export { storage, module };
