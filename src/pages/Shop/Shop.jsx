import PageBand from '../../components/PageBand/PageBand.jsx'
import { CARDS, PRICES_AS_OF, SETS } from '../../lib/cards.js'
import { formatPricesDate } from '../../lib/format.js'

// The search, filters and product grid arrive in Phase 6.
export default function Shop() {
  return (
    <>
      <title>Shop · Holo Vault</title>
      <PageBand
        eyebrow={`${CARDS.length} cards · ${SETS.length} sets · Prices as of ${formatPricesDate(PRICES_AS_OF)}`}
        title="Shop the"
        highlight="vault."
      >
        Every card is Double Rare or higher, priced from TCGplayer market data.
      </PageBand>
      <div className="dotted page-content" />
    </>
  )
}
