export const revisePath = (path: string) => {
	if (!path) {
		return "";
	}

	if (path[0] == "/") {
		return path;
	} else {
		return `/${path}`;
	}
};

export function firstMenu(list: Array<any>) {
	let path = "";

	const fn = (arr: Array<any>) => {
		arr.forEach((e: any) => {
			if (e.type == 1) {
				if (!path) {
					path = e.path;
				}
			} else {
				fn(e.children);
			}
		});
	};

	fn(list);

	return path || "/404";
}

export function createLink(url: string, id?: string) {
	const link = document.createElement("link");
	link.href = url;
	link.type = "text/css";
	link.rel = "stylesheet";
	if (id) {
		link.id = id;
	}

	document
		.getElementsByTagName("head")
		?.item(0)
		?.appendChild(link);
}
