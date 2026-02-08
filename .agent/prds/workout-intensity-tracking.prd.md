# Workout Intensity Tracking (Simple vs Heavy)

## Problem Statement

Users can log workouts today, but they cannot clearly differentiate low-effort daily movement from heavy training sessions. This makes it hard to verify two key behavior goals: doing at least one simple workout every day, and completing three heavy workouts per week.

## Evidence

- **User requirement**: Need explicit separation between simple workouts (e.g., short walking) and heavy workouts.
- **User requirement**: Need history visibility for heavy workouts including type and kcal burned.
- **Assumption - needs validation**: Existing workout logs are sufficient as a base, but intensity classification details may need refinement after first release.

## Proposed Solution

Add workout intensity classification to workout logging and analytics, with two categories: `simple` and `heavy`.
- Keep logging workflow lightweight for daily compliance.
- Provide history views for both categories.
- Surface compliance indicators for:
  - Daily minimum: at least one simple workout per day.
  - Weekly target: at least three heavy workouts per week.

## Key Hypothesis

We believe explicit workout intensity tracking and goal status visibility will improve consistency in daily movement and weekly training quality.
We will know we are right when users hit daily simple-workout compliance and weekly heavy-workout compliance more frequently than baseline.

## What We're NOT Building

- Automatic intensity detection from wearables in v1 - deferred due to integration complexity.
- Personalized training plans in v1 - out of scope for initial compliance tracking.
- Advanced coaching recommendations in v1 - out of scope; tracking first.

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Daily simple-workout compliance | >= 80% of active days | Day-level check: at least one `simple` workout logged |
| Weekly heavy-workout compliance | >= 60% of active weeks | Week-level check: at least three `heavy` workouts logged |
| Heavy workout history usage | TBD - needs analytics event definition | View opens and filter usage in workout history UI |

## Open Questions

- [ ] What exact rule defines `simple` vs `heavy` (manual selection only, or duration/intensity thresholds)?
- [ ] Should one heavy workout also count toward the daily simple minimum?
- [ ] Should weekly heavy target use calendar week or rolling 7-day window?
- [ ] How should missed daily simple workouts be displayed (neutral vs warning state)?

---

## Users & Context

**Primary User**
- **Who**: Health-focused Vesta user trying to build consistent workout habits.
- **Current behavior**: Logs workouts but cannot reliably distinguish low-intensity consistency from high-intensity progress.
- **Trigger**: End of day or week check-in to confirm targets were met.
- **Success state**: Can quickly answer "Did I move today?" and "Did I complete 3 heavy sessions this week?"

**Job to Be Done**
When I review my activity, I want to separate simple and heavy workouts, so I can maintain daily movement and complete my weekly heavy training goal.

**Non-Users**
- Users seeking full training periodization and coaching automation (not targeted in v1).

---

## Solution Detail

### Core Capabilities (MoSCoW)

| Priority | Capability | Rationale |
|----------|------------|-----------|
| Must | Add `intensity` (`simple` or `heavy`) to workout logs | Core data needed for all goals |
| Must | Show heavy workout history (type, kcal, timestamp) | Explicit user requirement |
| Must | Show simple workout history | Explicit user requirement |
| Must | Daily simple goal indicator | Core behavior target |
| Must | Weekly heavy goal indicator (`3/week`) | Core behavior target |
| Should | Filters/tabs for simple vs heavy history | Improves usability |
| Could | Streak visuals for daily simple compliance | Motivational enhancement |
| Won't | Auto-detect intensity from sensors in v1 | Deferred |

### MVP Scope

1. Extend workout model and persistence with intensity classification.
2. Update workout entry UI to require/select intensity.
3. Add history views (or filtered sections) for heavy and simple workouts.
4. Add daily and weekly compliance calculations and indicators.
5. Backward-compatible handling for historical workouts without intensity.

### User Flow

1. User logs workout with type, kcal, and intensity (`simple` or `heavy`).
2. App stores workout and updates daily/weekly compliance status.
3. User opens analytics/history:
   - sees heavy workout history with workout type and kcal burned.
   - sees simple workout history.
4. User checks:
   - daily simple completion status.
   - weekly heavy target progress (`x/3`).

---

## Technical Approach

**Feasibility**: HIGH

**Architecture Notes**
- Extend `WorkoutItem` in `types.ts` with `intensity: 'simple' | 'heavy'`.
- Persist through existing `DailyLog.workouts` path in `services/storageService.ts`.
- Maintain backward compatibility by defaulting missing intensity values for legacy entries (TBD rule).
- Reuse analytics and daily summary surfaces where possible for compliance indicators.

**Technical Risks**

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Legacy logs missing intensity | High | Migration/default logic in read path; mark unknown where needed |
| Ambiguous classification criteria | Medium | Start with explicit manual selection in UI and document rule |
| Weekly boundary confusion | Medium | Decide and document single policy before implementation |

---

## Implementation Phases

| # | Phase | Description | Status | Parallel | Depends | PRP Plan |
|---|-------|-------------|--------|----------|---------|----------|
| 1 | Data Model | Add intensity field to workout type and storage handling | pending | - | - | - |
| 2 | Entry UX | Update workout entry modal/form to capture intensity | pending | - | 1 | - |
| 3 | History Views | Add simple/heavy history sections with type + kcal for heavy | pending | with 4 | 1 | - |
| 4 | Goal Logic | Compute daily simple minimum and weekly heavy target status | pending | with 3 | 1 | - |
| 5 | Validation | Manual and regression checks for logging, history, and progress | pending | - | 2,3,4 | - |

### Phase Details

**Phase 1: Data Model**
- Add `intensity` to workout type definition and persistence.
- Decide fallback behavior for legacy workouts (TBD).

**Phase 2: Entry UX**
- Ensure intensity is captured at workout creation/edit time.
- Keep flow fast for daily simple logging.

**Phase 3: History Views**
- Expose clear separation between simple and heavy logs.
- Heavy history must show workout kind/type and kcal burned.

**Phase 4: Goal Logic**
- Daily: met if >= 1 simple workout.
- Weekly: met if >= 3 heavy workouts.
- TBD: whether heavy counts toward daily simple.

**Phase 5: Validation**
- Verify calculations across date boundaries and edits/deletes.
- Verify legacy data behavior and UI rendering.
