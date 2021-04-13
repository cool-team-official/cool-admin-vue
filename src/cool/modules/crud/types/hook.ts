export declare type Pipe =
	| "number"
	| "string"
	| "split"
	| "join"
	| "boolean"
	| "booleanNumber"
	| Function
	| Array<Pipe>;

export declare interface FormHook {
	bind?: Pipe;
	submit?: Pipe;
}
