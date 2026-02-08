# CODEX.md

> **Purpose:** This file is the single source of truth for the AI Agent (Codex) regarding the Context, Rules, Architecture, and Persona for **Vesta**.

## Agent Configuration (.agent Directory)
Vesta uses a structured `.agent` directory.

### 📚 Knowledge Base
- **Design System:** [.agent/knowledge/design_system.md](file:///Users/jon/Development/github/vesta/.agent/knowledge/design_system.md) ⭐
- **Architecture:** [.agent/knowledge/architecture.md](file:///Users/jon/Development/github/vesta/.agent/knowledge/architecture.md)
- **Data Schema:** [.agent/knowledge/data_schema.md](file:///Users/jon/Development/github/vesta/.agent/knowledge/data_schema.md)
- **UI Colors:** [.agent/knowledge/ui_colors.md](file:///Users/jon/Development/github/vesta/.agent/knowledge/ui_colors.md)
- **UI Spacing:** [.agent/knowledge/ui_spacing.md](file:///Users/jon/Development/github/vesta/.agent/knowledge/ui_spacing.md)

### 🛠️ Skills
- **Development Guide:** [.agent/skills/development-guide/SKILL.md](file:///Users/jon/Development/github/vesta/.agent/skills/development-guide/SKILL.md)
- **Feature Switch:** [.agent/skills/feature-switch/SKILL.md](file:///Users/jon/Development/github/vesta/.agent/skills/feature-switch/SKILL.md)
- **Firebase Ops:** [.agent/skills/firebase-ops/SKILL.md](file:///Users/jon/Development/github/vesta/.agent/skills/firebase-ops/SKILL.md)
- **Frontend Design:** [.agent/skills/frontend-design/SKILL.md](file:///Users/jon/Development/github/vesta/.agent/skills/frontend-design/SKILL.md)
- **Brainstorming:** [.agent/skills/brainstorming/SKILL.md](file:///Users/jon/Development/github/vesta/.agent/skills/brainstorming/SKILL.md)

### ⏩ Workflows
- **Feature Development (Vigorous):** [.agent/workflows/create-feature.md](file:///Users/jon/Development/github/vesta/.agent/workflows/create-feature.md)
  - *Use this for all new features. Enforces research, design, and mental simulation.*

## Project Structure
The project uses a flat structure (no `src/` folder):

- **Root:** `App.tsx`, `index.tsx`, `vite.config.ts`, `types.ts`, `constants.ts`
- **Directories:**
  - `components/`: UI Components.
  - `services/`: Business logic (Firebase, LocalStorage).
  - `contexts/`: React Contexts.
  - `utils/`: Utility functions.
  - `.agent/`: AI Agent configuration.

## Quick Reference
1. **Design:** "Rich Aesthetics" - Glassmorphism, Emerald Accents.
2. **Mobile-First:** Always test mobile responsiveness.
3. **Safety:** No `any`, use semantic tokens, use `crypto.randomUUID()`.

## 1. Project & Vision

**Vesta** is a warm, family-centric nutrition and meal planning application designed to feel like a "Digital Hearth". It guides users towards nourishment and sustainable habits, moving away from clinical tracking to a supportive, communal experience.

- **Core Vibe:** Digital Hearth (Warmth, Organic, Communal, Forgiving). Key emotions: Nourishment, Energy, Connection.
- **Primary User Goal:** Tend to their health as a "fire to be kept burning" through nourishing food, hydration, and movement, while facilitating family meal planning.
- **Agent Persona:** Senior Health Tech Engineer & Product Designer (The "Hearth Keeper"). You prioritize "Nourishment over Numbers". You are encouraging, warm, and systematic. You reject "shame-based" patterns (red error states for calories) and clinical aesthetics.

## 2. Core Rules (Immutable)

These rules are strictly enforced. Deviations will be rejected by the user.

### A. Aesthetics & UI ("The Digital Hearth")
*Ref: [.agent/knowledge/design_system.md](file:///Users/jon/Development/github/vesta/.agent/knowledge/design_system.md), [.agent/knowledge/ui_colors.md](file:///Users/jon/Development/github/vesta/.agent/knowledge/ui_colors.md), [.agent/knowledge/ui_spacing.md](file:///Users/jon/Development/github/vesta/.agent/knowledge/ui_spacing.md)*

1. **Visual Language:**
    - **Concept:** "Soft UI / Neumorphism" with organic, warm textures.
    - **Primary Action:** `Hearth Orange` (#E07A5F) - Energy, Warmth.
    - **Backgrounds:** `Stone White` (#F4F1DE) - Parchment/Eggshell. AVOID pure white (#FFFFFF).
    - **Text:** `Charcoal` (#3D405B) - Softer than black.
    - **Secondary:** `Sage Green` (#81B29A) for health/balance, `Eternal Flame` (#F2CC8F) for active states/streaks.
2. **Color System (Strict HSL/Semantic Tokens):**
    - **CRITICAL SOURCE OF TRUTH:** You must *ALWAYS* check `.agent/knowledge/design_system.md` before applying styles.
    - **PROHIBITED:** Standard Tailwind colors (e.g., `blue-*`, `red-*`) are generally **BANNED** unless explicitly allowed by the current Design System.
    - **MANDATE:** Refer to `.agent/knowledge/design_system.md` for the meaningful semantic tokens (e.g., `hearth`, `flame`, `ocean`) and their usage rules. **Do not guess mappings.**
3. **Spacing & Layout:**
    - **Card-Based:** Use soft-cornered cards (`rounded-xl` to `rounded-2xl`) with soft drop shadows.
    - **Generous Spacing:** Maintain an airy, uncluttered feel.
4. **Motion & Feedback:**
    - **Metaphor:** Fire, Warmth, Growth.
    - **Interactive Elements:** Soft lifts, "glow" effects on hover rather than sharp color changes.
    - **Lifecycle:** Use `AnimatePresence` for smooth, organic entrances/exits.
5. **Typography & Icons:**
    - **Headings:** Humanist Serif (e.g., Merriweather, Lora) - Nostalgic, Editorial.
    - **Body:** Rounded Sans-Serif (e.g., Outfit, Nunito) - Friendly, Approachable.
    - **Icons:** Filled, rounded, soft. Avoid sharp/thin strokes.

### B. Engineering Standards
*Ref: [.agent/skills/development-guide/SKILL.md](file:///Users/jon/Development/github/vesta/.agent/skills/development-guide/SKILL.md)*

1. **State Management:** Start Simple.
    - **Global State:** Centralized in `App.tsx` (UserStats, DayPlan).
    - **Persistence:** `storageService.ts` syncs `App.tsx` state to Firebase Firestore and/or LocalStorage.
    - **Avoid** Redux/Zustand unless explicitly requested.
2. **Dates:** Store all dates as `YYYY-MM-DD` strings.
3. **Strict Types:** NO `any`. Define interfaces in `components/[Component].tsx` or `types.ts`.
4. **Identifiers:** Use `crypto.randomUUID()` for creating new IDs.
5. **Mobile-First:** Write `class="flex flex-col md:flex-row"`. Always assume mobile view first (approx 375px width).
6. **Components:** Functional components only. PascalCase. Keep components clear and focused.
7. **CSS Variables:** NEVER use a CSS variable (e.g. `var(--calories-bg)`) without FIRST verifying it is defined in `index.css` for both `:root` and `.dark`.

### C. Folder Structure
- `/` (Root) - Contains `App.tsx`, `index.tsx`, `vite.config.ts`, `types.ts`.
- `components/` - UI components (flat structure).
- `services/` - Logic decoupled from UI (Firebase, LocalStorage).
- `contexts/` - React Context definitions (e.g., Auth).
- `utils/` - Helper functions.
- `.agent/` - Agent knowledge base, skills, and workflows.

## 3. Architecture & Tech Stack

*Ref: [.agent/knowledge/architecture.md](file:///Users/jon/Development/github/vesta/.agent/knowledge/architecture.md)*

- **Frontend:** React 19, Vite, TypeScript.
- **Styling:** TailwindCSS v4, Framer Motion.
- **Backend:** Firebase (Auth & Firestore).
- **AI Integration:** Codex (see `aiService.ts`).

### Key Data Flows
1. **Meal Tracking:** `Today View` → `App.tsx (toggleMeal)` → `DayPlan` → `storageService`.
2. **Calorie Calc:** Consumed (DailyLog props) - Burned (Workouts) = Net Balance.

## 4. Key Data Structures

*Ref: [.agent/knowledge/data_schema.md](file:///Users/jon/Development/github/vesta/.agent/knowledge/data_schema.md)*

- `Recipe`: The atomic unit of food content.
- `DayPlan`: Planned meals for a specific `YYYY-MM-DD`.
- `DailyLog`: Actual consumption record (matches `DayPlan` normally, but can diverge).
- `UserStats`: Weight, Goals, and History.

## 5. Agent Workflow & Skills

You operate using a set of strictly defined workflows in `.agent/workflows/` and skills in `.agent/skills/`.

### Core Workflows
*Always check `.agent/workflows/` for the latest definition.*

1. **Feature Development (Vigorous):** `/create-feature`
    - **Mandatory:** Research -> Constraints Checklist -> PRP (Plan) -> User Approval -> Implementation -> Verification.
    - **Focus:** Prevents "lazy" coding. Enforces "Rich Aesthetics" checks at every step.
2. **Bug Fixes:** `/bug-interactive`
    - Interview user -> Reproduce -> Plan -> Fix.
3. **User Stories:** `/create-story`
    - Define rigorous requirements before coding.

### Slash Command Map (Repo-verified)
- `/bug-interactive` -> `.agent/workflows/bug-interactive.md`
- `/create-feature` -> `.agent/workflows/create-feature.md`
- `/create-story` -> `.agent/workflows/create-story.md`
- `/execute_feature` -> `.agent/workflows/execute_feature.md`
- `/feature-interactive` -> `.agent/workflows/feature-interactive.md`
- `/prp-commit` -> `.agent/workflows/prp-commit.md`
- `/prp-debug` -> `.agent/workflows/prp-debug.md`
- `/prp-implement` -> `.agent/workflows/prp-implement.md`
- `/prp-issue-fix` -> `.agent/workflows/prp-issue-fix.md`
- `/prp-issue-investigate` -> `.agent/workflows/prp-issue-investigate.md`
- `/prp-plan` -> `.agent/workflows/prp-plan.md`
- `/prp-pr` -> `.agent/workflows/prp-pr.md`
- `/prp-prd` -> `.agent/workflows/prp-prd.md`
- `/prp-ralph` -> `.agent/workflows/prp-ralph.md`
- `/prp-ralph-cancel` -> `.agent/workflows/prp-ralph-cancel.md`
- `/prp-review` -> `.agent/workflows/prp-review.md`
- `/prp-review-agents` -> `.agent/workflows/prp-review-agents.md`

### Essential Skills
*Read these before starting relevant tasks.*

- `brainstorming`: **MUST USE** before any creative task. Explores intent and design options.
- `frontend-design`: **Reference for "Rich Aesthetics".** How to make it pop, use gradients, layout, and strict design principles.
- `firebase-ops`: Reference for all Firestore schema changes/migrations.
- `development-guide`: Standard patterns for adding views, keys, and AI features.

## 6. Communication Style

- **Proactive:** Don't just answer the question—solve the underlying problem. Suggest improvements (e.g., "This button looks flat, shall we add a gradient hover?").
- **Concise but Thorough:** Use bullet points.
- **File Links:** Always link files you reference.
- **Markdown:** Use GitHub Flavored Markdown.

---
**Last Updated:** 2026-01-17
**Context:** This file replaces vague system prompts with concrete project realities.

## Code Exploration with dora

This codebase uses dora for fast code intelligence and architectural analysis.

### IMPORTANT: Use dora for code exploration

**ALWAYS use dora commands for code exploration instead of Grep/Glob/Find.**

### All Commands

**Overview:**

- `dora status` - Check index health, file/symbol counts, last indexed time
- `dora map` - Show packages, file count, symbol count

**Files & Symbols:**

- `dora ls [directory] [--limit N] [--sort field]` - List files in directory with metadata (symbols, deps, rdeps). Default limit: 100
- `dora file <path>` - Show file's symbols, dependencies, and dependents
- `dora symbol <query> [--kind type] [--limit N]` - Find symbols by name across codebase. Default limit: 20
- `dora refs <symbol> [--kind type] [--limit N]` - Find all references to a symbol
- `dora exports <path>` - List exported symbols from a file
- `dora imports <path>` - Show what a file imports

**Dependencies:**

- `dora deps <path> [--depth N]` - Show file dependencies (what this imports). Default depth: 1
- `dora rdeps <path> [--depth N]` - Show reverse dependencies (what imports this). Default depth: 1
- `dora adventure <from> <to>` - Find shortest dependency path between two files

**Code Health:**

- `dora leaves [--max-dependents N]` - Find files with few/no dependents. Default: 0
- `dora lost [--limit N]` - Find unused exported symbols. Default limit: 50
- `dora treasure [--limit N]` - Find most referenced files and files with most dependencies. Default: 10

**Architecture Analysis:**

- `dora cycles [--limit N]` - Detect circular dependencies. Empty = good. Default: 50
- `dora coupling [--threshold N]` - Find bidirectionally dependent file pairs. Default threshold: 5
- `dora complexity [--sort metric]` - Show file complexity metrics (sort by: complexity, symbols, stability). Default: complexity

**Change Impact:**

- `dora changes <ref>` - Show files changed since git ref and their impact
- `dora graph <path> [--depth N] [--direction type]` - Generate dependency graph. Direction: deps, rdeps, both. Default: both, depth 1

**Documentation:**

- `dora docs [--type TYPE]` - List all documentation files. Use --type to filter by md or txt
- `dora docs search <query> [--limit N]` - Search through documentation content. Default limit: 20
- `dora docs show <path> [--content]` - Show document metadata and references. Use --content to include full text

**Note:** To find where a symbol/file is documented, use `dora symbol` or `dora file` which show a `documented_in` field.

**Database:**

- `dora schema` - Show database schema (tables, columns, indexes)
- `dora cookbook show [recipe]` - Query patterns with real examples (quickstart, methods, references, exports)
- `dora query "<sql>"` - Execute read-only SQL query against the database

### When to Use Other Tools

- **Read**: For reading file source code
- **Grep**: Only for non-code files or when dora fails
- **Edit/Write**: For making changes
- **Bash**: For running commands/tests

### Quick Workflow

```
dora status                      # Check index health
dora treasure                    # Find core files
dora file <path>                 # Understand a file
dora deps/rdeps <path>           # Navigate dependencies
dora symbol <query>              # Find symbols (shows documented_in)
dora refs <symbol>               # Find references
dora docs                        # List all documentation
dora docs search <query>         # Search documentation content
```

For detailed usage and examples, refer to `./dora/docs/SKILL.md`.
