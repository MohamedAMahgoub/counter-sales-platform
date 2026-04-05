import { useEffect, useRef, useState } from 'react'
import ConsumptionBar from './ConsumptionBar'

function round2(n) {
  return Math.round(n * 100) / 100
}

function fmtPct(pct) {
  const r = round2(pct)
  return Math.abs(r - Math.round(r)) < 1e-9 ? String(Math.round(r)) : String(r)
}

function fmtVal(val) {
  return round2(val).toFixed(2)
}

function exceedsCeiling(pct, ceiling) {
  return round2(pct) > ceiling
}

/**
 * @param {object} props
 * @param {object} props.line   quotation line with discount, discountValue
 * @param {number} props.discountCeiling
 * @param {string} props.discountCeilingWarningText
 * @param {object} props.consumptionCopy
 * @param {(n: number) => string} props.formatEgp
 * @param {number} props.lineTotal
 * @param {string} props.deleteAriaLabel
 * @param {(id: string, payload: { discount: number, discountValue: number }) => void} props.onDiscountUpdate
 * @param {(id: string) => void} props.onRemoveLine
 */
export default function QuotationLineItem({
  line,
  discountCeiling,
  discountCeilingWarningText,
  consumptionCopy,
  formatEgp,
  lineTotal,
  deleteAriaLabel,
  onDiscountUpdate,
  onRemoveLine,
}) {
  const isFullyConsumed = line.qtyConsumed >= line.qtyQuoted
  const qtyRemaining = Math.max(0, line.qtyQuoted - line.qtyConsumed)

  const pctFocused = useRef(false)
  const valFocused = useRef(false)

  const [discountPctInput, setDiscountPctInput] = useState(() => fmtPct(line.discount))
  const [discountValInput, setDiscountValInput] = useState(() => fmtVal(line.discountValue))
  const [ceilingError, setCeilingError] = useState(
    () => exceedsCeiling(line.discount, discountCeiling),
  )

  useEffect(() => {
    if (!pctFocused.current) setDiscountPctInput(fmtPct(line.discount))
    if (!valFocused.current) setDiscountValInput(fmtVal(line.discountValue))
    if (!pctFocused.current && !valFocused.current) {
      setCeilingError(exceedsCeiling(line.discount, discountCeiling))
    }
  }, [line.id, line.discount, line.discountValue, discountCeiling])

  const commitPct = () => {
    let pct = Number.parseFloat(discountPctInput)
    if (Number.isNaN(pct) || discountPctInput.trim() === '') pct = 0
    pct = Math.max(0, Math.min(100, round2(pct)))
    const gross = round2(qtyRemaining * line.unitPrice)
    const dv = round2((pct / 100) * gross)
    onDiscountUpdate(line.id, { discount: pct, discountValue: dv })
    setDiscountPctInput(fmtPct(pct))
    setDiscountValInput(fmtVal(dv))
    setCeilingError(exceedsCeiling(pct, discountCeiling))
    pctFocused.current = false
  }

  const commitVal = () => {
    let val = Number.parseFloat(discountValInput)
    if (Number.isNaN(val) || discountValInput.trim() === '') val = 0
    const gross = round2(qtyRemaining * line.unitPrice)
    val = Math.max(0, Math.min(gross, round2(val)))
    const pct = gross > 0 ? Math.max(0, Math.min(100, round2((val / gross) * 100))) : 0
    onDiscountUpdate(line.id, { discount: pct, discountValue: val })
    setDiscountPctInput(fmtPct(pct))
    setDiscountValInput(fmtVal(val))
    setCeilingError(exceedsCeiling(pct, discountCeiling))
    valFocused.current = false
  }

  const rowBg = isFullyConsumed ? 'bg-[#F8F9FA] opacity-60' : 'bg-surface-card'
  const pctInputClass = ceilingError
    ? 'border-[#E74C3C] focus:border-[#E74C3C] focus:ring-[#E74C3C]'
    : 'border-border focus:border-border-focus focus:ring-border-focus'

  return (
    <tr className={`border-b border-border ${rowBg}`}>
      <td className="px-4 py-3 align-top text-body text-text-primary">
        {line.partNumber}
      </td>
      <td className="max-w-md px-4 py-3 align-top text-body text-text-primary">
        {line.description}
      </td>
      <td className="px-4 py-3 align-top text-body text-text-primary">
        {line.qtyQuoted}
      </td>
      <td className="px-4 py-3 align-top">
        <ConsumptionBar
          qtyQuoted={line.qtyQuoted}
          qtyConsumed={line.qtyConsumed}
          copy={consumptionCopy}
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3 align-top text-body text-text-primary">
        {formatEgp(line.unitPrice)}
      </td>
      <td className="px-4 py-3 align-top">
        <input
          type="text"
          inputMode="decimal"
          disabled={isFullyConsumed}
          value={discountPctInput}
          onChange={(e) => setDiscountPctInput(e.target.value)}
          onFocus={() => {
            pctFocused.current = true
            setCeilingError(false)
          }}
          onBlur={commitPct}
          className={`box-border h-9 w-16 rounded-input border bg-white px-2 py-1.5 text-right text-body text-text-primary focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted ${pctInputClass}`}
        />
        {ceilingError ? (
          <p className="mt-1 text-label text-[#E74C3C]">{discountCeilingWarningText}</p>
        ) : null}
      </td>
      <td className="px-4 py-3 align-top">
        <input
          type="text"
          inputMode="decimal"
          disabled={isFullyConsumed}
          value={discountValInput}
          onChange={(e) => setDiscountValInput(e.target.value)}
          onFocus={() => {
            valFocused.current = true
            setCeilingError(false)
          }}
          onBlur={commitVal}
          className="box-border h-9 w-[90px] rounded-input border border-border bg-white px-2 py-1.5 text-right text-body text-text-primary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted"
        />
      </td>
      <td className="whitespace-nowrap px-4 py-3 align-top text-body font-semibold text-text-primary">
        {isFullyConsumed ? '—' : formatEgp(lineTotal)}
      </td>
      <td className="px-4 py-3 align-top">
        {isFullyConsumed ? null : (
          <button
            type="button"
            aria-label={deleteAriaLabel}
            onClick={() => onRemoveLine(line.id)}
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
