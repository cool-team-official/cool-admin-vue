import { ElNotification } from "element-plus";
import { io, Socket } from "socket.io-client";
import { useCool } from "/@/cool";

export function useAi() {
	const { route, router } = useCool();

	let socket: Socket | null;

	// 连接
	function connect(cb: { onMessage?(content: string): void; onComplete?(): void }) {
		if (!socket) {
			socket = io("https://service.cool-js.com/code", {
				transports: ["websocket"]
			});

			if (socket) {
				// 连接
				socket.on("connect", () => {
					console.log("connect");

					// 消息
					socket?.on("data", (msg: { isEnd: boolean; content: string }) => {
						if (msg.isEnd) {
							if (route.path != "/magic/ai-code") {
								const notify = ElNotification({
									title: "提示",
									message: "Ai自动生成代码完成，点击查看",
									duration: 0,
									onClick() {
										router.push("/magic/ai-code");
										notify.close();
									}
								});
							}

							cb.onComplete?.();
						} else {
							try {
								cb?.onMessage?.(msg.content);
							} catch (e) {
								console.error(e);
							}
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

	return {
		connect,
		send
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
