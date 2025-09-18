import { Settings, SessionState } from "@/lib/types";

const SETTINGS_KEY = "settings";
const SESSION_KEY = "lastSession";

export function loadSettings(): Settings | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(SETTINGS_KEY);
		return raw ? (JSON.parse(raw) as Settings) : null;
	} catch {
		return null;
	}
}

export function saveSettings(settings: Settings) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
	} catch {}
}

export function loadSession(): SessionState | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(SESSION_KEY);
		return raw ? (JSON.parse(raw) as SessionState) : null;
	} catch {
		return null;
	}
}

export function saveSession(session: SessionState) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
	} catch {}
}

export function resetSession() {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(SESSION_KEY);
	} catch {}
} 