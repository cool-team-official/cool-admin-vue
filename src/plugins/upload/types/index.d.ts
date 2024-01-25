export declare namespace Upload {
	interface Rule {
		name: string;
		type: string;
		color: string;
		exts: string[];
	}

	interface Item {
		url?: string;
		uid: string;
		progress: number;
		preload?: string;
		error?: string;
		isPlay?: boolean;
		[key: string]: any;
	}
}
