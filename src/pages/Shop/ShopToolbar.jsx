import { useRef } from 'react'
import { ALL_SETS, CARDS, SETS, SORT_OPTIONS, getSetName } from '../../lib/cards.js'
import styles from './Shop.module.css'

const SET_FILTERS = [{ slug: ALL_SETS, name: 'All sets' }, ...SETS]

function describeResults({ query, set, resultCount }) {
  const trimmed = query.trim()
  if (!trimmed) {
    return set === ALL_SETS
      ? `${CARDS.length} cards`
      : `${resultCount} ${resultCount === 1 ? 'card' : 'cards'} in ${getSetName(set)}`
  }
  const matches = `${resultCount} ${resultCount === 1 ? 'card matches' : 'cards match'} “${trimmed}”`
  return set === ALL_SETS ? matches : `${matches} in ${getSetName(set)}`
}

export default function ShopToolbar({ filters, resultCount }) {
  const { query, set, sort, setQuery, setSet, setSort } = filters
  const searchRef = useRef(null)

  function clearSearch() {
    setQuery('')
    searchRef.current?.focus()
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.searchRow}>
        <div role="search" className={styles.search}>
          <label htmlFor="card-search" className="visually-hidden">
            Search cards by name
          </label>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
          <input
            ref={searchRef}
            id="card-search"
            type="search"
            autoComplete="off"
            className={styles.searchInput}
            placeholder="Search cards, e.g. Charizard"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button type="button" className={styles.clear} onClick={clearSearch} aria-label="Clear search">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>
        <div className={styles.sort}>
          <label htmlFor="card-sort" className="visually-hidden">
            Sort cards
          </label>
          <select id="card-sort" className={styles.sortSelect} value={sort} onChange={(event) => setSort(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg className={styles.sortIcon} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </div>

      <div className={styles.filterRow}>
        <div role="group" aria-label="Filter by set" className={styles.sets}>
          {SET_FILTERS.map(({ slug, name }) => (
            <button
              key={slug}
              type="button"
              className={styles.setButton}
              aria-pressed={set === slug}
              onClick={() => setSet(slug)}
            >
              {name}
            </button>
          ))}
        </div>
        <p className={styles.count} aria-live="polite">
          {describeResults({ query, set, resultCount })}
        </p>
      </div>
    </div>
  )
}
