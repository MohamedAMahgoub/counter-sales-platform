const variantStyles = {
  primary:
    'border border-transparent bg-brand-navy text-white hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
  secondary:
    'border border-brand-navy bg-transparent text-brand-navy hover:bg-brand-navy/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus',
  destructive:
    'border border-status-alert bg-transparent text-status-alert hover:bg-status-alert/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-alert',
  disabled:
    'cursor-not-allowed border border-border bg-surface text-text-muted opacity-80',
}

/**
 * @param {object} props
 * @param {'primary'|'secondary'|'destructive'|'disabled'} props.variant
 * @param {string} props.label
 * @param {() => void} [props.onClick]
 * @param {'button'|'submit'|'reset'} [props.type]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.leadingSlot]
 */
export default function ActionButton({
  variant,
  label,
  onClick,
  type = 'button',
  className = '',
  leadingSlot,
}) {
  const isDisabled = variant === 'disabled'
  const styles = variantStyles[variant] ?? variantStyles.primary

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      className={`inline-flex h-11 min-w-[7rem] items-center justify-center gap-2 rounded-input px-4 text-body font-medium transition-colors ${styles} ${className}`.trim()}
    >
      {leadingSlot ? (
        <span className="flex shrink-0 items-center" aria-hidden>
          {leadingSlot}
        </span>
      ) : null}
      {label}
    </button>
  )
}
