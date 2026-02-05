/* tslint:disable */
/* eslint-disable */

export class VirtualMachine {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    addToScope(name: string, value: any): void;
    assert_valid(): void;
    destroy(): void;
    eval(source: string, source_path?: string | null): any;
    exec(source: string, source_path?: string | null): any;
    execSingle(source: string, source_path?: string | null): any;
    injectJSModule(name: string, module: object): void;
    injectModule(name: string, source: string, imports?: object | null): void;
    setStdout(stdout: any): void;
    valid(): boolean;
}

export function _setup_console_error(): void;

/**
 * Evaluate Python code
 *
 * ```js
 * var result = pyEval(code, options?);
 * ```
 *
 * `code`: `string`: The Python code to run in eval mode
 *
 * `options`:
 *
 * -   `vars?`: `{ [key: string]: any }`: Variables passed to the VM that can be
 *     accessed in Python with the variable `js_vars`. Functions do work, and
 *     receive the Python kwargs as the `this` argument.
 * -   `stdout?`: `"console" | ((out: string) => void) | null`: A function to replace the
 *     native print native print function, and it will be `console.log` when giving
 *     `undefined` or "console", and it will be a dumb function when giving null.
 */
export function pyEval(source: string, options?: object | null): any;

/**
 * Evaluate Python code
 *
 * ```js
 * pyExec(code, options?);
 * ```
 *
 * `code`: `string`: The Python code to run in exec mode
 *
 * `options`: The options are the same as eval mode
 */
export function pyExec(source: string, options?: object | null): void;

/**
 * Evaluate Python code
 *
 * ```js
 * var result = pyExecSingle(code, options?);
 * ```
 *
 * `code`: `string`: The Python code to run in exec single mode
 *
 * `options`: The options are the same as eval mode
 */
export function pyExecSingle(source: string, options?: object | null): any;

export class vmStore {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static destroy(id: string): void;
    static get(id: string): any;
    static ids(): any[];
    static init(id: string, inject_browser_module?: boolean | null): VirtualMachine;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly pyEval: (a: number, b: number, c: number) => [number, number, number];
    readonly pyExec: (a: number, b: number, c: number) => [number, number];
    readonly pyExecSingle: (a: number, b: number, c: number) => [number, number, number];
    readonly _setup_console_error: () => void;
    readonly __wbg_virtualmachine_free: (a: number, b: number) => void;
    readonly __wbg_vmstore_free: (a: number, b: number) => void;
    readonly virtualmachine_addToScope: (a: number, b: number, c: number, d: any) => [number, number];
    readonly virtualmachine_assert_valid: (a: number) => [number, number];
    readonly virtualmachine_destroy: (a: number) => [number, number];
    readonly virtualmachine_eval: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
    readonly virtualmachine_exec: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
    readonly virtualmachine_execSingle: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
    readonly virtualmachine_injectJSModule: (a: number, b: number, c: number, d: any) => [number, number];
    readonly virtualmachine_injectModule: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
    readonly virtualmachine_setStdout: (a: number, b: any) => [number, number];
    readonly virtualmachine_valid: (a: number) => number;
    readonly vmstore_destroy: (a: number, b: number) => void;
    readonly vmstore_get: (a: number, b: number) => any;
    readonly vmstore_ids: () => [number, number];
    readonly vmstore_init: (a: number, b: number, c: number) => number;
    readonly wasm_bindgen__closure__destroy__hd71e09f6757aa2e0: (a: number, b: number) => void;
    readonly wasm_bindgen__closure__destroy__h4c39a28592e0b160: (a: number, b: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h8359da940ff8ee37: (a: number, b: number, c: number) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h747cd42a6fb234f9: (a: number, b: number, c: any, d: number, e: number) => [number, number, number];
    readonly wasm_bindgen__convert__closures_____invoke__h9a76f1f39fbed4af: (a: number, b: number, c: number, d: number, e: number) => [number, number, number];
    readonly wasm_bindgen__convert__closures_____invoke__hb54b410588933e23: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen__convert__closures_____invoke__h9d019e586eeddc81: (a: number, b: number, c: any) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
