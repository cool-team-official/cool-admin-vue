import { Ref } from "vue";

export declare namespace Upload {
	interface Item {
		url: string;
		preload: string;
		uid: number | string;
		progress: number;
		type?: string;
	}

	interface Space {
		category: {
			id: number | undefined;
			visible: boolean;
		};
		list: Ref<Eps.SpaceInfoEntity[]>;
		selection: Ref<Eps.SpaceInfoEntity[]>;
		refresh(params: any): Promise<any>;
		loading: boolean;
	}
}
