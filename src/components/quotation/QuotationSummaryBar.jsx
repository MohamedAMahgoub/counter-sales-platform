import ActionButton from '../common/ActionButton'
import { formatEgpAmount } from '../../data/mockData'

/**
 * @param {object} props
 * @param {number} props.subtotal
 * @param {number} props.vatAmount
 * @param {number} props.grandTotal
 * @param {object} props.labels
 * @param {() => void} props.onCopyToOrder
 * @param {() => void} props.onSaveDraft
 * @param {boolean} props.copyToOrderDisabled
 * @param {number} [props.unavailableLinesCount]
 */
export default function QuotationSummaryBar({
  subtotal,
  vatAmount,
  grandTotal,
  labels,
  onCopyToOrder,
  onSaveDraft,
  copyToOrderDisabled,
  unavailableLinesCount = 0,
}) {
  const rowClass = 'flex w-full min-w-[200px] max-w-xs justify-between gap-6'

  return (
    <div className="sticky bottom-0 z-10 flex min-h-[120px] w-full shrink-0 items-center gap-8 border-t border-border bg-surface-card px-6 py-4">
      <div className="flex shrink-0 flex-col justify-center gap-1.5">
        <div className={rowClass}>
          <span className="text-left text-label text-text-secondary">{labels.subtotal}:</span>
          <span className="text-right text-body font-medium text-text-primary">
            {formatEgpAmount(subtotal)}
          </span>
        </div>
        <div className={rowClass}>
          <span className="text-left text-label text-text-secondary">{labels.vat}:</span>
          <span className="text-right text-body font-medium text-text-primary">
            {formatEgpAmount(vatAmount)}
          </span>
        </div>
        <div className="my-1 border-t border-border" />
        <div className={rowClass}>
          <span className="text-left text-label text-text-secondary">{labels.total}:</span>
          <span className="text-right text-amount font-bold text-[#1D3557]">
            {formatEgpAmount(grandTotal)}
          </span>
        </div>

        {unavailableLinesCount > 0 && (
          <p className="mt-1 max-w-xs text-label text-[#F39C12]">
            {unavailableLinesCount} {unavailableLinesCount === 1 ? 'line' : 'lines'}{' '}
            {labels.unavailableNoteSuffix}
          </p>
        )}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3 self-center">
        <ActionButton
          variant="secondary"
          label={labels.saveDraft}
          onClick={onSaveDraft}
        />
        <ActionButton
          variant={copyToOrderDisabled ? 'disabled' : 'primary'}
          label={labels.copyToOrder}
          onClick={copyToOrderDisabled ? undefined : onCopyToOrder}
        />
      </div>
    </div>
  )
}
