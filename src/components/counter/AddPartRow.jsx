import { useRef } from 'react'

/**
 * @param {object} props
 * @param {string} props.placeholder
 * @param {number} props.colSpan
 */
export default function AddPartRow({ placeholder, colSpan }) {
  const inputRef = useRef(null)

  return (
    <tr
      className="cursor-text border-b border-dashed border-border bg-surface-card"
      onClick={() => inputRef.current?.focus()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          inputRef.current?.focus()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={placeholder}
    >
      <td colSpan={colSpan} className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="shrink-0 text-text-muted" aria-hidden>
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="1.5" height="18" rx="0.5" />
              <rect x="6.5" y="3" width="1" height="18" rx="0.5" />
              <rect x="9.5" y="3" width="1.5" height="18" rx="0.5" />
              <rect x="13" y="3" width="1" height="18" rx="0.5" />
              <rect x="15.5" y="3" width="2" height="18" rx="0.5" />
              <rect x="19" y="3" width="1" height="18" rx="0.5" />
              <rect x="21.5" y="3" width="1.5" height="18" rx="0.5" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="min-w-0 flex-1 border-0 bg-transparent text-body text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-0"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </td>
    </tr>
  )
}
