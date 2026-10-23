# Holo Vault build plan

How the app will be built from the designs in [`design/DESIGN_NOTES.md`](design/DESIGN_NOTES.md). The order builds the brief's required parts first (data, cart, routing, then the Shop and Cart pages), so the home-page animations never hold them up. Each phase ends in a working state and a commit.

## Decisions

| Topic | Decision |
|---|---|
| Cart state | React Context with a reducer (`CartContext` + `useCart()`) |
| Showing 276 cards | Show 24 at first, with a **Show more cards** button that adds 24 more. The count resets when the search, set or sort changes. |
| Saving the cart | Store it in `localStorage`, so it survives a page refresh |
| Shop filters | Saved in the URL (`/shop?set=151&q=chari&sort=price-asc`), so they can be linked to and survive the back button |
| Styling | CSS Modules, with global colour tokens as CSS variables in `src/index.css` |
| Routing | `react-router` v8 |
| Testing | Vitest + React Testing Library + user-event + jest-dom, running in jsdom. React Router itself is not tested. |
| Hosting | Vercel, with the SPA rewrite in `vercel.json` |

## Phase 0: Housekeeping
1. **Fix the card names in `src/data/cards.json`.** Two formats slipped through the clean-up, for example `Mew ex - 205/165 (151 Metal Card)` and `Ninetales -199/197`. Fix the rule in `scripts/fetch-cards.mjs` and re-clean the existing file, without spending any API requests.
2. **Remove the Vite starter content:** the starter page, its CSS and images.
3. **Set up the global styles:** add Google Fonts (Fredoka, Lilita One, Nunito Sans) to `index.html`, and the colour tokens plus the dotted background to `src/index.css`.
4. **Add `vercel.json`** with the SPA rewrite.

## Phase 1: Tooling
5. **Install React Router:** `react-router`.
6. **Install the test tools:** `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event` and `@testing-library/jest-dom`.
7. **Create the test setup file.** It loads jest-dom and adds stand-ins for `IntersectionObserver`, `matchMedia` and `scrollTo`, which jsdom doesn't have. It also clears `localStorage` between tests.
8. **Add the `test` and `test:watch` scripts.**

## Phase 2: Data and helpers (tested)
9. **`src/lib/cards.js`:** the card list, the set list, `getCardById`, `getTopCards(n)`, and `filterCards({ set, query, sort })` for search, set filter and sort.
10. **`src/lib/format.js`:** `formatPrice`, and `clampQuantity` (minimum 1, maximum 99, digits only).
11. **Unit tests** for all of the above.

## Phase 3: Cart state (tested)
12. **Cart reducer** with four actions: `add`, `setQuantity`, `remove` and `clear`. Plus selectors for item count, line totals and subtotal.
13. **`CartProvider`** and a `useCart()` hook.
14. **Saving to `localStorage`**:
    - **Load:** read the saved cart when the provider starts. If the saved data is broken or storage is blocked, fall back to an empty cart.
    - **Clean up:** drop any card ids that are no longer in the catalogue, and keep quantities within 1–99.
    - **Save:** write the cart back every time it changes.
15. **Tests:**
    - **Reducer:** adding the same card twice, the 99 cap, and removing items.
    - **Provider:** loading a saved cart, ignoring broken or unknown data, and saving after a change.

## Phase 4: Layout and routing
16. **Routes:** `/` for Home, `/shop`, `/cart`, and a 404 page for anything else.
17. **`Layout`:** Navbar, the page content, Visit Us and Footer, so those three appear on every page.
18. **Scrolling:** About links to `/#about` and Visit Us to `#visit`, with a small component that scrolls to the right section. Each page starts at the top when you navigate to it.

## Phase 5: Shared components
19. **`Navbar`:** the pack logo, the links and the cart badge. It shrinks into the glass bar on scroll, using a `useScrolled()` hook.
20. **`QuantityStepper`:** the −/+ buttons and the number field, following the mockup's rules.
21. **`ProductCard`** and **`RarityBadge`**.
22. **SVG components:** `PokeBall`, `PackLogo`, `PackSeal` (static and tearing) and `CrimpEdge`.
23. **`PageBand`:** the red header for the Shop and Cart pages.
24. **Component tests** for the stepper and the product card: typing, the −/+ limits, and "Add to cart" passing the chosen quantity.

## Phase 6: Shop page
25. **The toolbar:** search, sort dropdown and set filters, saved in the URL.
26. **The grid:** lazy-loaded images, the match count, and the "No cards caught" state.
27. **Show more:** show 24 cards, then **Show more cards** adds 24 more. The count resets when the filters change. The button says how many cards are left and hides when all are shown.
28. **Integration tests**, rendered inside a `MemoryRouter`:
    - searching, filtering and sorting;
    - Show more, and the count resetting when the filters change;
    - "Add to cart" updating the navbar badge.

## Phase 7: Cart page
29. **The page:** cart rows, the summary panel that stays in view, and the empty "Your pack is empty" state.
30. **Tests:**
    - changing a quantity by typing and with the −/+ buttons;
    - removing an item;
    - the subtotal maths;
    - the empty state;
    - the cart still being there after a remount, since it's saved in `localStorage`.

## Phase 8: Home page
31. **Welcome screen:** the HOLO VAULT wordmark with Poké Ball O's, and the scroll hint.
32. **Tagline section:** "Catch the cards you chased." (Option A's style) with the Umbreon display.
33. **Pack seal tear:** the foil-peel animation, run by a `usePackOpen()` hook using `IntersectionObserver`. It plays once, and is skipped when the device is set to reduce motion.
34. **Top cards:** stacking sticky cards that drop in once the pack opens.
35. **About section:** the set buttons link to `/shop?set=…`.
36. **Tests:** sections render, the top cards are in the page before any animation runs, and the set links point to the right filtered shop URL.

## Phase 9: Polish
37. **Phone layouts:** check every page at phone width.
38. **Keyboard and screen reader checks.**
39. **Reduced motion:** confirm everything works with it turned on.
40. **Page titles** for each page.
41. **Speed:** check image loading with all 276 cards shown.

## Phase 10: Deploy
42. **Build check:** run `npm run build` and `npm run preview`, then refresh on `/shop` and `/cart` to test the SPA rewrite.
43. **Deploy to Vercel:** import the GitHub repo into Vercel and check the live site.
44. **Update the README:** what the app is, how to run and test it, how to refresh the card data (`npm run fetch-cards` with `TCG_API_KEY` in `.env`), and the fan-project disclaimer.

## Planned structure

```
src/
  main.jsx               # router + CartProvider
  routes.jsx             # route table
  index.css              # tokens, fonts, base styles
  data/cards.json        # card snapshot (from scripts/fetch-cards.mjs)
  lib/                   # cards.js, format.js (+ tests)
  cart/                  # cartReducer.js, CartContext.jsx, storage.js (+ tests)
  hooks/                 # useScrolled.js, usePackOpen.js
  components/            # Layout, Navbar, Footer, VisitUs, QuantityStepper,
                         # ProductCard, RarityBadge, PageBand, art/ (SVGs)
  pages/                 # Home, Shop, Cart, NotFound (+ tests)
test/setup.js            # jest-dom, browser stand-ins
vercel.json
```
