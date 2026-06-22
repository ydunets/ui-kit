## Conventions

### Naming

Identifiers must be **descriptive**. Don't use single-letter or cryptic short
names (`n`, `t`, `e`, `r`, `v`) — name things for what they are (`count`,
`item`, `event`, `result`, `variant`). This applies to variables, parameters
(including callback params like `.map((product) => …)`), and functions.

- Enforced in the frontend by ESLint `id-length` (`min: 2`); `_` is allowed for
  intentionally-unused bindings.
- Biome (the `server/` project) has no length rule, so apply this by hand there.

### Component props

Follow the prop style from the interview reference project (see References):

- Declare props as a **`type` alias** named **`T<Component>Props`** (prefixed `T`,
  not `interface`, not unprefixed). Other component-facing object types use the
  same `T` prefix (e.g. `TColorOption`). Export them so consumers get the types.
- **Do not use `React.FC` / `FC<>`.** Annotate the destructured props directly in
  the signature.
- For children, use `PropsWithChildren<{…}>`. Generic components may use `<T>`
  (the `T` prefix / single-letter generic is allowed for *types*, distinct from
  the value-naming rule above).

```tsx
type TPriceTagProps = {
  salePrice: number;
  listPrice: number;
};

export const PriceTag = ({ salePrice, listPrice }: TPriceTagProps) => {
  // …
};
```

### React keys

Always use **stable, data-derived keys** in lists. **Never use the array index**
(or any value generated during render) as a `key`.

- Where to get the key:
  - **Server/DB data** → the record's own id (`product.id`, image `url`, `sku`).
  - **Locally-created data** → assign an id at creation time (incrementing
    counter, `crypto.randomUUID()`, or the `uuid` package) and store it.
- Rules: keys must be **unique among siblings**, **stable** across renders, and
  **must not be generated while rendering**. (The same key value may reappear in a
  different array — only sibling-uniqueness matters.)

```tsx
// ❌ index — reorders/insertions reuse the wrong element's state
{images.map((url, index) => <Thumb key={index} src={url} />)}
// ✅ stable, from the data
{images.map((url) => <Thumb key={url} src={url} />)}
```

### Refactoring (SOLID / DRY / KISS / YAGNI)

Apply these as **judgment, not ceremony**. The goal is clearer, more
maintainable code — not abstractions added to satisfy an acronym.

What pays off here:

- **SRP** — pull stateful/business logic out of a component into a custom
  `use…` hook so the component stays presentational and the logic is testable
  on its own. (See `useProductSelection` → `ProductDetails`.)
- **DRY** — extract a small helper only for genuinely repeated *logic* (e.g.
  `variantStock`). Calling the same pure helper from two places is **not** a DRY
  violation — the knowledge lives in one place already.
- **KISS** — prefer the simplest thing that works; don't contort (e.g. no
  elaborate lazy `useState` initializers to shave a micro-cost).

Guards against over-engineering (don't do these):

- **Don't fragment JSX** into sub-components that only compose
  already-extracted components — that's invented work.
- **Don't memoize** derived values/handlers when the children aren't
  `React.memo` and the callbacks aren't `useCallback` — it saves nothing while
  the children re-render anyway.
- **Don't invent interfaces** for O/L/I/D — those map onto class hierarchies,
  not presentational React components.

Refactors **preserve behavior** — they change structure, not what the user
sees. `lint` + `tsc` do **not** prove behavior; verify by running the app or by
tracing each value old-vs-new. If you spot a latent behavior bug while
refactoring, **surface it as a separate decision** — never fold a behavior
change into a "refactor."

### Comments

Keep code comment-free by default — names and types should carry the meaning.
Only two kinds of comments are allowed:

- **`TODO:`** — work that still needs finishing.
- **Explaining the non-obvious** — a genuine "why", gotcha, or subtle decision a
  reader couldn't infer from the code (e.g. a render-time `setState`, a stale-
  request guard, a platform footgun). Keep it short.

Don't write comments that restate what the code does (prop descriptions,
"// loop over items", section banners). Functional directives
(`eslint-disable-…`) are not comments and stay.

## References
1. /Users/yurydunets/eduspace/preparing-for-ui-interview-v2-main