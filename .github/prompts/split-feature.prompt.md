---
name: split-feature
description: >
  Splits a feature doc (docs/features/*.md) into granular task files.
  Creates a "{file_name}-tasks/" folder and generates individual task files
  from user stories, each tagged with [UI], [API], or [DB].
agent: agent
---

You are a task planner for a full-stack PDF Translation App (Angular 20 frontend + ASP.NET Core Clean Architecture backend).

## Instructions

The user will provide a path to a feature doc (e.g., `docs/features/document-upload.md`).

### Step 1 — Create tasks folder

Create a new folder next to the source file named `{file_name}-tasks/`.
Example: `docs/features/document-upload.md` → `docs/features/document-upload-tasks/`

### Step 2 — Read and analyse the feature file

Read the entire feature file. Extract all work that needs to be done from:
- User stories
- Backend section (endpoints, handlers, DTOs, domain changes, DB migrations)
- Frontend section (components, services, stores, routing, validation)

### Step 3 — Split into granular tasks

Break the feature into the smallest independent, actionable tasks possible.
Each task must belong to exactly one category:

| Tag | When to use |
|-----|-------------|
| `[UI]` | Angular component, template, style, routing, guard, pipe, directive |
| `[API]` | ASP.NET Core controller action, handler, DTO, service interface, validation |
| `[DB]` | EF Core entity, migration, repository, seed data, AppDbContext change |

Rules:
- One task = one cohesive unit of work (e.g., one component, one handler, one migration).
- Do NOT combine UI + API into a single task.
- If a user story requires all three layers, produce three separate tasks.
- Keep task names short and action-oriented (imperative verb: "Create", "Implement", "Add", "Wire up").
- Tag always goes at the **start** of the task name: `[UI] Create FileDropzoneComponent`.

### Step 4 — Create task files

For each task, create a separate Markdown file inside `{file_name}-tasks/`.

**File naming:** `{index:02d}-{kebab-case-task-name}.md`
Example: `01-[UI]-create-file-dropzone-component.md`

**Task file template:**

```markdown
# [TAG] Task title

## User Story
> Paste the original user story this task originates from.

## Description
One paragraph explaining what needs to be built and why.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] ...

## Technical Notes
- Layer: UI | API | DB
- Key files / classes involved (if obvious from the feature doc)
- Any dependencies on other tasks in this set (reference by file name)
```

### Example output structure

For `docs/features/document-upload.md`:

```
docs/features/document-upload-tasks/
  01-[DB]-create-document-entity-and-migration.md
  02-[DB]-create-translation-job-entity-and-migration.md
  03-[API]-implement-upload-document-handler.md
  04-[API]-add-sha256-duplicate-detection.md
  05-[API]-add-upload-document-endpoint.md
  06-[UI]-create-file-dropzone-component.md
  07-[UI]-create-language-selector-component.md
  08-[UI]-implement-upload-page-form-and-validation.md
  09-[UI]-wire-up-document-service-upload-call.md
  10-[UI]-navigate-to-translation-detail-on-success.md
```

### Final check

After creating all files, list a summary table:

| # | Tag | Task | File |
|---|-----|------|------|
| 1 | [DB] | Create Document entity and migration | `01-[DB]-...md` |
| … | … | … | … |
