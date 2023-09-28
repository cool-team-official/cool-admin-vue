import { config } from "/@/config";
import { createLink } from "../utils";

// 字体图标库加载
if (config.app.iconfont) {
	config.app.iconfont.forEach((e: string) => {
		createLink(e);
	});
}

// 默认
createLink("//at.alicdn.com/t/c/font_3254019_h02ghb7ckt5.css");
