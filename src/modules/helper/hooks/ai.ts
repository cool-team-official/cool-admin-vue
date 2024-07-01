import { module } from "/@/cool";
import { useBase } from "/$/base";

export function useAi() {
	const { host } = module.config("helper");
	const { user } = useBase();

	// 调用流程
	async function invokeFlow(
		label: string,
		params: any,
		streamCb?: ({ isEnd, content }: { isEnd: boolean; content: string }) => void
	): Promise<any> {
		const stream = !!streamCb;

		let cacheText = "";

		return new Promise((resolve, reject) => {
			fetch(host + "/open/code/gen/data", {
				method: "POST",
				headers: {
					Authorization: user.token,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					params,
					label,
					stream
				})
			})
				.then((res) => {
					if (res.body) {
						if (stream) {
							const reader = res.body.getReader();
							const decoder = new TextDecoder("utf-8");
							const stream = new ReadableStream({
								start(controller) {
									function push() {
										reader.read().then(({ done, value }) => {
											if (done) {
												controller.close();
												return;
											}

											let text = decoder.decode(value, { stream: true });

											if (streamCb) {
												if (cacheText) {
													text = cacheText + text;
												}

												if (text.indexOf("data:") == 0) {
													text = "\n\n" + text;
												}

												try {
													const arr = text
														.split(/\n\ndata:/g)
														.filter(Boolean)
														.map((e) => JSON.parse(e));

													arr.forEach(streamCb);

													cacheText = "";
												} catch (err) {
													cacheText = text;
												}
											}

											controller.enqueue(text);
											push();
										});
									}
									push();
								}
							});

							return new Response(stream);
						} else {
							return res.json();
						}
					}
				})
				.then((res) => {
					if (stream) {
						return res;
					}

					if (res.code == 1000) {
						resolve(res.data.result);
					} else {
						reject(res);
					}
				})
				.catch(reject);
		});
	}

	return {
		invokeFlow
	};
}
