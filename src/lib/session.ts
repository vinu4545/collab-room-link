import type { TerminalSession } from "./terminal.schemas";

const KEY = "terminal-session";

export function saveSession(session: TerminalSession) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function readSession(): TerminalSession | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TerminalSession) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
