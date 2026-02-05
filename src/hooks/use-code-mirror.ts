import { indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { indentUnit } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useRef } from "preact/hooks";

export interface UseCodeMirrorOptions {
	initialValue: string;
	onChange: (value: string) => void;
}

export interface UseCodeMirrorResult {
	containerRef: { current: HTMLElement | null };
}

const autoHeightTheme = EditorView.theme({
	"&": { height: "auto" },
	".cm-scroller": { overflow: "visible" },
});

export function useCodeMirror(
	options: UseCodeMirrorOptions,
): UseCodeMirrorResult {
	const valueRef = useRef(options.initialValue);
	const containerRef = useRef<HTMLElement | null>(null);
	const viewRef = useRef<EditorView | null>(null);

	useEffect(() => {
		if (!containerRef.current || viewRef.current) return;

		const extensions = [
			basicSetup,
			python(),
			indentUnit.of("    "),
			autoHeightTheme,
			keymap.of([indentWithTab]),
			EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					valueRef.current = update.state.doc.toString();
					options.onChange(valueRef.current);
				}
			}),
		];

		const state = EditorState.create({
			doc: valueRef.current,
			extensions,
		});

		viewRef.current = new EditorView({
			state,
			parent: containerRef.current,
		});

		return () => {
			viewRef.current?.destroy();
			viewRef.current = null;
		};
	}, [options.onChange]);

	return { containerRef };
}
