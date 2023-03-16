import { ElMessage, ElNotification } from "element-plus";
import { debounce } from "lodash-es";
import { io, Socket } from "socket.io-client";
import { reactive, ref, watch } from "vue";
import { storage, useCool } from "/@/cool";

export function useChatGPT() {
	const { route, router } = useCool();

	const apiKey = ref(storage.get("chatgpt.apiKey") || "");

	// 余额
	const balance = reactive({
		total_granted: 0,
		total_used: 0,
		loading: false
	});

	// 获取余额
	const getBalance = debounce(() => {
		if (apiKey.value) {
			balance.loading = true;
			socket?.emit("getBalance", { apiKey: apiKey.value });
		}
	}, 300);

	// 监听apikey改变
	watch(apiKey, (val) => {
		getBalance();
		storage.set("chatgpt.apiKey", val);
	});

	let socket: Socket | null;

	// 连接
	function connect(cb: { onMessage?(content: string): void; onComplete?(): void }) {
		if (!socket) {
			socket = io("https://ai.cool-js.cloud", {
				transports: ["websocket"]
			});

			if (socket) {
				// 连接
				socket.on("connect", () => {
					getBalance();

					// 消息
					socket?.on("progress", (msg: string) => {
						if (msg.includes("[DONE]")) {
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
							getBalance();
						} else {
							try {
								msg.split("data: ").forEach((e) => {
									if (e) {
										const d = JSON.parse(e);
										const { content = "" } = d.choices[0].delta;
										cb?.onMessage?.(content);
									}
								});
							} catch (e) {
								console.error(e);
							}
						}
					});

					// 余额
					socket?.on("balance", (res) => {
						if (res == "error apiKey") {
							ElMessage.error(res);
							balance.total_granted = 0;
							balance.total_used = 0;
						} else {
							balance.total_granted = res.total_granted.toFixed(5);
							balance.total_used = res.total_used.toFixed(5);
						}

						balance.loading = false;
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
		socket?.emit("data", data);
	}

	return {
		connect,
		send,
		apiKey,
		balance,
		getBalance
	};
}

export function useScroll() {
	const { mitt } = useCool();

	let timer: NodeJS.Timer | null;

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
