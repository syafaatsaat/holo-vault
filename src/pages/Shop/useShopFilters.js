import { useSearchParams } from 'react-router'
import { ALL_SETS, DEFAULT_SORT, isKnownSet, isKnownSort } from '../../lib/cards.js'

// The Shop's search, set and sort live in the URL (/shop?q=chari&set=151&sort=price-asc)
// so they can be linked to and survive leaving and coming back. Defaults are left out
// of the URL, and unknown values fall back to the defaults.
export function useShopFilters() {
  const [params, setParams] = useSearchParams()

  const query = params.get('q') ?? ''
  const setParam = params.get('set')
  const sortParam = params.get('sort')
  const set = isKnownSet(setParam) ? setParam : ALL_SETS
  const sort = isKnownSort(sortParam) ? sortParam : DEFAULT_SORT

  function update(changes) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [key, value] of Object.entries(changes)) {
          const isDefault =
            value === '' || (key === 'set' && value === ALL_SETS) || (key === 'sort' && value === DEFAULT_SORT)
          if (isDefault) next.delete(key)
          else next.set(key, value)
        }
        return next
      },
      // Update in place so typing doesn't add a history entry per letter.
      { replace: true, preventScrollReset: true },
    )
  }

  return {
    query,
    set,
    sort,
    setQuery: (value) => update({ q: value }),
    setSet: (value) => update({ set: value }),
    setSort: (value) => update({ sort: value }),
    reset: () => update({ q: '', set: ALL_SETS, sort: DEFAULT_SORT }),
  }
}
