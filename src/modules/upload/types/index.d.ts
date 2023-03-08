import { Ref } from "vue";

export declare namespace Upload {
	interface Item {
		url: string;
		preload: string;
		uid: string;
		progress: number;
		type?: string;
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
