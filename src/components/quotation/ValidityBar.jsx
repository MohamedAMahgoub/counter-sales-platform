import StatusBadge from '../common/StatusBadge'

/**
 * @param {object} props
 * @param {string} props.quotationId
 * @param {'open'|'draft'|'expired'|'consumed'} props.quotationStatus
 * @param {string} props.quotationStatusLabel
 * @param {string} props.quotationStatusVariant
 * @param {string} props.validityDate  ISO date YYYY-MM-DD
 * @param {(date: string) => void} props.onValidityDateChange
 * @param {number} props.totalUnits
 * @param {number} props.consumedUnits
 * @param {object} props.labels
 */
export default function ValidityBar({
  quotationId,
  quotationStatus,
  quotationStatusLabel,
  quotationStatusVariant,
  validityDate,
  onValidityDateChange,
  totalUnits,
  consumedUnits,
  labels,
}) {
  const consumedPct =
    totalUnits > 0 ? Math.min(100, Math.round((consumedUnits / totalUnits) * 100)) : 0

  let progressColor = 'bg-[#27AE60]'
  if (consumedPct >= 100) progressColor = 'bg-[#E74C3C]'
  else if (consumedPct >= 75) progressColor = 'bg-[#F39C12]'

  return (
    <div className="flex h-[52px] w-full min-w-desktop shrink-0 items-center gap-6 border-b border-border bg-surface-card px-6">
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-body font-semibold text-text-primary">
          {labels.quotationPrefix}:
        </span>
        <span className="text-body font-mono text-text-secondary">{quotationId}</span>
        <StatusBadge variant={quotationStatusVariant} label={quotationStatusLabel} />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <label
          htmlFor="validity-date"
          className="whitespace-nowrap text-label font-medium text-text-secondary"
        >
          {labels.validUntilLabel}:
        </label>
        <input
          id="validity-date"
          type="date"
          value={validityDate}
          onChange={(e) => onValidityDateChange(e.target.value)}
          className="h-8 rounded-input border border-border bg-white px-2 text-body text-text-primary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus"
        />
      </div>

      <div className="flex flex-1 items-center gap-3">
        <div className="h-2 min-w-[140px] flex-1 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full transition-all ${progressColor}`}
            style={{ width: `${consumedPct}%` }}
          />
        </div>
        <span className="whitespace-nowrap text-label text-text-secondary">
          {consumedUnits} / {totalUnits} {labels.unitsConvertedSuffix}
        </span>
      </div>
    </div>
  )
}
