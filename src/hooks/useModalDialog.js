import { useEffect, useRef } from 'react'

// Props for a modal <dialog> that its parent shows by mounting and closes by
// unmounting. It opens as a true modal (page behind dimmed, not clickable or
// tabbable), puts focus on `initialFocusRef`, and calls `onClose` on Escape or
// a click on the dimmed backdrop instead of letting the browser close it.
export function useModalDialog(onClose, initialFocusRef) {
  const dialogRef = useRef(null)

  useEffect(() => {
    dialogRef.current.showModal()
    initialFocusRef?.current?.focus()
  }, [initialFocusRef])

  function cancel(event) {
    event.preventDefault()
    onClose()
  }

  return {
    ref: dialogRef,
    onCancel: cancel,
    onKeyDown: (event) => event.key === 'Escape' && cancel(event),
    // A click on the dimmed backdrop lands on the <dialog> itself
    onClick: (event) => event.target === event.currentTarget && onClose(),
  }
}
