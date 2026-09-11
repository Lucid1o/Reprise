# Reprise

**Your workflow, ready when you are.**

Reprise is a local-first Chrome extension that helps you save and restore browser sessions, including tabs across multiple windows.

![Reprise preview](assets/reprise-preview.png)

## Why Reprise?

When working on a project, research task, or assignment, it is easy to lose track of the tabs and windows you had open.

Reprise lets you save that workspace and return to it later without opening everything again.

## Features

- Save tabs from all open browser windows
- Restore saved windows and tabs
- Add a session name, context, and next step
- Generate simple summaries locally
- View and delete saved sessions
- No account or backend required
- No AI API or external service
- Data stays in Chrome's local storage

## How to use

1. Open the tabs and windows you want to save.
2. Click the Reprise extension icon.
3. Add a session name, context, or next step if needed.
4. Click **Save session**.
5. Open **View saved sessions** whenever you want to return.
6. Click **Restore** to reopen the workspace.

## Installation

1. Download or clone this repository.
2. Open Chrome and go to:

   ```text
   chrome://extensions
   ```

3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the folder containing `manifest.json`.

## Project structure

```text
reprise/
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── summarizer.js
├── assets/
│   └── reprise-preview.png
└── icons/
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

## Privacy

Reprise is designed to work locally.

It uses:

- `tabs` to read tab information
- `windows` to save and restore window groups
- `storage` to save sessions locally

The current version does not send browsing data to a server or require an account.

## Limitations

- Chrome internal pages such as `chrome://` pages cannot be saved normally.
- Sessions are stored separately for each Chrome profile.
- The local summary is based on tab titles and domains.
- Reprise does not save passwords, cookies, or page contents.

## Tech stack

- HTML
- CSS
- JavaScript
- Chrome Extensions Manifest V3
- Chrome Storage API

## License

MIT License.
