import ActionButton from '../common/ActionButton'
import { formatEgpAmount } from '../../data/mockData'

/**
 * @param {object} props
 * @param {number} props.immediateTotal
 * @param {number} props.backorderTotal
 * @param {number} props.unavailableTotal
 * @param {number} props.subtotal
 * @param {number} props.vatAmount
 * @param {number} props.grandTotal
 * @param {object} props.labels
 * @param {{ value: string, label: string }[]} props.paymentOptions
 * @param {string} props.paymentPlaceholder
 * @param {string} props.paymentValue
 * @param {(value: string) => void} props.onPaymentChange
 * @param {boolean} props.creditBlockedActive
 * @param {boolean} props.showPaymentOptionalWarning
 * @param {string} props.paymentOptionalWarningText
 * @param {string} props.creditBlockedWarningText
 * @param {boolean} props.needsDiscountOverride
 * @param {() => void} props.onMainAction
 * @param {boolean} props.mainActionDisabled
 * @param {boolean} props.hasUnresolvedLines
 * @param {'idle'|'pending_override'|'pending_finance'} props.pageState
 * @param {() => void} props.onRequestOverride
 * @param {() => void} props.onCancelTransaction
 * @param {() => void} props.onWithdrawRequest
 * @param {string} [props.frozenPaymentLabel]
 */
export default function OrderSummaryBar({
  immediateTotal,
  backorderTotal,
  unavailableTotal = 0,
  subtotal,
  vatAmount,
  grandTotal,
  labels,
  paymentOptions,
  paymentPlaceholder,
  paymentValue,
  onPaymentChange,
  creditBlockedActive,
  showPaymentOptionalWarning,
  paymentOptionalWarningText,
  creditBlockedWarningText,
  needsDiscountOverride,
  onMainAction,
  mainActionDisabled,
  hasUnresolvedLines = false,
  pageState = 'idle',
  onRequestOverride,
  onCancelTransaction,
  onWithdrawRequest,
  frozenPaymentLabel = '',
}) {
  const isPending = pageState !== 'idle'

  const selectBorderClass =
    creditBlockedActive && !isPending ? 'border-[#E74C3C]' : 'border-border'

  const mainLabel = needsDiscountOverride
    ? labels.requestOverride
    : labels.confirm

  const rowClass = 'flex w-full min-w-[220px] max-w-sm justify-between gap-6'

  return (
    <div className="sticky bottom-0 z-10 flex min-h-[140px] w-full shrink-0 items-center gap-6 border-t border-border bg-surface-card px-6 py-4">
      {/* Totals stack */}
      <div className="flex shrink-0 flex-col justify-center gap-1.5">
        <div className={rowClass}>
          <span className="text-left text-label text-text-secondary">
            {labels.immediateTotal}:
          </span>
          <span className="text-right text-body font-medium text-text-primary">
            {formatEgpAmount(immediateTotal)}
          </span>
        </div>

        {backorderTotal > 0 && (
          <div className={rowClass}>
            <span className="text-left text-label text-text-secondary">
              {labels.backorderTotal}:
            </span>
            <span className="text-right text-body font-medium text-[#F39C12]">
              {formatEgpAmount(backorderTotal)}
            </span>
          </div>
        )}

        {unavailableTotal > 0 && (
          <div className={rowClass}>
            <span className="text-left text-label text-text-secondary">
              {labels.unavailableTotal}:
            </span>
            <span className="text-right text-body font-medium text-[#E74C3C]">
              {formatEgpAmount(unavailableTotal)}
            </span>
          </div>
        )}

        <div className={rowClass}>
          <span className="text-left text-label text-text-secondary">
            {labels.subtotal}:
          </span>
          <span className="text-right text-body font-medium text-text-primary">
            {formatEgpAmount(subtotal)}
          </span>
        </div>
        <div className={rowClass}>
          <span className="text-left text-label text-text-secondary">
            {labels.vat}:
          </span>
          <span className="text-right text-body font-medium text-text-primary">
            {formatEgpAmount(vatAmount)}
          </span>
        </div>
        <div className="my-1 border-t border-border" />
        <div className={rowClass}>
          <span className="text-left text-label text-text-secondary">
            {labels.total}:
          </span>
          <span className="text-right text-amount font-bold text-[#1D3557]">
            {formatEgpAmount(grandTotal)}
          </span>
        </div>
      </div>

      {/* Payment method */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-1">
        <p className="text-label font-medium text-text-secondary">
          {labels.paymentMethod}
        </p>

        {isPending ? (
          <div className="flex h-10 w-[200px] items-center rounded-input border border-border bg-surface px-3 text-body font-medium text-text-primary">
            {frozenPaymentLabel}
          </div>
        ) : (
          <select
            value={paymentValue}
            onChange={(e) => onPaymentChange(e.target.value)}
            className={`h-10 w-[200px] rounded-input border bg-white px-2 text-body text-text-primary focus:outline-none focus:ring-1 focus:ring-border-focus ${selectBorderClass}`}
          >
            <option value="" disabled>
              {paymentPlaceholder}
            </option>
            {paymentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {creditBlockedActive && !isPending && (
          <p className="text-label text-[#E74C3C]">{creditBlockedWarningText}</p>
        )}
        {showPaymentOptionalWarning && !paymentValue && !isPending && (
          <p className="text-label text-status-backorder">
            {paymentOptionalWarningText}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex shrink-0 flex-col items-stretch gap-2 self-center">
        {isPending ? (
          <ActionButton
            variant="secondary"
            label={labels.withdrawRequest}
            onClick={onWithdrawRequest}
          />
        ) : creditBlockedActive ? (
          <>
            <ActionButton
              variant="primary"
              label={labels.requestOverride}
              onClick={onRequestOverride}
            />
            <ActionButton
              variant="secondary"
              label={labels.cancelTransaction}
              onClick={onCancelTransaction}
            />
          </>
        ) : (
          <>
            <ActionButton
              variant={mainActionDisabled ? 'disabled' : 'primary'}
              label={mainLabel}
              onClick={mainActionDisabled ? undefined : onMainAction}
            />
            {hasUnresolvedLines && !mainActionDisabled && (
              <p className="max-w-[180px] text-center text-badge text-[#E74C3C]">
                {labels.outOfStockWarning}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
