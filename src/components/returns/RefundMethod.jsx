function round2(n) {
  return Math.round(n * 100) / 100
}

function lineReturnValue(line) {
  if (!line.selected || line.returnQty <= 0) return 0
  return round2(line.returnQty * line.unitPrice * (1 - line.discount / 100))
}

function ArrowsCircleIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

/**
 * @param {object} props
 * @param {object} props.invoice
 * @param {object[]} props.activeReturnLines  lines with selected=true, returnQty>0
 * @param {'same'|'credit_note'} props.refundMethod
 * @param {(method: string) => void} props.onRefundMethodChange
 * @param {object} props.labels
 * @param {(n: number) => string} props.formatEgp
 */
export default function RefundMethod({
  invoice,
  activeReturnLines,
  refundMethod,
  onRefundMethodChange,
  labels,
  formatEgp,
}) {
  const subtotal = activeReturnLines.reduce(
    (sum, l) => round2(sum + lineReturnValue(l)),
    0,
  )

  const sameMethodSublabel = `${invoice.paymentMethod} refund — mirrors ${invoice.id}`
  const isSame = refundMethod === 'same'

  return (
    <div className="mx-auto w-full max-w-[600px] px-0 py-8">
      <div className="w-full rounded-card border border-border bg-surface-card p-6">

        {/* ── Section 1: Return summary (read-only) ── */}
        <h3 className="mb-3 text-body font-semibold text-text-primary">
          {labels.refundMethodReturnSummaryTitle}
        </h3>
        <div className="mb-6 overflow-hidden rounded-input border border-border bg-surface-card">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-3 py-2.5 text-label font-semibold text-text-secondary">
                  {labels.columnPartNumber}
                </th>
                <th className="px-3 py-2.5 text-label font-semibold text-text-secondary">
                  {labels.columnDescription}
                </th>
                <th className="px-3 py-2.5 text-label font-semibold text-text-secondary">
                  {labels.columnReturnQty}
                </th>
                <th className="px-3 py-2.5 text-label font-semibold text-text-secondary">
                  {labels.columnReturnValue}
                </th>
              </tr>
            </thead>
            <tbody>
              {activeReturnLines.map((line) => (
                <tr key={line.id} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2.5 text-body text-text-primary">{line.partNumber}</td>
                  <td className="px-3 py-2.5 text-body text-text-primary">{line.description}</td>
                  <td className="px-3 py-2.5 text-body text-text-primary">{line.returnQty}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-body font-semibold text-text-primary">
                    {formatEgp(lineReturnValue(line))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-end border-t border-border bg-surface px-3 py-2.5">
            <span className="text-label text-text-secondary mr-4">{labels.selectionSubtotalLabel}:</span>
            <span className="text-body font-bold text-text-primary">{formatEgp(subtotal)}</span>
          </div>
        </div>

        {/* ── Section 2: Refund method selector ── */}
        <h3 className="mb-3 text-body font-semibold text-text-primary">
          {labels.refundMethodSectionLabel}
        </h3>
        <div className="mb-4 flex gap-4">
          {/* Option A — Same as original */}
          <button
            type="button"
            onClick={() => onRefundMethodChange('same')}
            className={`flex flex-1 flex-col items-start gap-2 rounded-input border-2 bg-surface-card p-4 text-left transition-colors ${
              isSame ? 'border-[#27AE60]' : 'border-border hover:border-border-focus'
            }`}
          >
            <div className={`rounded-full p-2 ${isSame ? 'bg-[#E8F5E9] text-[#27AE60]' : 'bg-surface text-text-secondary'}`}>
              <ArrowsCircleIcon />
            </div>
            <p className="text-body font-semibold text-text-primary">
              {labels.refundMethodSameLabel}
            </p>
            <p className="text-label text-text-secondary">{sameMethodSublabel}</p>
          </button>

          {/* Option B — Credit note */}
          <button
            type="button"
            onClick={() => onRefundMethodChange('credit_note')}
            className={`flex flex-1 flex-col items-start gap-2 rounded-input border-2 bg-surface-card p-4 text-left transition-colors ${
              !isSame ? 'border-brand-navy' : 'border-border hover:border-border-focus'
            }`}
          >
            <div className={`rounded-full p-2 ${!isSame ? 'bg-[#EBF5FB] text-brand-navy' : 'bg-surface text-text-secondary'}`}>
              <DocumentIcon />
            </div>
            <p className="text-body font-semibold text-text-primary">
              {labels.refundMethodCreditNoteLabel}
            </p>
            <p className="text-label text-text-secondary">
              {labels.refundMethodCreditNoteSublabel}
            </p>
          </button>
        </div>

        {/* Credit note warning */}
        {!isSame && (
          <div className="mb-4 flex items-start gap-3 rounded-input border border-[#F39C12]/40 bg-[#FFF8E1] px-4 py-3">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#F39C12]" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-label text-[#7D6608]">{labels.refundMethodCreditNoteWarning}</p>
          </div>
        )}

        {/* ── Section 3: Refund timing ── */}
        <div className="flex items-center gap-3 rounded-input border border-border bg-surface px-4 py-3">
          <span className="text-label font-medium text-text-secondary">
            {labels.refundMethodTimingLabel}:
          </span>
          {isSame ? (
            <span className="rounded-badge bg-[#E8F5E9] px-2.5 py-0.5 text-badge font-semibold text-[#1E8449]">
              {labels.refundMethodTimingImmediate}
            </span>
          ) : (
            <span className="rounded-badge bg-[#FFF3CD] px-2.5 py-0.5 text-badge font-semibold text-[#856404]">
              {labels.refundMethodTimingPending}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
