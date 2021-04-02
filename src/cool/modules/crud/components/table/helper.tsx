export function useElTableApi({ refs }: any) {
	const clearSelection = () => {
		if (refs.value.table) {
			refs.value.table.clearSelection();
		}
	};

	const toggleRowSelection = (row: any, selected?: boolean) => {
		if (refs.value.table) {
			refs.value.table.toggleRowSelection(row, selected);
		}
	};

	const toggleAllSelection = () => {
		if (refs.value.table) {
			refs.value.table.toggleAllSelection();
		}
	};

	const toggleRowExpansion = (row: any, expanded?: boolean) => {
		if (refs.value.table) {
			refs.value.table.toggleRowExpansion(row, expanded);
		}
	};

	const setCurrentRow = (row: any) => {
		if (refs.value.table) {
			refs.value.table.setCurrentRow(row);
		}
	};

	const clearSort = () => {
		if (refs.value.table) {
			refs.value.table.clearSort();
		}
	};

	const clearFilter = (columnKey: any) => {
		if (refs.value.table) {
			refs.value.table.clearFilter(columnKey);
		}
	};

	const doLayout = () => {
		if (refs.value.table) {
			refs.value.table.doLayout();
		}
	};

	const sort = (prop: string, order: string) => {
		if (refs.value.table) {
			refs.value.table.sort(prop, order);
		}
	};

	return {
		clearSelection,
		toggleRowSelection,
		toggleAllSelection,
		toggleRowExpansion,
		setCurrentRow,
		clearSort,
		clearFilter,
		doLayout,
		sort
	};
}
