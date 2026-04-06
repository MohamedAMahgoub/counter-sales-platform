import { useEffect, useRef, useState } from 'react'

function round2(n) {
  return Math.round(n * 100) / 100
}

function formatPctInputString(pct) {
  const r = round2(pct)
  if (Math.abs(r - Math.round(r)) < 1e-9) return String(Math.round(r))
  return String(r)
}

function formatValInputString(val) {
  return round2(val).toFixed(2)
}

function discountExceedsCeiling(pct, ceiling) {
  return round2(pct) > ceiling
}

/**
 * @param {object} props
 * @param {object} props.part
 * @param {number} props.discountCeiling
 * @param {string} props.discountCeilingWarningText
 * @param {object} props.availabilityCopy
 * @param {{ id: string, name: string }[]} props.branches  — non-current source branches
 * @param {(n: number) => string} props.formatEgp
 * @param {number} props.lineTotal
 * @param {string} props.deleteAriaLabel
 * @param {(id: string, qty: number) => void} props.onQtyChange
 * @param {(id: string, payload: { discount: number, discountValue: number }) => void} props.onDiscountUpdate
 * @param {(id: string) => void} props.onRemoveLine
 * @param {(id: string) => void} props.onSetBackorder
 * @param {(id: string) => void} props.onCancelBackorder
 * @param {(id: string, branchName: string) => void} props.onSelectBranch
 * @param {boolean} [props.readOnly]
 */
