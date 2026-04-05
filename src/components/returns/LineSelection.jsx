function round2(n) {
  return Math.round(n * 100) / 100
}

function lineReturnValue(line) {
  if (!line.selected || line.returnQty <= 0) return 0
  return round2(line.returnQty * line.unitPrice * (1 - line.discount / 100))
}

/**
 * @param {object} props
 * @param {object} props.invoice
 * @param {object[]} props.returnLines  { ...invLine, selected, returnQty }[]
 * @param {(lines: object[]) => void} props.onLinesChange
 * @param {object} props.labels
 * @param {(n: number) => string} props.formatEgp
 * @param {boolean} props.showNoLinesWarning
 */
export default function LineSelection({
  invoice,
  returnLines,
  onLinesChange,
  labels,
  formatEgp,
  showNoLinesWarning,
}) {
  const toggleLine = (id, checked) => {
    onLinesChange(returnLines.map((l) => (l.id === id ? { ...l, selected: checked } : l)))
  }

  const updateReturnQty = (id, raw) => {
    const n = Number.parseInt(raw, 10)
    const line = returnLines.find((l) => l.id === id)
    if (!line) return
    const clamped = Number.isNaN(n) ? 1 : Math.max(1, Math.min(line.qty, n))
    onLinesChange(returnLines.map((l) => (l.id === id ? { ...l, returnQty: clamped } : l)))
  }

  const subtotal = returnLines.reduce((sum, l) => round2(sum + lineReturnValue(l)), 0)

  return (
    <div className="px-6 py-8">
      <h2 className="mb-1 text-heading font-semibold text-text-primary">
        {labels.selectLinesTitle}
      </h2>
      <p className="mb-4 text-body text-text-secondary">{labels.selectLinesNote}</p>

      <div className="mb-5 flex gap-6 rounded-input border border-border bg-surface px-4 py-3">
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

      <div className="overflow-x-auto rounded-card border border-border bg-surface-card">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="w-10 px-4 py-3" />
              <th className="px-4 py-3 text-label font-semibold text-text-secondary">
                {labels.columnPartNumber}
              </th>
              <th className="px-4 py-3 text-label font-semibold text-text-secondary">
                {labels.columnDescription}
              </th>
              <th className="px-4 py-3 text-label font-semibold text-text-secondary">
                {labels.columnOrigQty}
              </th>
              <th className="px-4 py-3 text-label font-semibold text-text-secondary">
                {labels.columnReturnQty}
              </th>
              <th className="px-4 py-3 text-label font-semibold text-text-secondary">
                {labels.columnUnitPrice}
              </th>
              <th className="px-4 py-3 text-label font-semibold text-text-secondary">
                {labels.columnReturnValue}
              </th>
            </tr>
          </thead>
          <tbody>
            {returnLines.map((line) => (
              <tr
                key={line.id}
                className={`border-b border-border ${line.selected ? 'bg-surface-card' : 'bg-surface opacity-70'}`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={line.selected}
                    onChange={(e) => toggleLine(line.id, e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded accent-brand-navy"
                  />
                </td>
                <td className="px-4 py-3 text-body text-text-primary">
                  {line.partNumber}
                </td>
                <td className="max-w-xs px-4 py-3 text-body text-text-primary">
                  {line.description}
                </td>
                <td className="px-4 py-3 text-body text-text-primary">{line.qty}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={1}
                    max={line.qty}
                    value={line.returnQty}
                    disabled={!line.selected}
                    onChange={(e) => updateReturnQty(line.id, e.target.value)}
                    className="w-16 rounded-input border border-border bg-white px-2 py-1.5 text-body text-text-primary focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-body text-text-primary">
                  {formatEgp(line.unitPrice)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-body font-semibold text-text-primary">
                  {line.selected ? formatEgp(lineReturnValue(line)) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          {showNoLinesWarning ? (
            <p className="text-body text-status-alert">{labels.noLinesWarning}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-label text-text-secondary">
            {labels.selectionSubtotalLabel}:
          </span>
          <span className="text-body font-bold text-text-primary">
            {formatEgp(subtotal)}
          </span>
        </div>
      </div>
    </div>
  )
}
