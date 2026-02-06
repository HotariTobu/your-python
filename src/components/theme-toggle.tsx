import type { ThemePreference } from "../hooks/use-theme";

export interface ThemeToggleProps {
	preference: ThemePreference;
	onPreferenceChange: (preference: ThemePreference) => void;
}

const options: { value: ThemePreference; label: string; icon: string }[] = [
	{
		value: "light",
		label: "Light",
		icon: "M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-5.364l-.707.707m-9.314 9.314l-.707.707m0-10.728l.707.707m9.314 9.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z",
	},
	{
		value: "system",
		label: "System",
		icon: "M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4m-6 0v4m0-4h6m-6 4h6",
	},
	{
		value: "dark",
		label: "Dark",
		icon: "M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z",
	},
];

export function ThemeToggle({
	preference,
	onPreferenceChange,
}: ThemeToggleProps) {
	return (
		<fieldset
			aria-label="Theme preference"
			class="flex gap-0.5 rounded-lg bg-gray-200 p-1 dark:bg-gray-700 border-none m-0"
		>
			{options.map(({ value, label, icon }) => (
				<button
					key={value}
					type="button"
					aria-label={label}
					onClick={() => onPreferenceChange(value)}
					class={`rounded-md p-1.5 transition-colors ${
						preference === value
							? "bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-gray-100"
							: "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
					}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<title>{label}</title>
						<path d={icon} />
					</svg>
				</button>
			))}
		</fieldset>
	);
}
