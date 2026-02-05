import { useState, useRef, useCallback } from "preact/hooks";
import { usePython } from "./hooks/use-python";
import { CodeEditor } from "./components/code-editor";
import { RunButton } from "./components/run-button";
import { OutputPanel } from "./components/output-panel";

const DEFAULT_CODE = `# Welcome to Your Python!
# Write your Python code here and click Run.

def greet(name):
    return f"Hello, {name}!"

print(greet("World"))

# Try some calculations
for i in range(1, 6):
    print(f"{i} squared is {i ** 2}")
`;

export function App() {
  const { state, execute } = usePython();
  const [output, setOutput] = useState({ stdout: "", error: null as string | null });
  const getValueRef = useRef<(() => string) | null>(null);

  const handleRun = useCallback(() => {
    if (state !== "ready" || !getValueRef.current) return;
    const code = getValueRef.current();
    const result = execute(code);
    setOutput(result);
  }, [state, execute]);

  return (
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="w-[800px] mx-auto space-y-4">
        <header class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Your Python</h1>
          <p class="text-gray-600 mt-2">
            A browser-based Python execution environment
          </p>
          {state === "loading" && (
            <p class="text-blue-600 mt-2">Loading Python runtime...</p>
          )}
          {state === "error" && (
            <p class="text-red-600 mt-2">Failed to load Python runtime</p>
          )}
          {state === "ready" && (
            <p class="text-green-600 mt-2">Python Ready</p>
          )}
        </header>

        <section>
          <CodeEditor
            initialValue={DEFAULT_CODE}
            onRunRequest={handleRun}
            getValueRef={getValueRef}
          />
        </section>

        <section class="flex justify-center">
          <RunButton onClick={handleRun} disabled={state !== "ready"} />
        </section>

        <section>
          <OutputPanel stdout={output.stdout} error={output.error} />
        </section>
      </div>
    </div>
  );
}
