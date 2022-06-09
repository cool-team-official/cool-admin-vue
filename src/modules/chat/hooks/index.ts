import { inject } from "vue";

declare interface Item {
	id: string;
	avatar: string;
	nickName: string;
	[key: string]: any;
}

declare interface Chat {
	inputValue: string;
	session: {
		loading: boolean;
		value: Item;
		list: Item[];
	};
	message: {
		loading: boolean;
		list: Item[];
		pagination: {
			page: number;
			total: number;
			size: number;
		};
	};
	scrollToBottom(): void;
	getSession(params?: any): void;
	setSession(data: any): void;
	getMessage(params?: any): void;
}

export function useChat() {
	const chat = inject<Chat>("chat");

	return {
		chat
	};
}
