const variantStyles = {
  available:
    'bg-badge-available-bg text-badge-available-text',
  backorder:
    'bg-badge-backorder-bg text-badge-backorder-text',
  pending:
    'bg-badge-pending-bg text-badge-pending-text',
  blocked:
    'bg-badge-blocked-bg text-badge-blocked-text',
  approved:
    'bg-badge-approved-bg text-badge-approved-text',
  rejected:
    'bg-badge-rejected-bg text-badge-rejected-text',
  draft:
    'bg-badge-draft-bg text-badge-draft-text',
  consumed:
    'bg-badge-consumed-bg text-badge-consumed-text',
  expired:
    'bg-badge-expired-bg text-badge-expired-text',
}

/**
 * @param {object} props
 * @param {'available'|'backorder'|'pending'|'blocked'|'approved'|'rejected'|'draft'|'consumed'|'expired'} props.variant
 * @param {string} props.label
 * @param {string} [props.className]
 */
export default function StatusBadge({ variant, label, className = '' }) {
  const styles = variantStyles[variant] ?? variantStyles.pending

  return (
    <span
      className={`inline-flex items-center justify-center rounded-badge px-2.5 py-0.5 text-badge font-medium ${styles} ${className}`.trim()}
    >
      {label}
    </span>
  )
}
