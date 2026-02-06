import { useCallback, useRef, useState } from "preact/hooks";
import { CodeEditor } from "./components/code-editor";
import { InputPanel } from "./components/input-panel";
import { OutputPanel } from "./components/output-panel";
import { RunButton } from "./components/run-button";
import { ThemeToggle } from "./components/theme-toggle";
import { usePython } from "./hooks/use-python";
import { useTheme } from "./hooks/use-theme";

const DEFAULT_CODE = `# Welcome to Your Python!
# Write your Python code here and click Run.

name = input("What is your name? ")
print(f"Hello, {name}!")

# Try some calculations
def square(n):
    return n ** 2

for i in range(1, 6):
    print(f"{i} squared is {square(i)}")
`;

export function App() {
	const { theme, preference, setPreference } = useTheme();
	const { state, execute } = usePython();
	const codeRef = useRef(DEFAULT_CODE);
	const [stdin, setStdin] = useState("");
	const [output, setOutput] = useState({
		stdout: "",
		error: null as string | null,
	});

	const handleCodeChange = useCallback((value: string) => {
		codeRef.current = value;
	}, []);

	const handleRun = useCallback(() => {
		if (state !== "ready") return;
		const inputs = stdin.split("\n");
		if (inputs.at(-1) === "") inputs.pop();
		const result = execute(codeRef.current, inputs);
		setOutput(result);
	}, [state, stdin, execute]);

	return (
		<div class="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
			<div class="w-200 mx-auto space-y-4">
				<header class="flex items-start justify-between">
					<div>
						<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
							Your Python
						</h1>
						<p class="text-gray-600 mt-2 dark:text-gray-400">
							A browser-based Python execution environment
						</p>
					</div>
					<ThemeToggle
						preference={preference}
						onPreferenceChange={setPreference}
					/>
				</header>

				<section>
					<CodeEditor
						initialValue={DEFAULT_CODE}
						onChange={handleCodeChange}
						theme={theme}
					/>
				</section>

				<section>
					<InputPanel value={stdin} onChange={setStdin} />
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
