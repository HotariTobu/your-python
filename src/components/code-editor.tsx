import { useCodeMirror } from "../hooks/use-code-mirror";
import type { ResolvedTheme } from "../hooks/use-theme";

export interface CodeEditorProps {
	initialValue: string;
	theme: ResolvedTheme;
	onChange: (value: string) => void;
}

export function CodeEditor({ initialValue, theme, onChange }: CodeEditorProps) {
	const { containerRef } = useCodeMirror({
		initialValue,
		theme,
		onChange,
	});

	return (
		<div
			ref={containerRef as { current: HTMLDivElement | null }}
			class="border border-gray-300 rounded-md overflow-hidden dark:border-gray-600"
		/>
	);
}
