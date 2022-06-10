import { Socket } from "socket.io-client";

export declare interface Item {
	id: string;
	avatar: string;
	nickName: string;
	[key: string]: any;
}

export declare interface Chat {
	socket?: Socket;
	inputValue: string;
	session: {
		loading: boolean;
		value?: Item;
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
