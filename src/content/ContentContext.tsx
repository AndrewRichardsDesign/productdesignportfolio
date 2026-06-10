import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { SiteContent } from './types';
import defaultContent from './site-content.json';

/**
 * Where the content lives in the repo and which repo/branch admin edits commit to.
 * The save target branch can be overridden from the admin bar at runtime.
 */
const CONTENT_PATH = 'src/content/site-content.json';
const REPO_OWNER = 'AndrewRichardsDesign';
const REPO_NAME = 'productdesignportfolio';
const DEFAULT_BRANCH = 'main';

const DRAFT_KEY = 'pdp.content.draft';
const TOKEN_KEY = 'pdp.admin.token';
const BRANCH_KEY = 'pdp.admin.branch';

export type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string };

interface ContentContextValue {
  content: SiteContent;
  isAdmin: boolean;
  dirty: boolean;
  token: string;
  branch: string;
  saveState: SaveState;
  setText: (path: string, value: string | number) => void;
  setToken: (token: string) => void;
  setBranch: (branch: string) => void;
  save: () => Promise<void>;
  discardChanges: () => void;
}

const ContentContext = createContext<ContentContextValue | null>(null);

/** Read a nested value out of an object using a dot path like "hero.stats.0.label". */
function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

/** Immutably set a nested value using a dot path, cloning each level along the way. */
function setByPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.');
  const clone: unknown = Array.isArray(obj) ? [...obj] : { ...(obj as object) };
  let cursor = clone as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const next = cursor[key];
    cursor[key] = Array.isArray(next) ? [...next] : { ...(next as object) };
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[keys[keys.length - 1]] = value;
  return clone as T;
}

/** Base64-encode a UTF-8 string (btoa only handles latin1 on its own). */
function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function readDraft(): SiteContent | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as SiteContent) : null;
  } catch {
    return null;
  }
}

export function ContentProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: ReactNode;
}) {
  const base = defaultContent as SiteContent;
  const [content, setContent] = useState<SiteContent>(() => readDraft() ?? base);
  const [dirty, setDirty] = useState<boolean>(() => readDraft() != null);
  const [token, setTokenState] = useState<string>(() => localStorage.getItem(TOKEN_KEY) ?? '');
  const [branch, setBranchState] = useState<string>(
    () => localStorage.getItem(BRANCH_KEY) ?? DEFAULT_BRANCH
  );
  const [saveState, setSaveState] = useState<SaveState>({ status: 'idle' });

  const setText = useCallback((path: string, value: string | number) => {
    setContent((prev) => {
      const current = getByPath(prev, path);
      if (current === value) return prev;
      const next = setByPath(prev, path, value);
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      } catch {
        /* ignore quota errors */
      }
      return next;
    });
    setDirty(true);
    setSaveState({ status: 'idle' });
  }, []);

  const setToken = useCallback((value: string) => {
    setTokenState(value);
    try {
      if (value) localStorage.setItem(TOKEN_KEY, value);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const setBranch = useCallback((value: string) => {
    const next = value.trim() || DEFAULT_BRANCH;
    setBranchState(next);
    try {
      localStorage.setItem(BRANCH_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const discardChanges = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setContent(base);
    setDirty(false);
    setSaveState({ status: 'idle' });
  }, [base]);

  const save = useCallback(async () => {
    if (!token) {
      setSaveState({ status: 'error', message: 'Enter a GitHub token first.' });
      return;
    }
    setSaveState({ status: 'saving' });
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONTENT_PATH}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    try {
      // Look up the current file SHA so GitHub accepts the update.
      let sha: string | undefined;
      const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
      if (getRes.ok) {
        const data = (await getRes.json()) as { sha?: string };
        sha = data.sha;
      } else if (getRes.status !== 404) {
        throw new Error(`Could not read existing file (${getRes.status}).`);
      }

      const json = `${JSON.stringify(content, null, 2)}\n`;
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'Update site content via admin mode',
          content: utf8ToBase64(json),
          branch,
          sha,
        }),
      });

      if (!putRes.ok) {
        let detail = `${putRes.status}`;
        try {
          const err = (await putRes.json()) as { message?: string };
          if (err.message) detail = err.message;
        } catch {
          /* ignore */
        }
        if (putRes.status === 401 || putRes.status === 403) {
          detail = 'Authentication failed — check the token has "Contents: write" on this repo.';
        }
        throw new Error(detail);
      }

      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      setDirty(false);
      setSaveState({
        status: 'success',
        message: `Committed to ${branch}. The live site updates on the next build.`,
      });
    } catch (e) {
      setSaveState({
        status: 'error',
        message: e instanceof Error ? e.message : 'Save failed.',
      });
    }
  }, [token, branch, content]);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      isAdmin,
      dirty,
      token,
      branch,
      saveState,
      setText,
      setToken,
      setBranch,
      save,
      discardChanges,
    }),
    [content, isAdmin, dirty, token, branch, saveState, setText, setToken, setBranch, save, discardChanges]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return ctx;
}

// Re-exported so the admin bar can show the user where edits land.
export const ADMIN_TARGET = { owner: REPO_OWNER, repo: REPO_NAME, path: CONTENT_PATH };
