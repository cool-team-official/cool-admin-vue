declare class Mitt {
    id: number;
    constructor(id?: number);
    send(type: "emit" | "off" | "on", name: string, ...args: any[]): void;
    on(name: string, ...args: any[]): void;
    emit(name: string, ...args: any[]): void;
    off(name: string, ...args: any[]): void;
}
export default Mitt;