export default function PartLineItem({
  part,
  discountCeiling,
  discountCeilingWarningText,
  availabilityCopy,
  branches = [],
  formatEgp,
  lineTotal,
  deleteAriaLabel,
  onQtyChange,
  onDiscountUpdate,
  onRemoveLine,
  onSetBackorder = () => {},
  onCancelBackorder = () => {},
  onSelectBranch = () => {},
  readOnly = false,
}) {
  const av = part.availability
  const isBackorder = av === 'backorder'
  const isUnavailable = av === 'unavailable'

  const rowBg = isBackorder
    ? 'bg-[#FFFBF0]'
    : isUnavailable
      ? 'bg-[#FEF9F9]'
      : 'bg-surface-card'

  const pctFocused = useRef(false)
  const valFocused = useRef(false)

  const [discountPctInput, setDiscountPctInput] = useState(() =>
    formatPctInputString(part.discount),
  )
  const [discountValInput, setDiscountValInput] = useState(() =>
    formatValInputString(part.discountValue),
  )
  const [ceilingErrorVisible, setCeilingErrorVisible] = useState(
    () => discountExceedsCeiling(part.discount, discountCeiling),
  )

  useEffect(() => {
    if (!pctFocused.current) {
      setDiscountPctInput(formatPctInputString(part.discount))
    }
    if (!valFocused.current) {
      setDiscountValInput(formatValInputString(part.discountValue))
    }
    if (!pctFocused.current && !valFocused.current) {
      setCeilingErrorVisible(
        discountExceedsCeiling(part.discount, discountCeiling),
      )
    }
  }, [part.id, part.discount, part.discountValue, discountCeiling])

  const commitPct = () => {
    let pct = Number.parseFloat(discountPctInput)
    if (Number.isNaN(pct) || discountPctInput.trim() === '') pct = 0
    pct = Math.max(0, Math.min(100, round2(pct)))
    const gross = round2(part.qty * part.unitPrice)
    const dv = round2((pct / 100) * gross)
    onDiscountUpdate(part.id, { discount: pct, discountValue: dv })
    setDiscountPctInput(formatPctInputString(pct))
    setDiscountValInput(formatValInputString(dv))
    setCeilingErrorVisible(discountExceedsCeiling(pct, discountCeiling))
    pctFocused.current = false
  }

  const commitVal = () => {
    let val = Number.parseFloat(discountValInput)
    if (Number.isNaN(val) || discountValInput.trim() === '') val = 0
    const gross = round2(part.qty * part.unitPrice)
    val = Math.max(0, Math.min(gross, round2(val)))
    const pct =
      gross > 0 ? Math.max(0, Math.min(100, round2((val / gross) * 100))) : 0
    onDiscountUpdate(part.id, { discount: pct, discountValue: val })
    setDiscountPctInput(formatPctInputString(pct))
    setDiscountValInput(formatValInputString(val))
    setCeilingErrorVisible(discountExceedsCeiling(pct, discountCeiling))
    valFocused.current = false
  }

  const pctInputClass = ceilingErrorVisible
    ? 'border-[#E74C3C] focus:border-[#E74C3C] focus:ring-[#E74C3C]'
    : 'border-border focus:border-border-focus focus:ring-border-focus'

  // ─── Availability cell content ───────────────────────────────────────────────
  let availabilityCell

  if (av === 'available') {
    availabilityCell = (
      <span className="inline-flex rounded-full bg-[#27AE60] px-3 py-1 text-badge font-medium text-white">
        {availabilityCopy.availableLabel} · {part.stockQty} {availabilityCopy.inStock}
      </span>
    )
  } else if (isUnavailable) {
    availabilityCell = (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-full bg-[#E74C3C] px-3 py-1 text-badge font-medium text-white">
          {availabilityCopy.unavailableLabel}
        </span>
        {!readOnly && (
          <button
            type="button"
            onClick={() => onSetBackorder(part.id)}
            className="text-label font-medium text-brand-navy hover:underline focus-visible:outline-none"
          >
            {availabilityCopy.backorderLinkLabel}
          </button>
        )}
      </div>
    )
  } else {
    // backorder — with or without source branch
    const hasBranch = Boolean(part.sourceBranch)
    const badgeLabel = hasBranch
      ? `${availabilityCopy.backorderedLabel} · ${part.sourceBranch}`
      : availabilityCopy.backorderedLabel

    availabilityCell = (
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-full bg-[#F39C12] px-3 py-1 text-badge font-medium text-white">
          {badgeLabel}
        </span>

        {!readOnly && (
          hasBranch ? (
            <button
              type="button"
              onClick={() => onCancelBackorder(part.id)}
              aria-label="Cancel backorder"
              className="flex h-5 w-5 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-red-100 hover:text-red-600 focus-visible:outline-none"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) onSelectBranch(part.id, e.target.value)
              }}
              className="h-8 w-[180px] rounded-input border border-border bg-white px-2 text-label text-text-primary focus:outline-none focus:ring-1 focus:ring-border-focus"
            >
              <option value="" disabled>
                {availabilityCopy.branchSelectPlaceholder}
              </option>
              {branches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          )
        )}

        {/* Show error only when unresolved and not read-only */}
        {!hasBranch && !readOnly && (
          <p className="mt-0.5 w-full text-label text-[#E74C3C]">
            {availabilityCopy.branchSelectError}
          </p>
        )}
      </div>
    )
  }

  return (
    <tr className={`border-b border-border ${rowBg}`}>
      <td className="px-4 py-3 align-top text-body text-text-primary">
        {part.partNumber}
      </td>
      <td className="max-w-md px-4 py-3 align-top text-body text-text-primary">
        {part.description}
      </td>
      <td className="px-4 py-3 align-top">
        <input
          type="number"
          min={1}
          step={1}
          value={part.qty}
          disabled={readOnly}
          onChange={(e) => {
            const n = Number.parseInt(e.target.value, 10)
            if (Number.isNaN(n) || n < 1) return
            onQtyChange(part.id, n)
          }}
          className="w-16 rounded-input border border-border bg-white px-2 py-1.5 text-body text-text-primary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted"
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3 align-top text-body text-text-primary">
        {formatEgp(part.unitPrice)}
      </td>
      <td className="px-4 py-3 align-top">{availabilityCell}</td>
      <td className="px-4 py-3 align-top">
        <input
          type="text"
          inputMode="decimal"
          value={discountPctInput}
          disabled={readOnly}
          onChange={(e) => setDiscountPctInput(e.target.value)}
          onFocus={() => {
            pctFocused.current = true
            setCeilingErrorVisible(false)
          }}
          onBlur={commitPct}
          className={`box-border h-9 w-16 rounded-input border bg-white px-2 py-1.5 text-right text-body text-text-primary focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted ${pctInputClass}`}
        />
        {ceilingErrorVisible && !readOnly ? (
          <p className="mt-1 text-label text-[#E74C3C]">
            {discountCeilingWarningText}
          </p>
        ) : null}
      </td>
      <td className="px-4 py-3 align-top">
        <input
          type="text"
          inputMode="decimal"
          value={discountValInput}
          disabled={readOnly}
          onChange={(e) => setDiscountValInput(e.target.value)}
          onFocus={() => {
            valFocused.current = true
            setCeilingErrorVisible(false)
          }}
          onBlur={commitVal}
          className="box-border h-9 w-[90px] rounded-input border border-border bg-white px-2 py-1.5 text-right text-body text-text-primary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted"
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3 align-top text-body font-semibold text-text-primary">
        {formatEgp(lineTotal)}
      </td>
      <td className="px-4 py-3 align-top">
        {!readOnly && (
          <button
            type="button"
            aria-label={deleteAriaLabel}
            onClick={() => onRemoveLine(part.id)}
            className="flex h-8 w-8 items-center justify-center rounded-input text-text-secondary hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </td>
    </tr>
  )
}
