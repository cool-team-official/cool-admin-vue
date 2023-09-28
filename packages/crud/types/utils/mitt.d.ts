declare const mitt: import("mitt").Emitter<Record<import("mitt").EventType, unknown>>;
declare class Mitt {
    id: number;
    constructor(id?: number);
    send(type: "emit" | "off" | "on", name: string, ...args: any[]): void;
    emit(name: string, ...args: any[]): void;
    off(name: string, handler: (...args: any[]) => void): void;
    on(name: string, handler: (...args: any[]) => void): void;
}
export { Mitt, mitt };
