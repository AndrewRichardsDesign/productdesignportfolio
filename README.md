# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Admin mode (inline content editing)

All landing-page copy lives in [`src/content/site-content.json`](src/content/site-content.json)
and is rendered through an editable layer, so you can edit the site directly in the browser
and commit the changes back to this repo.

### How it works

1. **Open admin mode:** visit the site with `#/admin` in the URL
   (e.g. `https://your-site/#/admin`). A floating admin bar appears. To edit the **Arcatext
   case-study page**, add `?admin` to its URL instead: `https://your-site/#/arcatext?admin`.
2. **Edit:** every editable piece of text gets a dashed outline. Click any of it and type.
   Press **Enter** to confirm a single-line field, or click away to finish. Changes are kept
   in your browser as a draft (they survive a refresh) until you save.
3. **Save to GitHub:** paste a GitHub **fine-grained personal access token** into the admin
   bar and click **Save to GitHub**. This commits the updated `site-content.json` to the repo.
   The live site picks up the new copy on its next build/deploy.

### Creating the token

Create a [fine-grained personal access token](https://github.com/settings/tokens?type=beta)
scoped to **only this repository**, with:

- **Repository access:** Only select repositories → this repo
- **Permissions:** **Contents → Read and write**

The token is stored only in your own browser's `localStorage` (key `pdp.admin.token`) and is
sent directly to the GitHub API — it is never committed or shared. You can change the target
branch (default `main`) in the admin bar.

### Notes

- Anyone who knows the `#/admin` URL can *open* the editor, but they cannot save anything
  without a valid token that has write access to the repo.
- To add more editable fields, add the value to `site-content.json` (and its type in
  `src/content/types.ts`), then render it with `<Editable path="..." />`.


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
