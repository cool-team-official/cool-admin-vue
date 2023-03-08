import { config } from "/@/cool";
import { createLink } from "../utils";

// 字体图标库加载
if (config.app.iconfont) {
	config.app.iconfont.forEach((e: string) => {
		createLink(e);
	});
}

// 默认
createLink("//at.alicdn.com/t/font_3254019_60a2xxj8uus.css");
