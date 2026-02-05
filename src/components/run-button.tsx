export type PythonState = "loading" | "ready" | "error";

export interface RunButtonProps {
	onClick: () => void;
	state: PythonState;
}

export function RunButton({ onClick, state }: RunButtonProps) {
	const isDisabled = state !== "ready";

	const buttonContent = {
		loading: "Loading...",
		error: "Error",
		ready: "Run",
	}[state];

	const buttonClass = {
		loading: "bg-blue-500 cursor-wait",
		error: "bg-red-500 cursor-not-allowed",
		ready: "bg-green-600 hover:bg-green-700",
	}[state];

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={isDisabled}
			class={`px-6 py-2 text-white font-medium rounded-md transition-colors disabled:opacity-80 ${buttonClass}`}
		>
			{buttonContent}
		</button>
	);
}
