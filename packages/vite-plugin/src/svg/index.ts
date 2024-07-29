import { readFileSync, readdirSync } from "fs";
import { basename, extname } from "path";
import { rootDir } from "../utils";
import svgo from "svgo";

let svgIcons: string[] = [];

function findSvg(dir: string) {
	const arr: string[] = [];
	const dirs = readdirSync(dir, {
		withFileTypes: true,
	});
	for (const d of dirs) {
		if (d.isDirectory()) {
			arr.push(...findSvg(dir + d.name + "/"));
		} else {
			if (extname(d.name) == ".svg") {
				svgIcons.push(basename(d.name, ".svg"));

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
							},
						);
						if (!/(viewBox="[^>+].*?")/g.test($2)) {
							content += `viewBox="0 0 ${width} ${height}"`;
						}
						return `<symbol id="icon-${d.name.replace(".svg", "")}" ${content}>`;
					})
					.replace("</svg>", "</symbol>");

				arr.push(svg);
			}
		}
	}
	return arr;
}

function compilerSvg() {
	svgIcons = [];

	return findSvg(rootDir("./src/"))
		.map((e) => {
			return svgo.optimize(e)?.data || e;
		})
		.join("");
}

export async function createSvg() {
	const html = compilerSvg();

	const code = `
if (typeof window !== 'undefined') {
	function loadSvg() {
		const svgDom = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svgDom.style.position = 'absolute';
		svgDom.style.width = '0';
		svgDom.style.height = '0';
		svgDom.setAttribute('xmlns','http://www.w3.org/2000/svg');
		svgDom.setAttribute('xmlns:link','http://www.w3.org/1999/xlink');
		svgDom.innerHTML = '${html}';
		document.body.insertBefore(svgDom, document.body.firstChild);
	}

	loadSvg();
}
		`;

	return { code, svgIcons };
}
