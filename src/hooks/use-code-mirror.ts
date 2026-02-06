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
	theme: ResolvedTheme;
	onChange: (value: string) => void;
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
	const listenerCompartment = useRef(new Compartment());

	useEffect(() => {
		if (!containerRef.current || viewRef.current) return;

		const extensions = [
			basicSetup,
			python(),
			indentUnit.of("    "),
			autoHeightTheme,
			keymap.of([indentWithTab]),
			themeCompartment.current.of([]),
			listenerCompartment.current.of([]),
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
	}, []);

	useEffect(() => {
		viewRef.current?.dispatch({
			effects: themeCompartment.current.reconfigure(editorTheme(options.theme)),
		});
	}, [options.theme]);

	useEffect(() => {
		viewRef.current?.dispatch({
			effects: listenerCompartment.current.reconfigure(
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						options.onChange(update.state.doc.toString());
					}
				}),
			),
		});
	}, [options.onChange]);

	return { containerRef };
}
