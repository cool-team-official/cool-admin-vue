import { inject } from "vue";

declare interface Chat {
	session: {
		visible: boolean;
		list: any[];
	};
}

export function useChat() {
	const chat = inject<Chat>("chat");

	return {
		chat
	};
}
