---
name: changelog-update
description: Draft a new CHANGELOG.md entry for marzipan. Reads the current version and existing changelog format, then generates a properly-structured entry for the changes you describe.
---

# Changelog Update

Draft a new `CHANGELOG.md` entry for the current marzipan release.

## Workflow

### 1. Gather context

Read these files in parallel:

- `CHANGELOG.md` — to match the exact format and tone of existing entries
- `package.json` — to get `version` (the version being released)

Check the current date with the system (today's date is used for the entry header).

### 2. Prompt the user for changes

Ask the user to describe (or confirm) the changes to include. Categories to consider:

- **Added** — new features, new exports, new plugins, new actions
- **Changed** — behavior changes, option renames, API modifications
- **Fixed** — bug fixes, documentation corrections
- **Removed** — deprecated items removed, breaking changes
- **Security** — vulnerability fixes

Skip empty categories.

### 3. Draft the entry

Follow this exact format from the existing changelog:

```markdown
## [VERSION] - YYYY-MM-DD

### Added

- **Feature Name**: Brief description of what was added and how it works.
  - Sub-detail if needed (indent with two spaces)
  - Another sub-detail

### Fixed

- **Fix Name**: What was broken and what was corrected.
```

Rules:

- Each item starts with `- **Bold Name**: description.`
- Use present tense for descriptions ("Adds…", "Fixes…", "Removes…")
- Be specific — name the function, plugin, class, or file affected
- Sub-bullets use two-space indent
- Section headers: `### Added`, `### Changed`, `### Fixed`, `### Removed`, `### Security`
- Place the new entry directly below `## [Unreleased]` and its `---` separator, above the previous release

### 4. Insert the entry

Insert the drafted entry into `CHANGELOG.md` at the correct position (below `## [Unreleased]\n\n---\n\n`).

Also update the `## [Unreleased]` section to be empty (no pending items) after inserting.

### 5. Confirm

Show the user the complete new entry and ask for any corrections before finalizing.
