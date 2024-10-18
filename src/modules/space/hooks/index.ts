import { type Ref, inject } from 'vue';

declare interface Space {
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

export function useSpace() {
	const space = inject('space') as Space;

	return { space };
}
