<div align="center">

# <span style="color:#B8F34A;"><h2>Reprise<h2></span>

### <span style="color:#B8F34A;">Your workflow, ready when you are.</span>

Save and restore your browser sessions without losing your tabs, windows, or context.

</div>

---

## <span style="color:#B8F34A;">What is Reprise?</span>

Reprise is a local-first browser extension I built to save and restore browser workspaces.

When working on a project, researching a topic, or juggling multiple tasks, it’s easy to lose track of the tabs and windows you had open. Reprise lets you save that setup and return to it whenever you need it.

## <span style="color:#B8F34A;">Features</span>

| Feature | Description |
|---|---|
| 🗂️ **Save workspaces** | Save tabs from all open browser windows |
| 🔄 **Restore sessions** | Reopen saved windows and tabs |
| 📝 **Add context** | Save a session name, context, and next step |
| ✨ **Local summaries** | Generate simple summaries from tab titles and domains |
| 🧹 **Manage sessions** | View and delete saved sessions |
| 🔒 **Local-first** | No account, backend, or external service required |

## <span style="color:#B8F34A;">Installation</span>

1. Clone or download this repository.
2. Open Chrome or another Chromium-based browser.
3. Visit:

   ```text
   chrome://extensions
   ```

4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the folder containing `manifest.json`.

### Firefox

Firefox uses the WebExtensions system, so some compatibility changes may be required.

To test the extension:

1. Open Firefox.
2. Visit:

   ```text
   about:debugging#/runtime/this-firefox
   ```

3. Click **Load Temporary Add-on**.
4. Select the `manifest.json` file.

## <span style="color:#B8F34A;">Project Structure</span>

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

## <span style="color:#B8F34A;">Privacy</span>

Reprise is designed to work locally.

It uses:

- `tabs` to read tab information
- `windows` to save and restore window groups
- `storage` to save sessions locally

The current version does not send browsing data to a server or require an account.

## <span style="color:#B8F34A;">Limitations</span>

- Chrome internal pages such as `chrome://` pages cannot be saved normally.
- Sessions are stored separately for each browser profile.
- Summaries are based on tab titles and domains.
- Reprise does not save passwords, cookies, or page contents.

## <span style="color:#B8F34A;">Tech Stack</span>

- HTML
- CSS
- JavaScript
- Chrome Extensions Manifest V3
- Chrome Storage API

## <span style="color:#B8F34A;">License</span>

MIT License
