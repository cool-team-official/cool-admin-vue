import { inject } from "vue";
import { Chat } from "../types";

export function useChat() {
	const chat = inject("chat") as Chat.Provide;

	return {
		chat
	};
}
