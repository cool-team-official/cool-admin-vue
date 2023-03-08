import * as mqtt from "mqtt/dist/mqtt.min";
import { Client } from "mqtt";
import { useCool, hmr } from "/@/cool";

let client: Client | null;

export function useMqtt() {
	const { mitt } = useCool();

	function send(id: string, text: string) {
		client?.publish(id, text);
	}

	function subscribe(id: string) {
		console.log("[iot] mqtt subscribe", id);

		client?.subscribe(`${id}@admin`, function (err) {
			if (err) {
				console.error(err);
			}
		});
	}

	function connect() {
		client = mqtt.connect("ws://127.0.0.1:8083");

		if (!hmr.getData("iotMqttEventLock")) {
			hmr.setData("iotMqttEventLock", true);

			if (client) {
				client.on("connect", function () {
					console.log("[iot] mqtt connect");
				});

				client.on("message", function (topic, message) {
					mitt.emit("iot.message", {
						id: topic.split("@")[0],
						message: message.toString()
					});
				});

				client.on("error", function (err) {
					console.error(err);
					client?.reconnect();
				});
			}
		}
	}

	return {
		client,
		connect,
		subscribe,
		send
	};
}
