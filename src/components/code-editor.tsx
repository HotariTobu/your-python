import { useCodeMirror } from "../hooks/use-code-mirror";

export interface CodeEditorProps {
  initialValue?: string;
  onRunRequest?: () => void;
  getValueRef?: { current: (() => string) | null };
}

export function CodeEditor({
  initialValue,
  onRunRequest,
  getValueRef,
}: CodeEditorProps) {
  const { containerRef, getValue } = useCodeMirror({
    initialValue,
    onRunRequest,
  });

  if (getValueRef) {
    getValueRef.current = getValue;
  }

  return (
    <div
      ref={containerRef as { current: HTMLDivElement | null }}
      class="border border-gray-300 rounded-md overflow-hidden"
    />
  );
}
