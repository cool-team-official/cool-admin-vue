import { useAppStore } from './app';
import { useMenuStore } from './menu';
import { useProcessStore } from './process';
import { useUserStore } from './user';

export function useStore() {
	const app = useAppStore();
	const menu = useMenuStore();
	const process = useProcessStore();
	const user = useUserStore();

	return {
		app,
		menu,
		process,
		user
	};
}
