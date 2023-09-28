import { useCore } from "../../../hooks";

export function useSelection({ emit }: { emit: Vue.Emit }) {
	const { crud } = useCore();

	// 选择项发生变化
	function onSelectionChange(selection: any[]) {
		crud.selection.splice(0, crud.selection.length, ...selection);
		emit("selection-change", crud.selection);
	}

	return {
		selection: crud.selection,
		onSelectionChange
	};
}
