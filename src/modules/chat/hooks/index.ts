import { inject } from "vue";
import { Chat } from "../types";

export function useChat() {
	const chat = inject<Chat>("chat");

	return {
		chat
	};
}
