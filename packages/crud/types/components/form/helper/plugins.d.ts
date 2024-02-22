/// <reference types="../index" />
import { Ref } from "vue";
export declare function usePlugins(enable: boolean, { visible }: {
    visible: Ref<boolean>;
}): {
    create: (plugins?: ClForm.Plugin[]) => false | undefined;
    submit: (data: any) => Promise<any>;
};
