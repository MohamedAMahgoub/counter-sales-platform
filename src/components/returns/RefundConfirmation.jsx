function round2(n) {
  return Math.round(n * 100) / 100
}

/**
 * @param {object} props
 * @param {object} props.invoice
 * @param {object[]} props.activeReturnLines  lines with selected=true, returnQty>0
 * @param {object} props.labels
 * @param {(n: number) => string} props.formatEgp
 * @param {boolean} props.confirmed
 */
export default function RefundConfirmation({
  invoice,
  activeReturnLines,
  labels,
  formatEgp,
  confirmed,
}) {
  const subtotal = activeReturnLines.reduce(
    (sum, l) => round2(sum + round2(l.returnQty * l.unitPrice * (1 - l.discount / 100))),
    0,
  )
  const vat = round2(subtotal * 0.14)
  const total = round2(subtotal + vat)

  if (confirmed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F5E9]">
            <svg
              className="h-8 w-8 text-[#27AE60]"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h2 className="mb-2 text-heading font-semibold text-text-primary">
          {labels.successTitle}
        </h2>
        <p className="text-body text-text-secondary">{labels.successMessage}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h2 className="mb-6 text-heading font-semibold text-text-primary">
        {labels.confirmTitle}
      </h2>

      <div className="mb-6 flex gap-6 rounded-input border border-border bg-surface px-4 py-3">
        <div>
          <p className="text-label text-text-secondary">{labels.invoiceRefLabel}</p>
          <p className="text-body font-semibold text-text-primary">{invoice.id}</p>
        </div>
        <div>
          <p className="text-label text-text-secondary">{labels.invoiceDateLabel}</p>
          <p className="text-body font-medium text-text-primary">{invoice.date}</p>
        </div>
        <div>
          <p className="text-label text-text-secondary">{labels.originalPaymentLabel}</p>
          <p className="text-body font-medium text-text-primary">{invoice.paymentMethod}</p>
        </div>
      </div>

      <h3 className="mb-3 text-body font-semibold text-text-primary">
        {labels.linesBeingReturnedTitle}
      </h3>
      <div className="mb-6 overflow-hidden rounded-card border border-border bg-surface-card">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-4 py-2.5 text-label font-semibold text-text-secondary">
                {labels.columnPartNumber}
              </th>
              <th className="px-4 py-2.5 text-label font-semibold text-text-secondary">
                {labels.columnDescription}
              </th>
              <th className="px-4 py-2.5 text-label font-semibold text-text-secondary">
                {labels.columnReturnQty}
              </th>
              <th className="px-4 py-2.5 text-label font-semibold text-text-secondary">
                {labels.columnReturnValue}
              </th>
            </tr>
          </thead>
          <tbody>
            {activeReturnLines.map((line) => (
              <tr key={line.id} className="border-b border-border bg-surface-card">
                <td className="px-4 py-2.5 text-body text-text-primary">
                  {line.partNumber}
                </td>
                <td className="px-4 py-2.5 text-body text-text-primary">
                  {line.description}
                </td>
                <td className="px-4 py-2.5 text-body text-text-primary">
                  {line.returnQty}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-body font-semibold text-text-primary">
                  {formatEgp(
                    round2(line.returnQty * line.unitPrice * (1 - line.discount / 100)),
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6 rounded-card border border-border bg-surface-card p-4">
        <h3 className="mb-3 text-body font-semibold text-text-primary">
          {labels.refundMethodLabel}
        </h3>
        <input
          type="text"
          readOnly
          value={invoice.paymentMethod}
          className="mb-1 w-full cursor-not-allowed rounded-input border border-border bg-surface px-3 py-2.5 text-body text-text-primary"
        />
        <p className="text-label text-text-secondary">{labels.refundMethodNote}</p>
      </div>

      <div className="rounded-card border border-border bg-surface-card p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-label text-text-secondary">{labels.subtotalLabel}</span>
            <span className="text-body font-medium text-text-primary">
              {formatEgp(subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-label text-text-secondary">{labels.vatLabel}</span>
            <span className="text-body font-medium text-text-primary">
              {formatEgp(vat)}
            </span>
          </div>
          <div className="mt-1 border-t border-border pt-2">
            <div className="flex justify-between">
              <span className="text-label font-semibold text-text-secondary">
                {labels.totalRefundLabel}
              </span>
              <span className="text-amount font-bold text-[#1D3557]">
                {formatEgp(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
