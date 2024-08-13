import type { Eps } from "../../types";
export declare function createEps(query?: {
    list: any[];
}): Promise<{
    service: {};
    list: Eps.Entity[];
    isUpdate: boolean;
} | {
    service: {};
    list: never[];
    isUpdate?: undefined;
}>;
