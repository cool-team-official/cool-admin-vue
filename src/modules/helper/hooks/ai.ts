import { ElNotification } from "element-plus";
import { io, Socket } from "socket.io-client";
import { module, useCool } from "/@/cool";
import { request } from "../utils";
import type { EpsColumn } from "../types";

export function useAi() {
	const { route, router } = useCool();
	const { host } = module.config("helper");

	let socket: Socket | null;

	// 连接
	function connect(cb: { onMessage?(content: string): void; onComplete?(): void }) {
		if (!socket) {
			socket = io(`${host}/code`, {
				transports: ["websocket"]
			});

			if (socket) {
				// 连接
				socket.on("connect", () => {
					console.log("connect");

					let content = "";
					let code = "";
					let isEnd = false;
					let timer: any;

					// 消息
					socket?.on("data", (msg: { isEnd: boolean; content: string }) => {
						isEnd = msg.isEnd;

						if (msg.isEnd) {
							if (route.path != "/helper/ai-code") {
								const notify = ElNotification({
									title: "提示",
									message: "Ai自动生成代码完成，点击查看",
									duration: 0,
									onClick() {
										router.push("/helper/ai-code");
										notify.close();
									}
								});
							}
						} else {
							try {
								// 首行去掉 \n
								if (msg.content.includes("\n") && !content) {
									msg.content = msg.content.replace(/\n/, "");
								}

								// 去掉描述
								msg.content = msg.content
									.replace(/```/g, "")
									.replace(/typescript/g, "");

								// 拼接内容
								content += msg.content || "";
							} catch (err) {
								console.error(err);
							}
						}

						if (!timer) {
							// 逐字输出
							timer = setInterval(() => {
								const v = content[code.length] || "";

								if (!v && isEnd) {
									content = "";
									code = "";
									isEnd = false;

									// 清除事件
									clearInterval(timer);
									timer = null;

									// 完成事件
									cb.onComplete?.();
								} else {
									code += v;

									// 消息事件
									cb?.onMessage?.(code);
								}
							}, 10);
						}
					});
				});

				// 断开
				socket.on("disconnect", (err) => {
					console.error(err);
				});
			}
		}
	}

	// 发送
	function send(data: { name: string; columns: string[]; module: string }) {
		socket?.emit("instruct", data);
	}

	// 匹配组件类型
	function matchType({ columns, name }: { columns: EpsColumn[]; name: string }) {
		return new Promise((resolve, reject) => {
			const fields = columns.filter((e) => {
				return !["id", "crateTime", "updateTime"].includes(e.propertyName);
			});

			request({
				url: "/open/code/eps/matchType",
				method: "POST",
				data: {
					fields: fields.map((e) => {
						return {
							type: e.type,
							field: e.propertyName,
							description: e.comment
						};
					}),
					func: name
				}
			})
				.then((res) => {
					const names = res.split(",");

					fields.forEach((e, i) => {
						e.component = names[i];
					});

					resolve(fields);
				})
				.catch(reject);
		});
	}

	return {
		connect,
		send,
		matchType
	};
}

export function useScroll() {
	const { mitt } = useCool();

	let timer: any;

	function start() {
		stop();

		timer = setInterval(() => {
			mitt.emit("view.scrollTo", { top: Math.random() + 10000 });
		}, 100);
	}

	function stop() {
		if (timer) {
			clearInterval(timer);
		}
	}

	return {
		start,
		stop
	};
}
