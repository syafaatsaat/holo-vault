# Holo Vault

A shop for Pokémon TCG singles, priced at market value. Holo Vault is a fictional card shop in Rustboro City, built as a React shopping app for [The Odin Project](https://www.theodinproject.com/)'s shopping cart project.

**Live site: https://holo-vault-two.vercel.app/**

> Fan project. Not affiliated with Nintendo, Creatures, GAME FREAK or The Pokémon Company.

## Features

- **Home:** a booster-pack welcome screen whose crimped seal slides away as you scroll, revealing the most valuable cards in stock as a stack of sticker cards. Below are About and Visit Us sections, with an illustrated map of Rustboro City.
- **Shop:** 276 cards from four sets (151, Prismatic Evolutions, Surging Sparks and Obsidian Flames), Double Rare and up.
  - Search by name, filter by set, and sort by price or name. The choices are kept in the URL, so they can be shared and survive the Back button.
  - Each card has a quantity input with − and + buttons, an "Add to cart" button, and a magnify button that opens a close-up.
  - Cards load 24 at a time with a "Show more cards" button.
- **Cart:** change quantities, remove cards (after a confirmation), and see the running subtotal. The cart is saved in the browser, so it survives a refresh. There's no checkout; this is a demo shop.
- **Everywhere:** a navbar that shrinks into a floating glass bar as you scroll (with a burger menu on phones), a Poké Ball cursor, and a trail of cards that follows the mouse across the dotted background.
- **Accessibility:** works by keyboard and with screen readers, and respects the "reduce motion" setting by turning the animations off.

## Tech

- [React](https://react.dev/) 19 with [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) for the Home, Shop, Cart and not-found pages
- CSS Modules for styling, with no UI library
- [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for tests. They test the app's own components and pages, not React Router itself.

## Running it

You need [Node.js](https://nodejs.org/) 22.22 or newer.

```bash
npm install
npm run dev        # start the dev server at http://localhost:5173
npm test           # run the tests once
npm run test:watch # rerun the tests as files change
npm run lint       # check the code with ESLint
npm run build      # build the site into dist/
npm run preview    # serve the built site locally
```

## Card data

The cards, prices and image links come from [tcgapi.dev](https://tcgapi.dev/), using TCGplayer market prices. The app doesn't call the API. It reads a snapshot saved in `src/data/cards.json`, which keeps the site fast, keeps the API key out of the browser, and stays well inside the free tier's 100 requests a day. The current snapshot is from 22 October 2026.

To refresh the prices:

1. Get a free API key from [tcgapi.dev](https://tcgapi.dev/).
2. Create a `.env` file in the project root (it's gitignored) containing:

   ```
   TCG_API_KEY=your-key-here
   ```

3. Run `npm run fetch-cards`. One run uses about 13 requests and rewrites `src/data/cards.json`.

## Project structure

```
src/
  pages/        Home, Shop, Cart and NotFound, each with its own styles and tests
  components/   Navbar, Footer, Visit Us, product cards, the card trail and the drawn art (logo, Poké Balls, pack seal, map)
  cart/         cart state (React Context and a reducer) and saving it in the browser
  hooks/        scroll, pack-opening and modal dialog hooks
  lib/          card catalogue helpers (search, filter, sort) and number formatting
  data/         the card snapshot
scripts/        the card data fetch script
test/           test setup and helpers
docs/           design notes, mockups and the build plan
```

The design decisions are written up in [`docs/design/DESIGN_NOTES.md`](docs/design/DESIGN_NOTES.md), and the build order in [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md).

## Deploying

The site is a single-page app hosted on [Vercel](https://vercel.com/), which redeploys it on every push to `main`. `vercel.json` sends every address to `index.html`, so React Router can handle links like `/shop` or `/cart` when they're opened directly or refreshed. Vercel detects Vite on its own, so no other settings are needed.

## Credits

Card images and prices are from TCGplayer via tcgapi.dev. Pokémon and all related names and card art belong to Nintendo, Creatures, GAME FREAK and The Pokémon Company. The store, its address and its contact details are made up.
