import { useState } from 'react'
import StatusBadge from '../common/StatusBadge'

function round2(n) {
  return Math.round(n * 100) / 100
}

function lineTotal(line) {
  return round2(line.qty * line.unitPrice * (1 - line.discount / 100))
}

// Fixed "now" for relative display
const MOCK_NOW = new Date('2026-04-04T12:00:00')

function formatDateTime(isoStr) {
  const d = new Date(isoStr)
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ labels }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface">
        <svg
          className="h-7 w-7 text-text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <div>
        <p className="text-body font-semibold text-text-primary">{labels.emptyDetailTitle}</p>
        <p className="mt-1 text-body text-text-secondary">{labels.emptyDetailMessage}</p>
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * @param {object} props
 * @param {object|null} props.item
 * @param {(id: string, comment: string) => void} props.onApprove
 * @param {(id: string, comment: string) => void} props.onReject
 * @param {object} props.labels
 * @param {(n: number) => string} props.formatEgp
 */
export default function ApprovalDetail({ item, onApprove, onReject, labels, formatEgp }) {
  const [comment, setComment] = useState('')

  if (!item) return <EmptyState labels={labels} />

  const isPending = item.status === 'pending'
  const tint = labels.triggerTintMap[item.type] ?? { bg: '#FFFBF0', border: '#F39C12' }
  const typeLabel = labels.typeLabelMap[item.type] ?? item.type
  const typeVariant = labels.typeVariantMap[item.type] ?? 'pending'

  const handleApprove = () => {
    onApprove(item.id, comment)
    setComment('')
  }

  const handleReject = () => {
    onReject(item.id, comment)
    setComment('')
  }

  const subtotal = (item.lines ?? []).reduce((sum, l) => round2(sum + lineTotal(l)), 0)

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex-1 px-6 py-6">
        {/* ── Header ── */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1.5 flex items-center gap-2.5">
              <h2 className="text-heading font-semibold text-text-primary">{item.id}</h2>
              <StatusBadge variant={typeVariant} label={typeLabel} />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-label text-text-secondary">
              <span>
                <span className="font-medium">{labels.submittedByLabel}:</span>{' '}
                {item.submittedBy}
              </span>
              <span>
                <span className="font-medium">{labels.submittedAtLabel}:</span>{' '}
                {formatDateTime(item.submittedAt)}
              </span>
              <span>
                <span className="font-medium">{labels.orderRefLabel}:</span>{' '}
                {item.orderRef}
              </span>
            </div>
          </div>

          <StatusBadge
            variant={labels.statusVariantMap[item.status]}
            label={labels.statusLabelMap[item.status]}
          />
        </div>

        {/* ── Trigger explanation card ── */}
        <div
          className="mb-5 rounded-input border-l-4 p-4"
          style={{
            backgroundColor: tint.bg,
            borderLeftColor: tint.border,
            borderTopWidth: '1px',
            borderRightWidth: '1px',
            borderBottomWidth: '1px',
            borderTopColor: '#DEE2E6',
            borderRightColor: '#DEE2E6',
            borderBottomColor: '#DEE2E6',
          }}
        >
          <p className="mb-1.5 text-label font-semibold uppercase tracking-wide text-text-secondary">
            {labels.triggerCardTitle}
          </p>
          <p className="text-body text-text-primary">{item.triggerDetail}</p>
        </div>

        {/* ── Order summary ── */}
        {item.lines?.length > 0 ? (
          <div className="mb-5 overflow-hidden rounded-card border border-border bg-surface-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-body font-semibold text-text-primary">
                {labels.orderSummaryTitle}
              </p>
              <span className="text-label text-text-secondary">{item.orderRef}</span>
            </div>
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
                    {labels.columnQty}
                  </th>
                  <th className="px-4 py-2.5 text-label font-semibold text-text-secondary">
                    {labels.columnUnitPrice}
                  </th>
                  <th className="px-4 py-2.5 text-label font-semibold text-text-secondary">
                    {labels.columnDiscount}
                  </th>
                  <th className="px-4 py-2.5 text-right text-label font-semibold text-text-secondary">
                    {labels.columnLineTotal}
                  </th>
                </tr>
              </thead>
              <tbody>
                {item.lines.map((line) => (
                  <tr key={line.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-body text-text-primary">
                      {line.partNumber}
                    </td>
                    <td className="max-w-xs px-4 py-2.5 text-body text-text-primary">
                      {line.description}
                    </td>
                    <td className="px-4 py-2.5 text-body text-text-primary">{line.qty}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-body text-text-primary">
                      {formatEgp(line.unitPrice)}
                    </td>
                    <td className="px-4 py-2.5 text-body text-text-primary">
                      {line.discount > 0 ? (
                        <span className="font-semibold text-status-alert">{line.discount}%</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right text-body font-semibold text-text-primary">
                      {formatEgp(lineTotal(line))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-surface">
                  <td colSpan={5} className="px-4 py-2.5 text-right text-label font-semibold text-text-secondary">
                    Lines subtotal
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right text-body font-bold text-[#1D3557]">
                    {formatEgp(subtotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : null}

        {/* ── Comment + actions ── */}
        <div className="rounded-card border border-border bg-surface-card p-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={!isPending}
            placeholder={labels.commentPlaceholder}
            rows={3}
            className="mb-4 w-full resize-none rounded-input border border-border bg-white px-3 py-2.5 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted"
          />

          {isPending ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-input border border-transparent bg-[#27AE60] px-4 text-body font-medium text-white transition-colors hover:bg-[#219A52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27AE60]"
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {labels.approveButtonLabel}
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-input border border-status-alert bg-transparent px-4 text-body font-medium text-status-alert transition-colors hover:bg-status-alert/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-alert"
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {labels.rejectButtonLabel}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <StatusBadge
                variant={labels.statusVariantMap[item.status]}
                label={labels.statusLabelMap[item.status]}
              />
              {item.resolvedComment ? (
                <p className="text-label text-text-secondary">
                  "{item.resolvedComment}"
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
