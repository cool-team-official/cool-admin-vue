import { Theme } from "../types";
import { useBase } from "/$/base";
import { storage } from "/@/cool";

function mix(color1: string, color2: string, weight: number) {
	weight = Math.max(Math.min(Number(weight), 1), 0);
	const r1 = parseInt(color1.substring(1, 3), 16);
	const g1 = parseInt(color1.substring(3, 5), 16);
	const b1 = parseInt(color1.substring(5, 7), 16);
	const r2 = parseInt(color2.substring(1, 3), 16);
	const g2 = parseInt(color2.substring(3, 5), 16);
	const b2 = parseInt(color2.substring(5, 7), 16);
	let r = Math.round(r1 * (1 - weight) + r2 * weight).toString(16);
	let g = Math.round(g1 * (1 - weight) + g2 * weight).toString(16);
	let b = Math.round(b1 * (1 - weight) + b2 * weight).toString(16);
	r = ("0" + (r || 0).toString(16)).slice(-2);
	g = ("0" + (g || 0).toString(16)).slice(-2);
	b = ("0" + (b || 0).toString(16)).slice(-2);
	return "#" + r + g + b;
}

export const themes = [
	{
		label: "钴蓝",
		name: "default",
		color: "#4165d7"
	},
	{
		label: "极黑",
		name: "jihei",
		color: "#222222"
	},
	{
		label: "果绿",
		name: "guolv",
		color: "#51C21A"
	},
	{
		label: "酱紫",
		name: "jiangzi",
		color: "#d0378d"
	}
];

export function setTheme({ color, name, isGroup, transition }: Theme) {
	const { app } = useBase();

	// 主题配置
	const theme = storage.get("theme") || {};

	// 变量前缀
	const pre = "--el-color-primary";

	// 白色混合色
	const mixWhite = "#ffffff";

	// 黑色混合色
	const mixBlack = "#000000";

	// 元素
	const el = document.documentElement;

	// 主题
	if (name) {
		const item = themes.find((e) => e.name == name);

		if (item) {
			color = item.color;
			document.body?.setAttribute("class", `theme-${name}`);
		}

		theme.name = name;
	}

	// 设置主色
	if (color) {
		el.style.setProperty(pre, color);
		el.style.setProperty("--color-primary", color);

		// 设置辅色
		for (let i = 1; i < 10; i += 1) {
			el.style.setProperty(`${pre}-light-${i}`, mix(color, mixWhite, i * 0.1));
			el.style.setProperty(`${pre}-dark-${i}`, mix(color, mixBlack, i * 0.1));
		}

		theme.color = color;
	}

	// 菜单分组显示
	if (isGroup !== undefined) {
		theme.isGroup = isGroup;
		app.set({
			menu: {
				isGroup
			}
		});
	}

	// 转场动画
	if (transition !== undefined) {
		theme.transition = transition;
		app.set({
			router: {
				transition
			}
		});
	}

	storage.set("theme", theme);
}
