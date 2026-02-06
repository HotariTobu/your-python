export interface OutputPanelProps {
	stdout: string;
	error: string | null;
}

export function OutputPanel({ stdout, error }: OutputPanelProps) {
	return (
		<div class="space-y-4">
			{error && (
				<div>
					<h3 class="text-sm font-medium text-red-700 mb-2 dark:text-red-400">
						Error
					</h3>
					<pre class="bg-red-50 text-red-800 p-4 rounded-md font-mono text-sm whitespace-pre-wrap dark:bg-red-950 dark:text-red-300">
						{error}
					</pre>
				</div>
			)}
			{stdout && (
				<div>
					<h3 class="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
						Output
					</h3>
					<pre class="bg-gray-100 p-4 rounded-md font-mono text-sm whitespace-pre-wrap dark:bg-gray-800 dark:text-gray-100">
						{stdout}
					</pre>
				</div>
			)}
			{!stdout && !error && (
				<div class="text-gray-500 text-sm italic dark:text-gray-400">
					Run your code to see output here.
				</div>
			)}
		</div>
	);
}
