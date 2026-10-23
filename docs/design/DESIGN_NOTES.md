# Holo Vault – design notes

Summary of the planning and design conversation from 22 Oct 2026.

- **Live mockup canvas:** https://claude.ai/artifact/CS4rk7AUL81E2Wz1BJ73Cn (private to the owner)
- **Local copies of the mockups:** [`mockups/`](mockups/)

## The project

A shopping app for The Odin Project brief: Home, Shop and Cart pages, a navbar on every page, product cards with a quantity input plus −/+ buttons and "Add To Cart", and a cart where quantities can be changed and items removed. No checkout. Tested with React Testing Library without testing react-router itself. Deployed on Vercel with a `vercel.json` SPA rewrite.

## Decisions

### Idea and data
- **Store:** Holo Vault, a store for Pokémon TCG singles.
- **Ideas considered and dropped:**
  - A Steam-style game store: the InternalSteamWebAPI is unofficial, has CORS problems and needs a proxy.
  - A food-ordering store: easy, but generic.
- **Data source:** [tcgapi.dev](https://tcgapi.dev/). The free tier allows 100 requests a day, has no commercial use, and needs an `X-API-Key` header.
- **Snapshot approach:** to stay inside the limit and keep the key out of the browser, `npm run fetch-cards` (`scripts/fetch-cards.mjs`) saves a snapshot to `src/data/cards.json`. A full run costs about 13 requests. The key lives in `.env`, which is gitignored.
- **Sets:**

  | Set | tcgapi set id | Cards kept |
  |---|---|---|
  | 151 | 5500171 | 55 |
  | Prismatic Evolutions | 5500017 | 80 |
  | Surging Sparks | 5500180 | 87 |
  | Obsidian Flames | 5500138 | 54 |

  276 cards in total, priced as of 22 Oct 2026.
- **Cards kept:** Double Rare and up only; Common, Uncommon, Rare and Code Card are excluded.
- **No 7-day price change:** the card list endpoint doesn't return it, so there's no "trending" section.
- **To do:** the name clean-up misses a couple of formats, for example `Mew ex - 205/165 (151 Metal Card)` and `Ninetales -199/197`. Fix the regex and post-process the existing JSON; this doesn't need any extra API calls.

### Store details (fictional)
- **Address:** 8 Granite Way, Rustboro City, Hoenn Region
- **Hours:** open daily, 11:00 am – 9:00 pm
- **Contact:** holovault@pokemail.com, (0151) 555 0384
- **Protection line:** "Every card is sleeved and stored in a rigid top loader, so it reaches you in the same condition it left our case."
- **Footer disclaimer:** "Fan project. Not affiliated with Nintendo, Creatures, GAME FREAK or The Pokémon Company."

### Visual direction
- **Rejected:** a dark navy "holo night" theme, because it looked too like the earlier Memory Legends project.
- **Theme:** light and fun but clean. White and red lead, with yellow and blue as accents.
  - Red `#E0262B` (darker `#B81D22` / `#C81E24`)
  - Yellow `#FFCB05`
  - Blue `#2A6FDB`
  - Ink `#1D2140`
  - Light tints: `#FDE9EA`, `#FFF6D1`, `#EAF1FD`, `#F4F5FA`
- **Fonts:** Lilita One for the big display moments (the HOLO VAULT wordmark), Fredoka for headings, Nunito Sans for body text.
- **Avoid:** sunburst or ray backgrounds, because they evoke the Rising Sun flag.

### Chosen design: Option C (Sticker Party), revised
The file is `mockups/OptionC-Stickers.dc.html`, with parts taken from Options A and B.

1. **Navbar**
   - The logo is the booster pack outline (crimped edges, torn top-right corner) filled like a Poké Ball: red top, white bottom, dark middle band and centre button, cut to the pack shape. There's no text. The browser-tab icon matches.
   - Shop, About and Visit Us sit in the centre; Cart (with a count badge) is on the right.
   - At the top of the page it blends into the red hero with no dividing line.
   - After scrolling, it shrinks into a smaller floating bar: translucent white with a blur, a translucent rounded border, and it stays pinned at the top.
2. **Welcome screen:** "Welcome to / HOLO VAULT" alone on the first screen, in capitals, with Poké Balls as both O's (yellow-top and blue-top). Red background with large faint Poké Ball outlines slowly spinning. "Scroll to open the pack" hint with a bouncing arrow.
3. **"Catch the cards you chased."** (Option A's style)
   - **Left:** a white pill reading "Pokémon TCG singles at market price", the two-line headline with "chased." in yellow, the description, and the yellow "Start shopping" and white "See top cards" buttons.
   - **Right:** the Umbreon ex card (tilted) with a yellow "Top pull $1,215.47" sticker and a blue "Umbreon ex · 161/131" tag.
4. **Pack seal and tear**
   - The bottom of the red hero has a dashed tear line and a crimped seal strip labelled "Tear here".
   - When the seal scrolls into view, the whole crimped strip slides off to the left until it leaves the screen.
   - "Top cards in the vault" then slides out from behind the pack with a bounce, and the cards drop in one by one.
   - The animation plays once in the real app (the mockup replays it for testing).
   - With reduced motion turned on, everything simply appears.
5. **Top cards in the vault**
   - Option A's header: Poké Ball icon, title, the subtitle "The most valuable pulls we stock right now." and a "See all 276 cards" button.
   - Five big sticker cards: Umbreon, Sylveon, Charizard (151), Espeon and Pikachu.
   - Each card shows the image on the left and, on the right, the rank, the name with rarity and number, the pack (set), the market price and "View in shop".
   - The whole card is tilted, alternating left and right. There's no tape.
   - Cards are `position: sticky` with a slightly lower top offset each, so they stack as you scroll.
6. **About:** Option A's version (intro, set buttons, four Poké Ball feature boxes, a big faint Poké Ball outline) on the dotted background.
7. **Visit Us:** Option A's Poké Ball panel (red top, band with a map-pin button, white bottom with the details and a map placeholder) on the dotted background.
8. **Footer**
   - Option B's red footer.
   - Topped by a crimped pack edge with the teeth pointing up, the same as the hero seal.
   - Has the same white dashed line, plus one large faint spinning Poké Ball outline.
9. **On every page:** the navbar, Visit Us and the footer.

### Behaviour already settled for the Shop and Cart pages
These come from the earlier clickable mockup, `mockups/Main.dc.html`.

- **Quantity:** minimum 1, maximum 99, digits only. A blank or 0 snaps back to 1 when the field loses focus. − is disabled at 1.
- **Removing items:** cart items have their own Remove button.
- **Shop filter:** buttons for All, 151, Prismatic Evolutions, Surging Sparks and Obsidian Flames.
- **Shop sort:** a "Sort cards" dropdown sits beside the search bar, which takes up the rest of the row with a 16px gap. Options: Price high to low (default), Price low to high, Name A to Z, Name Z to A. It combines with search and the set filter.
- **Shop search:** a search bar above the set filters matches card names as you type, ignoring capitals, and combines with the set filter. It has a clear (×) button, a live match count, and a "No cards caught" message with a "Clear search and filters" button when nothing matches.
- **Add feedback:** "Add to cart" briefly changes to "Added to cart ✓".
- **Cart summary:** item count, subtotal, and "Checkout isn't part of this demo store."
- **Option C restyle:** done in `mockups/C-ShopCart.dc.html`. Red pack band header with the navbar blended in, a static crimped seal, sticker product cards and red filter buttons on the dotted background. The cart has large sticker rows matching the shop cards (128px card image, rarity badge, 24px name, 30px line total, 44px −/+ buttons, outlined Remove), a Poké Ball summary panel that stays in view while scrolling, and an empty "Your pack is empty" state. Visit Us and the footer match the home page.

### Still open / next steps
- Review the Option C Shop and Cart mockup (`mockups/C-ShopCart.dc.html`).
- Choose art for the placeholders: welcome wallpaper, map, final logo.
- Fix the card-name clean-up in the data snapshot.
- Build the real app: React Router, Vitest + React Testing Library, `vercel.json`, CSS Modules.

## About the mockup files
The `.dc.html` files are the source of the canvas artboards. They need the canvas runtime (`support.js`), and their card images are stored on the canvas (`/_blob/...` links), so opening them directly in a browser won't render properly. Use the canvas link above to view them. The files here are a backup and a reference for building the real components.
