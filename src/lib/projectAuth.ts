/**
 * Lightweight client-side gate for project pages.
 *
 * NOTE: This is a soft gate intended to keep casual visitors out of
 * work-in-progress project pages — the password lives in the bundle, so it is
 * not a real security boundary. Once unlocked, the state is kept in
 * sessionStorage so the visitor isn't prompted again for the rest of the tab
 * session.
 */
const STORAGE_KEY = 'project-unlocked';
const PROJECT_PASSWORD = 'goodtools';

export function isProjectUnlocked(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/** Returns true and persists the unlock when the password matches. */
export function tryUnlockProject(password: string): boolean {
  if (password === PROJECT_PASSWORD) {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* sessionStorage unavailable — unlock for this navigation only */
    }
    return true;
  }
  return false;
}
