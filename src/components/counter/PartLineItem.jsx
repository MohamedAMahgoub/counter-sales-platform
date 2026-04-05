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
 * @param {(n: number) => string} props.formatEgp
 * @param {number} props.lineTotal
 * @param {string} props.deleteAriaLabel
 * @param {(id: string, qty: number) => void} props.onQtyChange
 * @param {(id: string, payload: { discount: number, discountValue: number }) => void} props.onDiscountUpdate
 * @param {(id: string) => void} props.onRemoveLine
 */
export default function PartLineItem({
  part,
  discountCeiling,
  discountCeilingWarningText,
  availabilityCopy,
  formatEgp,
  lineTotal,
  deleteAriaLabel,
  onQtyChange,
  onDiscountUpdate,
  onRemoveLine,
  readOnly = false,
}) {
  const isBackorder = part.availability === 'backorder'
  const rowBg = isBackorder ? 'bg-[#FFFBF0]' : 'bg-surface-card'

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

  const availabilityLabel =
    isBackorder &&
    part.sourceBranch != null &&
    part.etaDays != null
      ? `${availabilityCopy.backorderedLabel} · ${part.sourceBranch} · ${availabilityCopy.etaPrefix} ${part.etaDays} ${availabilityCopy.daysWord}`
      : `${availabilityCopy.availableLabel} · ${part.stockQty} ${availabilityCopy.inStock}`

  const pctInputClass = ceilingErrorVisible
    ? 'border-[#E74C3C] focus:border-[#E74C3C] focus:ring-[#E74C3C]'
    : 'border-border focus:border-border-focus focus:ring-border-focus'

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
      <td className="px-4 py-3 align-top">
        <span
          className={`inline-flex max-w-[280px] rounded-full px-3 py-1 text-badge font-medium text-white ${
            isBackorder ? 'bg-[#F39C12]' : 'bg-[#27AE60]'
          }`}
        >
          {availabilityLabel}
        </span>
      </td>
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
        {!readOnly && <button
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
        </button>}
      </td>
    </tr>
  )
}
