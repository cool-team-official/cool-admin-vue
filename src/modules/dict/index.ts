import { useStore } from './store';

export function useDict() {
	return {
		...useStore()
	};
}
