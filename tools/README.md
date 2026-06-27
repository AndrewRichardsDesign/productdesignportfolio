# Project doc sync

`sync-project-docs.gs` is a Google Apps Script that mirrors live portfolio
content into each project's Google Doc **"Project Page"** tab. One-way:
GitHub → Docs. It is **not** part of the site build.

## How the mapping works

The script reads `src/content/site-content.json` from GitHub and iterates the
**`projectDocs`** map in that file:

```json
"projectDocs": {
  "arcatext":   "<google-doc-id>",
  "usaa":       "<google-doc-id>",
  "memberHome": "<google-doc-id>",
  "conversant": "<google-doc-id>"
}
```

Each key is a project-page content key; each value is the Google Doc ID whose
`Project Page` tab should mirror it. The renderer is generic, so it handles any
section shape that follows the existing authoring patterns.

## Adding a new project later

1. Build the new project page (new content key in `site-content.json`).
2. Add one line to `projectDocs`: `"<contentKey>": "<googleDocId>"`.
3. Make sure that Google Doc has a tab titled exactly `Project Page`.

That's it — no script changes. `syncAllProjects` also logs any project page it
finds in the content that isn't mapped yet, so nothing gets silently skipped.

## Setup (one time)

1. [script.google.com](https://script.google.com) → **New project** → paste
   `sync-project-docs.gs`.
2. **Project Settings → Script Properties**:
   - `GH_BRANCH` = `main`
   - `GH_TOKEN` = a GitHub fine-grained PAT with **Contents: Read-only** on this
     repo (required because the repo is private).
3. Run `listTabs` once (authorize when prompted) to confirm each doc has a
   `Project Page` tab.
4. Run `syncAllProjects`.
5. Optional automation: **Triggers** → time-driven trigger for **`syncIfChanged`**
   (not `syncAllProjects`). `syncIfChanged` only rewrites the docs when
   `site-content.json` has a new commit, so it's cheap to run on a short
   minutes timer (e.g. every 5–10 min) for near-real-time updates without
   churning the docs when nothing changed. Use `syncAllProjects` to force a
   full re-sync manually.

## Functions

- **`syncAllProjects`** — force-sync every mapped project now.
- **`syncIfChanged`** — sync only if the content commit changed (trigger target).
- **`listTabs`** — print each mapped doc's tab titles (verification).

## Notes

- It **overwrites** the entire `Project Page` tab each run — GitHub is the source
  of truth. Other tabs are untouched.
- It only sees committed content, so click **Save to GitHub** in admin mode
  (with the admin bar's branch set to `main`) before syncing.
