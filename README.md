# Subgraph monorepo

Monorepo for all Tapioca subgraphs.

## **Setup**

### Prerequisites
- node version `18+` (only even major version numbers are supported)
- pnpm version `v8.3.0+`
- [goldsky](https://docs.goldsky.com/introduction) latest version

### Install dependencies
```bash
pnpm install
```

# **Git rules**

_Note: this section will be updated in the future._

- Branch off of `dev`
- Create PR to `dev`
- `dev` -> `main`

## Git messages

Please using following pattern as commit messages.

```
<emoji> <type>: <short summary>
   │       │           │
   │       │           └─⫸ Summary in present tense. Not capitalized. No period at the end.
   │       │
   │       │
   │       └─⫸ Commit Type: feat|wip|fix|docs|refactor|test|chore
   │
   │
   └─⫸ Commit Type Emoji: ⭐|✏️|🔧|📕|♻️|🧪|🎨|💾
```

### Type and Emoji

- ⭐ feat: add a new feature
- ✏️ wip: feature in progress
- 🔧 fix: fix a bug
- 📕 docs: documentation or README changes
- ♻️ refactor: refactor code without changing public API
- 🧪 test: implement ot change tests
- 🎨 style: changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
- 💾 chore: update codebase without directly impacting written code (ex: bump a dependency, CI/CD change, lint, etc.).

### Short summary

Use the short summary field to provide a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

Inspired by angular's [CONTRIB.md](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit).

# **Recommended VS code `settings.json` file**
To allow for best formatting and linting experience, you may use following `settings.json` file. Place it in `.vscode` folder in the root of **each app or package**.
```
{
  "editor.codeActionsOnSave": [
    "source.fixAll"
  ],
  "editor.formatOnPaste": true,
  "editor.formatOnType": true,
  "editor.formatOnSave": true,
  "editor.formatOnSaveMode": "file",
  "[typescript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "git.openRepositoryInParentFolders": "always",
}
```