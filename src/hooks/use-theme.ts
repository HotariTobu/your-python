import { useCallback, useEffect, useState } from "preact/hooks";
import {
	applyTheme,
	type ResolvedTheme,
	readStoredPreference,
	resolveTheme,
	STORAGE_KEY,
	type ThemePreference,
} from "../theme";

export type { ResolvedTheme, ThemePreference };

export interface UseThemeResult {
	theme: ResolvedTheme;
	preference: ThemePreference;
	setPreference: (preference: ThemePreference) => void;
}

export function useTheme(): UseThemeResult {
	const [preference, setPreferenceState] =
		useState<ThemePreference>(readStoredPreference);
	const [theme, setTheme] = useState<ResolvedTheme>(() =>
		resolveTheme(preference),
	);

	const setPreference = useCallback((newPref: ThemePreference) => {
		setPreferenceState(newPref);
		localStorage.setItem(STORAGE_KEY, newPref);
		const resolved = resolveTheme(newPref);
		setTheme(resolved);
		applyTheme(resolved);
	}, []);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handler = () => {
			if (preference !== "system") return;
			const resolved = resolveTheme("system");
			setTheme(resolved);
			applyTheme(resolved);
		};
		mediaQuery.addEventListener("change", handler);
		applyTheme(theme);
		return () => mediaQuery.removeEventListener("change", handler);
	}, [preference, theme]);

	return { theme, preference, setPreference };
}
