import { join } from "path";
import { readFile, rootDir, writeFile } from "../utils";
import { glob } from "glob";
import { assign, cloneDeep, isEqual } from "lodash";
import type { Ctx } from "../../types";
import { config } from "../config";
import fs from "fs";

export async function createCtx() {
	let ctx: Ctx.Data = {};

	if (config.type == "app") {
		const manifest = readFile(rootDir("manifest.json"), true);

		// 文件路径
		const ctxPath = rootDir("pages.json");

		// 页面配置
		ctx = readFile(ctxPath, true);

		// 原数据，做更新比较用
		const ctxData = cloneDeep(ctx);

		// 删除临时页面
		ctx.pages = ctx.pages?.filter((e) => !e.isTemp);
		ctx.subPackages = ctx.subPackages?.filter((e) => !e.isTemp);

		// 加载 uni_modules 配置文件
		const files = await glob(rootDir("uni_modules") + "/**/pages_init.json", {
			stat: true,
			withFileTypes: true,
		});

		for (const file of files) {
			if (file.isFile()) {
				const { pages = [], subPackages = [] }: Ctx.Data = readFile(
					join(file.path, file.name),
					true,
				);

				// 合并到 pages 中
				[...pages, ...subPackages].forEach((e) => {
					e.isTemp = true;

					const isSub = !!e.root;

					const d = isSub
						? ctx.subPackages?.find((a) => a.root == e.root)
						: ctx.pages?.find((a) => a.path == e.path);

					if (d) {
						assign(d, e);
					} else {
						if (isSub) {
							ctx.subPackages?.unshift(e);
						} else {
							ctx.pages?.unshift(e);
						}
					}
				});
			}
		}

		// 是否需要更新 pages.json
		if (!isEqual(ctxData, ctx)) {
			console.log("[cool-ctx] pages updated");
			writeFile(ctxPath, JSON.stringify(ctx, null, 4));
		}

		// appid
		ctx.appid = manifest.appid;
	}

	if (config.type == "admin") {
		const list = fs.readdirSync(rootDir("./src/modules"));
		ctx.modules = list.filter((e) => !e.includes("."));
	}

	return ctx;
}
