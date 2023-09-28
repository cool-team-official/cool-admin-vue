import { Ref, WatchStopHandle, getCurrentInstance, watch } from "vue";

export function usePlugins({ visible }: { visible: Ref<boolean> }) {
	const that: any = getCurrentInstance();

	interface Event {
		onOpen: (() => void)[];
		onClose: (() => void)[];
		onSubmit: ((data: obj) => obj)[];
		[key: string]: any;
	}

	// 事件
	const ev: Event = {
		onOpen: [],
		onClose: [],
		onSubmit: []
	};

	// 监听器
	let timer: WatchStopHandle | null = null;

	// 插件创建
	function create(plugins?: ClForm.Plugin[]) {
		for (const i in ev) {
			ev[i] = [];
		}

		if (timer) {
			timer();
		}

		if (plugins) {
			plugins.forEach((p) => {
				p({
					exposed: that.exposed,
					onOpen(cb: any) {
						ev.onOpen.push(cb);
					},
					onClose(cb: any) {
						ev.onClose.push(cb);
					},
					onSubmit(cb: any) {
						ev.onSubmit.push(cb);
					}
				});
			});

			timer = watch(
				visible,
				(val) => {
					if (val) {
						setTimeout(() => {
							ev.onOpen.forEach((e) => e());
						}, 10);
					} else {
						ev.onClose.forEach((e) => e());
					}
				},
				{
					immediate: true
				}
			);
		}
	}

	// 表单提交
	async function submit(data: any) {
		let d = data;

		for (let i = 0; i < ev.onSubmit.length; i++) {
			const d2 = await ev.onSubmit[i](d);

			if (d2) {
				d = d2;
			}
		}

		return d;
	}

	return {
		create,
		submit
	};
}
