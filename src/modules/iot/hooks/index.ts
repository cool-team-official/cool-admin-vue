import mqtt from "mqtt/dist/mqtt.min";
import { useCool } from "/@/cool";

let client: mqtt.MqttClient;

export function useMqtt() {
	const { mitt } = useCool();

	function send(id: string, text: string) {
		client?.publish(id, text);
	}

	function subscribe(id: string) {
		console.log("[iot] mqtt subscribe", id);

		client?.subscribe(`${id}@admin`, function (err: string) {
			if (err) {
				console.error(err);
			}
		});
	}

	function connect() {
		// 断开
		disconnect();

		// 连接
		client = mqtt.connect("ws://127.0.0.1:8083");

		if (client) {
			client.on("connect", function () {
				console.log("[iot] mqtt connect");
			});

			client.on("message", function (topic: string, message: string) {
				mitt.emit("iot.message", {
					id: topic.split("@")[0],
					message: message.toString()
				});
			});

			client.on("error", function (err: string) {
				console.error(err);
				client?.reconnect();
			});
		}
	}

	function disconnect() {
		client?.end();
	}

	return {
		client,
		connect,
		disconnect,
		subscribe,
		send
	};
}
