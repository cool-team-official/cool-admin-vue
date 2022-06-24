import { Plugin } from "vite";
import { readFileSync, readdirSync, accessSync } from "fs";
import path from "path";
import { isArray } from "lodash";

let idPerfix = "";
const svgTitle = /<svg([^>+].*?)>/;
const clearHeightWidth = /(width|height)="([^>+].*?)"/g;

const hasViewBox = /(viewBox="[^>+].*?")/g;

const clearReturn = /(\r)|(\n)/g;

function findSvgFile(dir: string, uniqueNames: Record<string, boolean>): string[] {
	const svgRes = [];
	const dirents = readdirSync(dir, {
		withFileTypes: true
	});
	for (const dirent of dirents) {
		if (dirent.isDirectory()) {
			svgRes.push(...findSvgFile(path.join(dir, dirent.name), uniqueNames));
		} else if (uniqueNames[dirent.name]) {
			continue;
		} else {
			uniqueNames[dirent.name] = true;
			const svg = readFileSync(path.join(dir, dirent.name))
				.toString()
				.replace(clearReturn, "")
				.replace(svgTitle, (_: any, $2: any) => {
					let width = 0;
					let height = 0;
					let content = $2.replace(clearHeightWidth, (_: any, s2: any, s3: any) => {
						if (s2 === "width") {
							width = s3;
						} else if (s2 === "height") {
							height = s3;
						}
						return "";
					});
					if (!hasViewBox.test($2)) {
						content += `viewBox="0 0 ${width} ${height}"`;
					}
					return `<symbol id="${idPerfix}-${dirent.name.replace(
						".svg",
						""
					)}" ${content}>`;
				})
				.replace("</svg>", "</symbol>");
			svgRes.push(svg);
		}
	}
	return svgRes;
}

export const svgBuilder = (paths: string | string[], perfix = "icon"): Plugin | null => {
	if (paths) {
		idPerfix = perfix;
		paths = isArray(paths) ? paths : [paths];
		const uniqueNames: Record<string, boolean> = {};
		const res = paths.reduce(
			(previousValue, currentValue) =>
				previousValue.concat(findSvgFile(currentValue, uniqueNames)),
			[]
		);
		return {
			name: "svg-transform",
			transformIndexHtml(html): string {
				return html.replace(
					"<body>",
					`
          <body>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0">
              ${res.join("")}
            </svg>
        `
				);
			}
		};
	} else {
		return null;
	}
};

export const findSvgFolders = (dir: string): string[] => {
	const svgFolders = [];
	const dirents = readdirSync(dir, {
		withFileTypes: true
	});

	// 找到结构为icons/svg的文件夹
	for (const dirent of dirents) {
		if (dirent.isDirectory()) {
			const testPath =
				dirent.name === "icons"
					? path.join(dir, "icons/svg")
					: path.join(dir, dirent.name, "icons/svg");
			try {
				accessSync(testPath);
				svgFolders.push(testPath);
			} catch (e) {
				continue;
			}
		}
	}
	return svgFolders;
};
