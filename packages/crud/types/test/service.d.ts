declare class TestService {
    page(params: any): Promise<unknown>;
    update(params: {
        id: any;
        [key: string]: any;
    }): Promise<void>;
    add(params: any): Promise<string>;
    info(params: {
        id: any;
    }): Promise<{
        id: string;
        name: string;
        createTime: string;
        wages: number;
        status: number;
        account: string;
        occupation: number;
        phone: number;
    } | undefined>;
    delete(params: {
        ids: any[];
    }): Promise<void>;
    list(): Promise<{
        id: string;
        name: string;
        createTime: string;
        wages: number;
        status: number;
        account: string;
        occupation: number;
        phone: number;
    }[]>;
}
export { TestService };
