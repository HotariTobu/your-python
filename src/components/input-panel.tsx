import { useState } from "preact/hooks";

export interface InputPanelProps {
	value: string;
	onChange: (value: string) => void;
}

export function InputPanel({ value, onChange }: InputPanelProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<button
				type="button"
				class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span>Input</span>
				<span class="text-xs text-gray-400 dark:text-gray-500">
					{isOpen ? "▼" : "◀︎"}
				</span>
			</button>
			{isOpen && (
				<div>
					<div class="bg-gray-100 p-4 rounded-md dark:bg-gray-800">
						<textarea
							class="block w-full min-h-[3lh] bg-transparent font-mono text-sm resize-none border-none outline-none m-0 p-0 text-gray-900 dark:text-gray-100"
							style={{ fieldSizing: "content" }}
							placeholder="Enter input values, one per line..."
							value={value}
							onInput={(e) => onChange((e.target as HTMLTextAreaElement).value)}
						/>
					</div>
					<p class="text-xs text-gray-500 mt-1 dark:text-gray-400">
						Each line is used as input for input() calls. Falls back to prompt
						if exhausted.
					</p>
				</div>
			)}
		</div>
	);
}
