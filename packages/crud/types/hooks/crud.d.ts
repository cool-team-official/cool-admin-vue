/// <reference types="../index" />
import { Ref } from "vue";
export declare function useCrud(options?: ClCrud.Options, cb?: (app: ClCrud.Ref) => void): Ref<ClCrud.Ref | undefined>;
export declare function useUpsert<T = any>(options?: ClUpsert.Options<T>): Ref<ClUpsert.Ref<any> | undefined>;
export declare function useTable<T = any>(options?: ClTable.Options<T>): Ref<ClTable.Ref<T> | undefined>;
export declare function useForm<T = any>(cb?: (app: ClForm.Ref<T>) => void): Ref<ClForm.Ref<T> | undefined>;
export declare function useAdvSearch<T = any>(options?: ClAdvSearch.Options<T>): Ref<ClAdvSearch.Ref<T> | undefined>;
export declare function useSearch<T = any>(options?: ClSearch.Options<T>): Ref<ClSearch.Ref<T> | undefined>;
export declare function useDialog(options?: {
    onFullscreen(visible: boolean): void;
}): ClDialog.Provide;
