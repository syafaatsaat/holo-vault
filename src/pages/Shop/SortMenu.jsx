import { useEffect, useId, useRef, useState } from 'react'
import styles from './Shop.module.css'

// A styled stand-in for <select>, whose open list browsers don't let us style.
// It follows the "select-only combobox" pattern from the ARIA Authoring
// Practices, so it reads and works like a native select: ↑/↓/Home/End move,
// Enter or Space picks, Escape closes without changing anything, and a click
// outside closes it.
export default function SortMenu({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const id = useId()
  const labelId = `${id}-label`
  const listId = `${id}-list`
  const optionId = (index) => `${id}-option-${index}`
  const selected = Math.max(0, options.findIndex((option) => option.value === value))
  const last = options.length - 1

  function openList(index = selected) {
    setActive(index)
    setOpen(true)
  }

  function choose(index) {
    onChange(options[index].value)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function onKeyDown(event) {
    if (!open) {
      const startAt = { ArrowDown: selected, ArrowUp: selected, Enter: selected, ' ': selected, Home: 0, End: last }
      if (event.key in startAt) {
        event.preventDefault()
        openList(startAt[event.key])
      }
      return
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive(Math.min(active + 1, last))
        break
      case 'ArrowUp':
        event.preventDefault()
        if (event.altKey) choose(active)
        else setActive(Math.max(active - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
        event.preventDefault()
        setActive(last)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(active)
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        choose(active)
        break
    }
  }

  return (
    <div ref={rootRef} className={`${styles.sort} ${open ? styles.sortOpen : ''}`}>
      <span id={labelId} className="visually-hidden">
        {label}
      </span>
      <div
        role="combobox"
        tabIndex={0}
        aria-labelledby={labelId}
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-activedescendant={open ? optionId(active) : undefined}
        className={styles.sortSelect}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        {options[selected].label}
      </div>
      <svg className={styles.sortIcon} viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 9l6 6 6-6" />
      </svg>
      {/* Pressing on an option mustn't take focus off the combobox */}
      <ul
        id={listId}
        role="listbox"
        aria-labelledby={labelId}
        tabIndex={-1}
        hidden={!open}
        className={styles.sortList}
        onMouseDown={(event) => event.preventDefault()}
      >
        {options.map((option, index) => (
          <li
            key={option.value}
            id={optionId(index)}
            role="option"
            aria-selected={index === selected}
            className={`${styles.sortOption} ${index === active ? styles.sortOptionActive : ''}`}
            onMouseEnter={() => setActive(index)}
            onClick={() => choose(index)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
