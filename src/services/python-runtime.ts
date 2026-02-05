import wasmUrl from "../wasm/rustpython_wasm_bg.wasm";
import init, { pyExec } from "../wasm/rustpython_wasm.js";

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

export function executePython(code: string): ExecutionResult {
  if (!initialized) {
    return { stdout: "", error: "Python runtime not initialized" };
  }

  let stdout = "";
  let error: string | null = null;

  try {
    pyExec(code, {
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
