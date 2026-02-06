import { useCodeMirror } from "../hooks/use-code-mirror";
import type { ResolvedTheme } from "../hooks/use-theme";

export interface CodeEditorProps {
	initialValue: string;
	onChange: (value: string) => void;
	theme: ResolvedTheme;
}

export function CodeEditor({ initialValue, onChange, theme }: CodeEditorProps) {
	const { containerRef } = useCodeMirror({
		initialValue,
		onChange,
		theme,
	});

	return (
		<div
			ref={containerRef as { current: HTMLDivElement | null }}
			class="border border-gray-300 rounded-md overflow-hidden dark:border-gray-600"
		/>
	);
}
