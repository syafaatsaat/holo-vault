// TCGplayer product names repeat the card number, e.g. "Charizard ex - 006/165",
// "Ninetales -199/197" or "Mew ex - 205/165 (151 Metal Card)". The number is stored
// separately, so drop it wherever it appears and keep any bracketed variant note.
export function cleanCardName(name) {
  return name
    .replace(/\s*-\s*\d+\/\d+/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
