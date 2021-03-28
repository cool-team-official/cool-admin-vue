import { isObject } from "@/core/utils";

export function parseContent({ content, contentType }: any) {
	const data = isObject(content) ? content : JSON.parse(content);
	let text = "";

	switch (contentType) {
		case 0:
			text = data.text;
			break;
		case 1:
			text = "[图片]";
			break;
		case 2:
			text = "[表情]";
			break;
		case 3:
			text = "[语音]";
			break;
		case 4:
			text = "[视频]";
			break;
		case 5:
			text = "[商品信息]";
			break;
	}

	data._text = text;

	return data;
}
