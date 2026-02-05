import { useState, useEffect, useCallback } from "preact/hooks";
import {
  RuntimeState,
  ExecutionResult,
  initPythonRuntime,
  executePython,
} from "../services/python-runtime";

export interface UsePythonResult {
  state: RuntimeState;
  execute: (code: string, inputs: string[]) => ExecutionResult;
}

export function usePython(): UsePythonResult {
  const [state, setState] = useState<RuntimeState>("loading");

  useEffect(() => {
    initPythonRuntime()
      .then(() => setState("ready"))
      .catch((err) => {
        console.error("Failed to initialize Python runtime:", err);
        setState("error");
      });
  }, []);

  const execute = useCallback((code: string, inputs: string[]): ExecutionResult => {
    if (state !== "ready") {
      return { stdout: "", error: "Python runtime not ready" };
    }
    return executePython(code, inputs);
  }, [state]);

  return { state, execute };
}
