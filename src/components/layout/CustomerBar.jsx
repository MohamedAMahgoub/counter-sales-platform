import StatusBadge from '../common/StatusBadge'

const creditBorderClass = {
  ok: 'border-l-[#27AE60]',
  warning: 'border-l-[#F39C12]',
  blocked: 'border-l-[#E74C3C]',
}

const creditBadgeVariant = {
  ok: 'available',
  warning: 'backorder',
  blocked: 'blocked',
}

const availableValueClass = {
  ok: 'text-[#27AE60]',
  warning: 'text-[#F39C12]',
  blocked: 'text-[#E74C3C]',
}

function initialsFromName(name) {
  if (!name || typeof name !== 'string') return ''
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function formatCurrency(amount, currencyCode) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * @param {object} props
 * @param {object} props.customer
 * @param {'ok'|'warning'|'blocked'} props.creditStatus
 * @param {{ customerIdPrefix: string, separator: string, loadedViaPrefix: string }} props.subtitleLabels
 * @param {string} [props.statusBadgeLabel] — overrides customer.creditStatusLabel when set
 */
export default function CustomerBar({
  customer,
  creditStatus,
  subtitleLabels,
  statusBadgeLabel,
}) {
  const borderClass = creditBorderClass[creditStatus] ?? creditBorderClass.ok
  const badgeVariant = creditBadgeVariant[creditStatus] ?? creditBadgeVariant.ok
  const availableToneClass =
    availableValueClass[creditStatus] ?? availableValueClass.ok
  const available = Math.max(0, customer.creditLimit - customer.exposure)

  const subtitleLine = [
    `${subtitleLabels.customerIdPrefix} ${customer.id}`,
    `${subtitleLabels.loadedViaPrefix} ${customer.loadedViaDisplay}`,
  ].join(` ${subtitleLabels.separator} `)

  const chips = [
    {
      key: 'limit',
      label: customer.creditChipLabels.limit,
      value: formatCurrency(customer.creditLimit, customer.currency),
      valueClass: 'text-text-primary',
    },
    {
      key: 'exposure',
      label: customer.creditChipLabels.exposure,
      value: formatCurrency(customer.exposure, customer.currency),
      valueClass: 'text-text-primary',
    },
    {
      key: 'available',
      label: customer.creditChipLabels.available,
      value: formatCurrency(available, customer.currency),
      valueClass: availableToneClass,
    },
  ]

  return (
    <div
      className={`flex min-h-[72px] w-full min-w-desktop shrink-0 items-stretch gap-6 border-b border-border border-l-4 border-solid bg-surface-card py-3 pl-6 pr-6 ${borderClass}`}
    >
      <div
        className="flex h-11 w-11 shrink-0 self-center items-center justify-center rounded-full bg-brand-navy text-body font-semibold text-white"
        aria-hidden
      >
        {initialsFromName(customer.name)}
      </div>

      <div className="flex min-w-0 flex-col justify-center gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-body font-bold text-text-primary">
            {customer.name}
          </span>
          <span className="inline-flex w-fit shrink-0 rounded-badge border border-border bg-surface px-2.5 py-0.5 text-badge font-medium text-text-secondary">
            {customer.type}
          </span>
        </div>
        <p className="text-label text-text-secondary">{subtitleLine}</p>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2 self-center">
        {chips.map((chip) => (
          <div
            key={chip.key}
            className="rounded-input border border-border bg-surface px-3 py-1.5"
          >
            <p className="text-label font-medium text-text-secondary">
              {chip.label}
            </p>
            <p className={`text-body font-semibold ${chip.valueClass}`}>
              {chip.value}
            </p>
          </div>
        ))}
      </div>

      <div className="ml-auto flex shrink-0 items-center self-center">
        <StatusBadge
          variant={badgeVariant}
          label={statusBadgeLabel ?? customer.creditStatusLabel}
        />
      </div>
    </div>
  )
}
