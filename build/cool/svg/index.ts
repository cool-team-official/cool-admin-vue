import { readFileSync, readdirSync } from "fs";
import { extname } from "path";

function findFiles(dir: string): string[] {
	const res: string[] = [];
	const dirs = readdirSync(dir, {
		withFileTypes: true
	});
	for (const d of dirs) {
		if (d.isDirectory()) {
			res.push(...findFiles(dir + d.name + "/"));
		} else {
			if (extname(d.name) == ".svg") {
				const svg = readFileSync(dir + d.name)
					.toString()
					.replace(/(\r)|(\n)/g, "")
					.replace(/<svg([^>+].*?)>/, (_: any, $2: any) => {
						let width = 0;
						let height = 0;
						let content = $2.replace(
							/(width|height)="([^>+].*?)"/g,
							(_: any, s2: any, s3: any) => {
								if (s2 === "width") {
									width = s3;
								} else if (s2 === "height") {
									height = s3;
								}
								return "";
							}
						);
						if (!/(viewBox="[^>+].*?")/g.test($2)) {
							content += `viewBox="0 0 ${width} ${height}"`;
						}
						return `<symbol id="icon-${d.name.replace(".svg", "")}" ${content}>`;
					})
					.replace("</svg>", "</symbol>");
				res.push(svg);
			}
		}
	}
	return res;
}

export function createSvg(html: string) {
	const res = findFiles("./src/modules/");

	return html.replace(
		"<body>",
		`<body>
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">
				${res.join("")}
			</svg>`
	);
}
