# Feature: PWA Instant Load & Performance Optimization

## Summary
The current PWA suffers from slow load times due to a "chain of blocking dependencies" (HTML -> Bundle -> Dynamic Import of storageService -> Firebase Init -> Data Fetch) and an aggressive version check that unregisters Service Workers.

This plan implements an "Instant Load" architecture by:
1.  **Extracting Cache Logic**: creating a lightweight `utils/cacheService.ts` with zero dependencies (no Firebase).
2.  **Optimistic Initialization**: Modifying `App.tsx` to read from this cache *synchronously* during initial render, bypassing the loading screen for returning users.
3.  **Service Worker Fixes**: Removing the destructive "Hard Version Check" in `App.tsx` and letting `vite-plugin-pwa` handle updates gracefully.
4.  **Asset Optimization**: Removing blocking legacy code (`importmap`) from `index.html`.

## User Story
As a Vesta user
I want the app to open and show my meal plan immediately (under 500ms)
So that I can log food or check my schedule without staring at a loading screen.

## Problem Statement
- **Slow Startup**: The app waits for `storageService` (which imports Firebase) to load before showing any content.
- **Cache Destruction**: `App.tsx` unregisters Service Workers on version mismatch, forcing a full network reload.
- **Network Drag**: Legacy `importmap` in `index.html` may be triggering unnecessary connections.

## Solution Statement
We will decouple "Data Display" from "Data Fetching".
- **Display**: Reads synchronously from `localStorage` via a new `cacheService` (bundled in main chunk, very small).
- **Fetching**: `storageService` (heavy) is still lazy-loaded, but runs in the background to update the UI *after* it's already visible.

## Metadata
| Field            | Value                                             |
| ---------------- | ------------------------------------------------- |
| Type             | REFACTOR / ENHANCEMENT                            |
| Complexity       | MEDIUM                                            |
| Systems Affected | `App.tsx`, `services/storageService.ts`, `vite.config.ts`, `index.html` |
| Dependencies     | `vite-plugin-pwa` (Existing)                      |
| Estimated Tasks  | 5                                                 |

---

## UX Design

### Before State
```
[User opens App] 
  -> [White Screen / Generic Loader] (Waiting for bundle)
  -> [Initial Loader "Warming the Hearth..."] (Waiting for storageService + dynamic import)
  -> [Check Version] (Might fetch network)
  -> [Fetch Data] (Reads localStorage via heavy service)
  -> [Render Dashboard]
```

### After State
```
[User opens App]
  -> [Dashboard with Cached Data] (Almost Instant - read from cacheService)
  -> [Background: Fetch updates / Load Heavy Services]
  -> [UI Updates gracefully if new data arrives]
```

### Interaction Changes
| Location | Before | After |
|----------|--------|-------|
| Startup | 2-3s Loading Screen | Instant dashboard (if visited before) |
| Version Update | Full white flash reload | Non-intrusive toast notification (ReloadPrompt) |

---

## Files to Change

| File                             | Action | Justification                            |
| -------------------------------- | ------ | ---------------------------------------- |
| `utils/cacheService.ts`          | CREATE | New lightweight dependency-free cache wrapper |
| `services/storageService.ts`     | UPDATE | Use `cacheService` instead of internal helpers |
| `App.tsx`                        | UPDATE | Import `cacheService` static, remove hard version check, optimize init |
| `index.html`                     | UPDATE | Remove `importmap` |
| `vite.config.ts`                 | CHECK  | Ensure PWA settings are optimal (no code change likely needed if just cleaning App logic) |

---

## Step-by-Step Tasks

### Task 1: CREATE `utils/cacheService.ts`
- **ACTION**: Extract the `localStorage` logic from `services/storageService.ts`.
- **CONTENT**: `getCacheKey`, `getFromCache`, `saveToCache`, `getCachedDayPlan`, `getCachedUserStats`, etc.
- **DEPENDENCIES**: NONE. Pure TypeScript.
- **VALIDATE**: `npx tsc --noEmit`.

### Task 2: REFACTOR `services/storageService.ts`
- **ACTION**: Update it to import from `../utils/cacheService`.
- **REMOVE**: Local definitions of caching helpers.
- **VALIDATE**: `npx tsc --noEmit`.

### Task 3: CLEAN `index.html`
- **ACTION**: Remove `<script type="importmap">...</script>`.
- **VALIDATE**: Build checks.

### Task 4: OPTIMIZE `App.tsx` (Initialization)
- **ACTION**:
    - Import `* as cache` from `utils/cacheService`.
    - Initialize `todayPlan`, `userStats`, etc. using `useState(() => cache.getCached...(today) || default)`.
    - REMOVE `isInitializing` check for the main content render (keep it for creating the *first* user if no cache exists).
    - Keep `useEffect` that imports `storageService` and calls `refreshData`.
- **VALIDATE**: Browser test - app should load content even if you simulate "Offline" or "Slow Network" in DevTools.

### Task 5: REMOVE Hard Version Check from `App.tsx`
- **ACTION**: Delete the `useEffect` block that fetches `/version.json` and unregisters SWs.
- **RATIONALE**: `ReloadPrompt.tsx` and `vite-plugin-pwa` handle this standardly.
- **VALIDATE**: Browser test - verify no immediate fetch to `/version.json` on load.

---

## Testing Strategy

### Validation Checks
| Check | Method | Success Criteria |
|-------|--------|------------------|
| **Instant Load** | DevTools Performance | First Contentful Paint < 1s on repeated visit |
| **Offline Support** | DevTools Network (Offline) | App loads dashboard with cached data |
| **Data Integrity** | Manual | Cached data matches what was last saved |
| **No "Warming..."** | Visual | "Warming the Hearth" loader is skipped or < 100ms |

### Manual Verification
1.  **Build & Run**: `npm run build && npm run preview`
2.  **First Visit**: Load app, see it work.
3.  **Reload**: Refresh page. Should be nearly instant.
4.  **Offline**: Turn off network in DevTools. Reload. Should still load dashboard.
5.  **New Data**: Change weight/log food. Reload. Data should persist.

---

## Acceptance Criteria
- [ ] `utils/cacheService.ts` created and used.
- [ ] `App.tsx` initializes synchronously from cache.
- [ ] Legacy `importmap` removed.
- [ ] Hard version check code removed.
- [ ] App loads offline.
