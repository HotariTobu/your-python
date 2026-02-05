import { useEffect, useRef, useState, useCallback } from "preact/hooks";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";

export interface UseCodeMirrorOptions {
  initialValue?: string;
  onRunRequest?: () => void;
}

export interface UseCodeMirrorResult {
  containerRef: { current: HTMLElement | null };
  getValue: () => string;
}

const autoHeightTheme = EditorView.theme({
  "&": { height: "auto" },
  ".cm-scroller": { overflow: "visible" },
});

export function useCodeMirror(
  options: UseCodeMirrorOptions = {}
): UseCodeMirrorResult {
  const { initialValue = "", onRunRequest } = options;
  const containerRef = useRef<HTMLElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!containerRef.current || viewRef.current) return;

    const extensions = [
      basicSetup,
      python(),
      indentUnit.of("    "),
      autoHeightTheme,
      keymap.of([indentWithTab]),
    ];

    if (onRunRequest) {
      extensions.push(
        keymap.of([
          {
            key: "Ctrl-Enter",
            mac: "Cmd-Enter",
            run: () => {
              onRunRequest();
              return true;
            },
          },
        ])
      );
    }

    const state = EditorState.create({
      doc: initialValue,
      extensions,
    });

    viewRef.current = new EditorView({
      state,
      parent: containerRef.current,
    });

    setIsInitialized(true);

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [initialValue, onRunRequest]);

  const getValue = useCallback((): string => {
    return viewRef.current?.state.doc.toString() ?? "";
  }, [isInitialized]);

  return { containerRef, getValue };
}
