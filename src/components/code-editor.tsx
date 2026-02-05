import { useCodeMirror } from "../hooks/use-code-mirror";

export interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ initialValue, onChange }: CodeEditorProps) {
  const { containerRef } = useCodeMirror({
    initialValue,
    onChange,
  });

  return (
    <div
      ref={containerRef as { current: HTMLDivElement | null }}
      class="border border-gray-300 rounded-md overflow-hidden"
    />
  );
}
