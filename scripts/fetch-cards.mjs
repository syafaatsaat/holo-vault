// Fetches the Holo Vault card catalogue from tcgapi.dev and saves it as a
// static snapshot in src/data/cards.json. Run with: npm run fetch-cards
// Needs TCG_API_KEY in .env. Each run costs roughly 13 of the 100 free daily requests.
import { writeFile, mkdir } from 'node:fs/promises';
import { cleanCardName } from './card-name.mjs';

process.loadEnvFile();
const API_KEY = process.env.TCG_API_KEY;
if (!API_KEY) throw new Error('TCG_API_KEY is missing from .env');

const API_URL = 'https://api.tcgapi.dev/v1';
const OUTPUT = new URL('../src/data/cards.json', import.meta.url);

const SETS = [
  { id: 5500171, slug: '151', name: '151' },
  { id: 5500017, slug: 'prismatic-evolutions', name: 'Prismatic Evolutions' },
  { id: 5500180, slug: 'surging-sparks', name: 'Surging Sparks' },
  { id: 5500138, slug: 'obsidian-flames', name: 'Obsidian Flames' },
];

// "Double Rare and up" - everything except the bulk rarities.
const EXCLUDED_RARITIES = new Set(['Common', 'Uncommon', 'Rare', 'Code Card']);

async function fetchPage(setId, page) {
  const res = await fetch(`${API_URL}/sets/${setId}/cards?per_page=100&page=${page}`, {
    headers: { 'X-API-Key': API_KEY },
  });
  if (!res.ok) throw new Error(`Set ${setId} page ${page}: HTTP ${res.status}`);
  return res.json();
}

async function fetchSet(set) {
  const products = [];
  let page = 1;
  let body;
  do {
    body = await fetchPage(set.id, page);
    products.push(...body.data);
    page += 1;
  } while (body.meta.has_more);
  console.log(`${set.name}: ${products.length} products, ${body.rate_limit.daily_remaining} requests left today`);
  return products;
}

function toCard(product, set) {
  return {
    id: product.id,
    name: cleanCardName(product.name),
    number: product.number,
    rarity: product.rarity,
    set: set.slug,
    price: product.market_price,
    image: product.image_url,
  };
}

const cards = [];
for (const set of SETS) {
  const products = await fetchSet(set);
  const chosen = products
    .filter(
      (p) =>
        p.product_type === 'Cards' &&
        p.rarity &&
        !EXCLUDED_RARITIES.has(p.rarity) &&
        p.market_price &&
        p.image_url,
    )
    .map((p) => toCard(p, set));
  console.log(`  kept ${chosen.length} cards`);
  cards.push(...chosen);
}

const snapshot = {
  pricesAsOf: new Date().toISOString().slice(0, 10),
  sets: SETS.map(({ slug, name }) => ({ slug, name })),
  cards,
};

await mkdir(new URL('.', OUTPUT), { recursive: true });
await writeFile(OUTPUT, JSON.stringify(snapshot, null, 2) + '\n');
console.log(`Saved ${cards.length} cards to src/data/cards.json`);
