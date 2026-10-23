import PageBand from '../../components/PageBand/PageBand.jsx'
import { CARDS, PRICES_AS_OF, SETS, filterCards } from '../../lib/cards.js'
import { formatPricesDate } from '../../lib/format.js'
import ShopResults from './ShopResults.jsx'
import ShopToolbar from './ShopToolbar.jsx'
import styles from './Shop.module.css'
import { useShopFilters } from './useShopFilters.js'

export default function Shop() {
  const filters = useShopFilters()
  const { query, set, sort } = filters
  const results = filterCards({ query, set, sort })

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
      <div className="page-content">
        <div className={styles.shop}>
          <ShopToolbar filters={filters} resultCount={results.length} />
          {/* Keyed on the filters so "Show more" starts over at 24 whenever they change */}
          <ShopResults key={`${query}|${set}|${sort}`} cards={results} onReset={filters.reset} />
        </div>
      </div>
    </>
  )
}
