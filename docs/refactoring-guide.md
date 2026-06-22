# Refactoring Guide — Product Details Section

A practical guide for keeping the product-details widget (and components like it)
clean, accessible, and easy to change. It uses the code in this repo as the
worked example. Pair it with the conventions in [`/CLAUDE.md`](../CLAUDE.md);
this guide is the *how* and *why* behind them.

> A refactor changes **structure, not behavior**. Everything below is in service
> of clarity and maintainability — never silently alter what the user sees. See
> [Refactoring discipline](#8-refactoring-discipline) before you start.

---

## 1. The shape: container / view / logic-hook

Split a feature into three roles. Each has one reason to change.

| Role | File | Owns |
| --- | --- | --- |
| **Container** | `ui/ProductDetailsSection.tsx` | Data fetching; loading / error / success branching |
| **View** | `ui/ProductDetails.tsx` | Layout and composition — presentational only |
| **Logic hook** | `lib/useProductSelection.ts` | Selection state + every value derived from it |

Why it works:

- The **container** knows nothing about colours or sizes — it fetches, then
  hands a resolved `product` to the view. Swap the data source without touching
  the view.
- The **view** has no business rules. It reads what the hook returns and calls
  the handlers. You can read it top-to-bottom as *get selection → render*.
- The **hook** is plain logic — testable without rendering, reusable by another
  view, and the place all selection rules live.

Rule of thumb: if a component both *decides things* and *renders things*, pull
the deciding into a `use…` hook.

## 2. State management

**Derive, don't synchronise.** Anything computable from existing state/props is
computed during render, not stored in its own `useState` + `useEffect`. In the
hook, `isOutOfStock`, `maxStock`, `displayedQuantity`, `colorOptions`,
`sizeOptions`, and `galleryImages` are all derived — there is no effect keeping
them in sync, so they can never go stale.

**One source of truth.** The only real state is `selectedColor`, `selectedSize`,
`quantity`. Everything else flows from those three.

**Colocate state; reset by remount.** `ProductDetailsSection` renders
`<ProductDetails key={demoState} … />`. Changing the key remounts the view, so
selection resets cleanly without an effect that watches `demoState`. Keep state
*inside* the component/hook so this invariant holds — don't lift it up.

**Controlled children.** `ColorSwatches`, `SizeSelector`, and `QuantityStepper`
are controlled: `value` in, `onChange` out, no internal copy of the selection.
The single owner (the hook) stays authoritative.

**Adjust-during-render over effects.** `ImageGallery` resets its active index
when the image set changes by comparing a derived key during render and calling
`setState` then — not in a `useEffect`. This avoids a flash of stale content and
an extra commit. Reach for this pattern instead of "sync prop → state" effects.

## 3. Domain modelling & pure helpers

Keep product rules in pure functions (`lib/product-display.ts`), not inline in
JSX or handlers. They are trivially testable and reusable.

- `uniqueColors`, `sizesForColor`, `imagesForColor`, `findVariant`,
  `variantStock`, `isColorSoldOut` encode *all* the domain knowledge.
- **DRY the logic, not the calls.** `variantStock(product, color, size)` exists
  because `findVariant(...)?.stock ?? 0` appeared in four places. Calling the
  same pure helper from two sites is *not* duplication — the knowledge lives in
  one place.
- **Sort with intent.** `sizesForColor` ranks clothing sizes (`xs…xxl`), then
  numeric (shoe) sizes, then falls back to locale compare. Encode ordering in
  the helper so every consumer is consistent.

⚠️ **Watch for divergent policies that look unifiable.** Initial selection takes
`sizesForColor(...)[0]` (stock-agnostic — it can land on a sold-out size), while
`selectColor` prefers the first *in-stock* size. These are intentionally
different; do **not** collapse them into one helper, or you change first-load
behavior (and the `demoState === 'max'` quantity seed). If you think the initial
selection *should* prefer in-stock, that is a product decision — raise it
separately (see §8).

## 4. Reusable UI primitives

The widget composes small, generic components from `shared/ui/`. Treat them as a
kit:

- Each takes a **data-shaped prop** (`options: TColorOption[]`) plus
  `value`/`onChange` — not product-specific types. They'd work for any
  radiogroup of swatches.
- Props follow the project style: a `type T<Component>Props` alias, props
  annotated directly in the signature, **no `React.FC`** (see `/CLAUDE.md`).
- **Don't fragment the view further.** The JSX in `ProductDetails` only composes
  these already-extracted primitives. Splitting it into `PriceSection` /
  `ColorSection` wrappers that add nothing is invented work (YAGNI).

## 5. Accessibility

This component type is mostly form controls — get the semantics right and most
a11y follows for free.

- **Native elements first.** `Accordion` is `<details>/<summary>` — open/close,
  focus, and keyboard come from the platform. Prefer this to a div + `onClick` +
  hand-rolled ARIA.
- **Radiogroup for single-select.** Colours and sizes use
  `role="radiogroup"` with `role="radio"` + `aria-checked` children, each an
  accessible `<button>`. The interactive `StarRating` adds **roving tabindex**
  (only the selected star is tabbable) and Arrow/Home/End handling.
- **Label state changes.** The quantity value uses `aria-live="polite"`;
  disabled increments expose a hint via `aria-describedby`.
- **Decorative vs meaningful.** Icon SVGs are `aria-hidden`; thumbnail `<img>`
  uses `alt=""` (the main image carries the product `alt`). Provide
  `aria-label`s where a control's text isn't self-describing.
- **Don't disable silently.** A sold-out colour/size is `disabled` *and* visibly
  styled, so the state is perceivable, not just programmatic.

## 6. Image handling

Images dominate this UI's bytes — treat them as a first-class concern.

- **Request display-sized images.** `squareImage`/`supabaseImage` rewrite the
  storage URL to the transform endpoint so the browser downloads an 800px (or
  200px thumb) image, not the multi-MB original. Non-matching URLs pass through
  unchanged, so it's safe to apply everywhere.
- **Preload the likely-next image.** The view calls `preload(...)` (React DOM)
  during render for each colour's first image, so switching colours is instant.
  `preload` is idempotent and a legitimate render-phase call.
- **Lazy + async-decode the rest.** Thumbnails use `loading="lazy"` and
  `decoding="async"`; the main image decodes async too.
- **Square slots, cover-crop.** Match the transform's resize mode to the layout
  (`resize: 'cover'`) so images fill their slot without distortion or layout
  shift.

## 7. Async & data fetching

- `useQuery` returns a **discriminated union** on `status`
  (`loading | error | success`). The container `switch`es on it, so each branch
  only sees the fields that exist — no `data!` non-null assertions.
- **Guard against stale responses.** The effect flips an `active` flag in its
  cleanup so a slow request that resolves after a newer one can't overwrite
  fresh state. Any "fetch in an effect" needs this.
- Keep fetching in the **container/hook**, never in a presentational component.

## 8. Refactoring discipline

The rules that make a refactor safe rather than a behavior change in disguise:

1. **Preserve behavior exactly.** When extracting the hook, every initial value,
   derived value, and handler stayed character-identical (modulo the
   `variantStock` inline). Trace old-vs-new value by value.
2. **`lint` + `tsc` do not prove behavior.** They catch types, not logic. Verify
   by running the app, or by an explicit equivalence trace. Say "verified by
   trace," not "tested," if you didn't run it.
3. **Surface latent bugs; don't fold them in.** The stock-agnostic initial size
   (§3) is plausibly a bug — flag it as a separate decision rather than "fixing"
   it inside a refactor.
4. **Don't over-engineer.**
   - No memoizing derived arrays/handlers when children aren't `React.memo` —
     they re-render anyway, so it buys nothing.
   - No invented interfaces for SOLID's O/L/I/D; they map onto class
     hierarchies, not presentational React components.
   - Hoist static, prop-less SVGs to module scope (`rendering-hoist-jsx`) only
     where the component re-renders often enough to matter (e.g. the stepper).

## Refactoring checklist

- [ ] Does any component both decide and render? → extract a `use…` hook.
- [ ] Is any state derivable from other state? → derive during render, delete the effect.
- [ ] Single source of truth for each piece of state?
- [ ] Repeated *logic* (not just repeated calls)? → one pure helper.
- [ ] Two code paths that look unifiable — are their policies actually the same?
- [ ] Controls keyboard-operable, labelled, and using native elements where possible?
- [ ] Images sized for display, preloaded/lazy/async as appropriate?
- [ ] Async paths guarded against stale responses and modelled as a status union?
- [ ] Behavior preserved and verified (run or trace) — not just compiling?
- [ ] Any latent bug found raised separately, not silently changed?

---

See also: [`/CLAUDE.md`](../CLAUDE.md) — naming, props, keys, comments, and the
SOLID/DRY/KISS/YAGNI conventions these notes apply.
