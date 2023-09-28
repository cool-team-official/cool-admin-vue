import { Ref } from "vue";

export declare namespace Upload {
	interface Rule {
		name: string;
		type: string;
		color: string;
		exts: string[];
	}

	interface Item extends Eps.SpaceInfoEntity {
		url?: string;
		uid: string;
		progress: number;
		preload?: string;
		error?: string;
		isPlay?: boolean;
	}

	interface Space {
		loading: boolean;
		category: {
			id: number | undefined;
			visible: boolean;
		};
		list: Ref<Eps.SpaceInfoEntity[]>;
		selection: Ref<Eps.SpaceInfoEntity[]>;
		refresh(params: any): Promise<any>;
		preview(item: Eps.SpaceInfoEntity): void;
	}
}
