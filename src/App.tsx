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
      <div class="w-200 mx-auto space-y-4">
        <header>
          <h1 class="text-3xl font-bold text-gray-900">Your Python</h1>
          <p class="text-gray-600 mt-2">
            A browser-based Python execution environment
          </p>
        </header>

        <section>
          <CodeEditor
            initialValue={DEFAULT_CODE}
            onRunRequest={handleRun}
            getValueRef={getValueRef}
          />
        </section>

        <section class="grid">
          <RunButton onClick={handleRun} state={state} />
        </section>

        <section>
          <OutputPanel stdout={output.stdout} error={output.error} />
        </section>
      </div>
    </div>
  );
}
