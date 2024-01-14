/// <reference types="../index" />
import { Ref } from "vue";
export declare function usePlugins({ visible }: {
    visible: Ref<boolean>;
}): {
    create: (plugins?: ClForm.Plugin[]) => void;
    submit: (data: any) => Promise<any>;
};
