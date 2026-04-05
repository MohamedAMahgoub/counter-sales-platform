/**
 * @param {object} props
 * @param {number} props.qtyQuoted
 * @param {number} props.qtyConsumed
 * @param {object} props.copy  consumptionBarCopy from mockData
 */
export default function ConsumptionBar({ qtyQuoted, qtyConsumed, copy }) {
  const isFullyConsumed = qtyConsumed >= qtyQuoted
  const pct =
    qtyQuoted > 0 ? Math.min(100, Math.round((qtyConsumed / qtyQuoted) * 100)) : 0

  if (isFullyConsumed) {
    return (
      <div className="flex flex-col gap-1">
        <span className="inline-flex w-fit items-center rounded-badge bg-[#FFEBEE] px-2.5 py-0.5 text-badge font-medium text-[#C62828]">
          {copy.fullyConsumedLabel}
        </span>
        <p className="text-label text-text-muted">{copy.fullyConsumedMessage}</p>
      </div>
    )
  }

  const remaining = qtyQuoted - qtyConsumed

  return (
    <div className="flex min-w-[140px] flex-col gap-1">
      <div className="relative h-2 overflow-hidden rounded-full bg-border">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-brand-secondary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-label text-text-secondary">
        {qtyConsumed} {copy.ofLabel} {qtyQuoted} {copy.convertedSuffix}
        <span className="ml-1 font-medium text-text-primary">
          ({remaining} remaining)
        </span>
      </p>
    </div>
  )
}
