/// <reference types="../index" />
export declare function useSelection({ emit }: {
    emit: Vue.Emit;
}): {
    selection: obj[];
    onSelectionChange: (selection: any[]) => void;
};
