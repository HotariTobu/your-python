import { indentWithTab } from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { indentUnit } from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useRef } from "preact/hooks";
import type { ResolvedTheme } from "./use-theme";

export interface UseCodeMirrorOptions {
	initialValue: string;
	onChange: (value: string) => void;
	theme: ResolvedTheme;
}

export interface UseCodeMirrorResult {
	containerRef: { current: HTMLElement | null };
}

const autoHeightTheme = EditorView.theme({
	"&": { height: "auto" },
	".cm-scroller": { overflow: "visible" },
});

function editorTheme(theme: ResolvedTheme) {
	return theme === "dark" ? oneDark : [];
}

export function useCodeMirror(
	options: UseCodeMirrorOptions,
): UseCodeMirrorResult {
	const valueRef = useRef(options.initialValue);
	const containerRef = useRef<HTMLElement | null>(null);
	const viewRef = useRef<EditorView | null>(null);
	const themeCompartment = useRef(new Compartment());

	useEffect(() => {
		if (!containerRef.current || viewRef.current) return;

		const extensions = [
			basicSetup,
			python(),
			indentUnit.of("    "),
			autoHeightTheme,
			keymap.of([indentWithTab]),
			themeCompartment.current.of(editorTheme(options.theme)),
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

	useEffect(() => {
		viewRef.current?.dispatch({
			effects: themeCompartment.current.reconfigure(editorTheme(options.theme)),
		});
	}, [options.theme]);

	return { containerRef };
}
