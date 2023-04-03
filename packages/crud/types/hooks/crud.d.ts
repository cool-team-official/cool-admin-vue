/// <reference types="../index" />
import { Ref } from "vue";
export declare function useCrud(options?: DeepPartial<ClCrud.Options>, cb?: (app: ClCrud.Ref) => void): Ref<ClCrud.Ref | undefined>;
export declare function useUpsert(options?: DeepPartial<ClUpsert.Options>): Ref<ClUpsert.Ref | undefined>;
export declare function useTable(options?: DeepPartial<ClTable.Options>): Ref<ClTable.Ref | undefined>;
export declare function useForm(cb?: (app: ClForm.Ref) => void): Ref<ClForm.Ref | undefined>;
export declare function useAdvSearch(options?: DeepPartial<ClAdvSearch.Options>): Ref<ClAdvSearch.Ref | undefined>;
export declare function useDialog(options?: {
    onFullscreen(visible: boolean): void;
}): ClDialog.Provide;
