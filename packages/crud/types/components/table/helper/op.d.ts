/// <reference types="../index" />
export declare function useOp({ config }: {
    config: ClTable.Config;
}): {
    visible: import("vue").Ref<boolean>;
    reBuild: (cb?: fn) => Promise<void>;
    showColumn: (prop: string | string[], status?: boolean) => void;
    hideColumn: (prop: string | string[]) => void;
    setColumns: (list: ClTable.Column[]) => void;
};
