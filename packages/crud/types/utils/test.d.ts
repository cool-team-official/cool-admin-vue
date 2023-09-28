export declare const UserList: ({
    id: number;
    name: string;
    createTime: string;
    price: number;
    status: number;
    hook: string;
    user: {
        name: string;
    };
    t2: string;
    tags: number[];
} | {
    id: number;
    name: string;
    createTime: string;
    price: number;
    status: number;
    tags: number[];
    hook?: undefined;
    user?: undefined;
    t2?: undefined;
})[];
export declare const TestService: {
    page: (p: any) => Promise<unknown>;
    list: (p: any) => Promise<unknown>;
    info: (d: any) => Promise<unknown>;
    add: (d: any) => Promise<void>;
    delete: (d: any) => Promise<unknown>;
    update: (d: any) => Promise<void>;
};
