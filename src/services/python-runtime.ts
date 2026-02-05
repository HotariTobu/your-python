import init, { pyExec } from "../wasm/rustpython_wasm.js";
import wasmUrl from "../wasm/rustpython_wasm_bg.wasm";

export type RuntimeState = "loading" | "ready" | "error";

export interface ExecutionResult {
	stdout: string;
	error: string | null;
}

let initialized = false;
let initPromise: Promise<void> | null = null;

export async function initPythonRuntime(): Promise<void> {
	if (initialized) return;

	if (initPromise) return initPromise;

	initPromise = (async () => {
		await init({ module_or_path: wasmUrl });
		initialized = true;
	})();

	return initPromise;
}

function buildPrelude(inputs: string[]): string {
	const inputsLiteral = JSON.stringify(inputs);
	return `\
import browser
import builtins

_input_queue = ${inputsLiteral}
_input_index = 0

def _custom_input(prompt=""):
    global _input_index
    if _input_index < len(_input_queue):
        result = _input_queue[_input_index]
        _input_index += 1
        return result
    return browser.prompt(prompt)

builtins.input = _custom_input
`;
}

export function executePython(code: string, inputs: string[]): ExecutionResult {
	if (!initialized) {
		return { stdout: "", error: "Python runtime not initialized" };
	}

	let stdout = "";
	let error: string | null = null;

	const fullCode = buildPrelude(inputs) + code;

	try {
		pyExec(fullCode, {
			stdout: (output: string) => {
				stdout += output;
			},
		});
	} catch (err) {
		if (err instanceof WebAssembly.RuntimeError) {
			const globalError = (globalThis as { __RUSTPYTHON_ERROR?: string })
				.__RUSTPYTHON_ERROR;
			error = globalError ?? String(err);
		} else {
			error = String(err);
		}
	}

	return { stdout, error };
}

export function isRuntimeReady(): boolean {
	return initialized;
}
