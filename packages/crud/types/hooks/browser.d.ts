import { App } from "vue";
export declare type Browser = {
    screen: string;
    isMini: boolean;
};
export declare function useBrowser(app?: App): {
    screen: string;
    isMini: boolean;
};
