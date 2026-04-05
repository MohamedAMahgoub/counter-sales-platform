const valueToneStyles = {
  default: 'text-text-primary',
  warning: 'text-status-backorder',
  alert: 'text-status-alert',
}

/**
 * @param {object} props
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {'default'|'warning'|'alert'} [props.valueTone]
 * @param {string} [props.className]
 */
export default function MetricCard({
  label,
  value,
  valueTone = 'default',
  className = '',
}) {
  const valueClass = valueToneStyles[valueTone] ?? valueToneStyles.default

  return (
    <div
      className={`rounded-card border border-border bg-surface px-4 py-3 ${className}`.trim()}
    >
      <p className="text-label font-medium text-text-secondary">{label}</p>
      <p className={`mt-1 text-amount font-bold ${valueClass}`}>{value}</p>
    </div>
  )
}
