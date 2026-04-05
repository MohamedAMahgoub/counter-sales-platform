import { useState } from 'react'
import MetricCard from '../common/MetricCard'
import StatusBadge from '../common/StatusBadge'

function round2(n) {
  return Math.round(n * 100) / 100
}

function lineTotal(line) {
  return round2(line.qty * line.unitPrice * (1 - line.discount / 100))
}

function formatDate(str) {
  if (!str) return ''
  return new Date(str).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(isoStr) {
  return new Date(isoStr).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ stats, labels, formatEgp }) {
  return (
    <div className="shrink-0 border-b border-border bg-surface-card px-6 py-4">
      <div className="grid grid-cols-4 gap-4">
        <MetricCard label={labels.metricPending} value={stats.pendingCount} />
        <MetricCard
          label={labels.metricTotalValue}
          value={formatEgp(stats.totalValue)}
        />
        <MetricCard
          label={labels.metricPdcsDueThisWeek}
          value={stats.pdcsDueThisWeek}
          valueTone={stats.pdcsDueThisWeek > 0 ? 'warning' : 'default'}
        />
        <MetricCard
          label={labels.metricOverduePdcs}
          value={stats.overduePdcs}
          valueTone={stats.overduePdcs > 0 ? 'alert' : 'default'}
        />
      </div>
    </div>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState({ labels }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
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
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
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

// ─── Type badge ───────────────────────────────────────────────────────────────

const typeBadgeStyles = {
  'Bank Transfer': 'bg-[#E3F2FD] text-[#1565C0]',
  CDC: 'bg-[#E3F2FD] text-[#1565C0]',
  PDC: 'bg-[#F3E5F5] text-[#7B1FA2]',
  Refund: 'bg-[#FFEBEE] text-[#C62828]',
}

function TypeBadge({ type }) {
  const cls = typeBadgeStyles[type] ?? 'bg-surface text-text-secondary'
  return (
    <span className={`inline-flex items-center rounded-badge px-2.5 py-0.5 text-badge font-medium ${cls}`}>
      {type}
    </span>
  )
}

// ─── Item detail ─────────────────────────────────────────────────────────────

function ItemDetail({ item, reference, onReferenceChange, onConfirm, onReject, labels, formatEgp }) {
  const [comment, setComment] = useState('')

  const isPending = item.status === 'pending'
  const isBankTransfer = item.type === 'Bank Transfer'
  const subtotal = (item.lines ?? []).reduce((sum, l) => round2(sum + lineTotal(l)), 0)

  const handleConfirm = () => {
    onConfirm(item.id, comment, reference)
    setComment('')
  }

  const handleReject = () => {
    onReject(item.id, comment)
    setComment('')
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      {/* ── Header ── */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1.5 flex items-center gap-2.5">
            <h2 className="text-heading font-semibold text-text-primary">{item.id}</h2>
            <TypeBadge type={item.type} />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-label text-text-secondary">
            <span>
              <span className="font-medium">{labels.orderRefLabel}:</span>{' '}
              {item.orderRef}
            </span>
            {item.submittedAt ? (
              <span>
                <span className="font-medium">{labels.submittedAtLabel}:</span>{' '}
                {formatDateTime(item.submittedAt)}
              </span>
            ) : null}
          </div>
        </div>
        <StatusBadge
          variant={labels.statusVariantMap[item.status]}
          label={labels.statusLabelMap[item.status]}
        />
      </div>

      {/* ── Payment detail card ── */}
      <div className="mb-5 rounded-card border border-border bg-surface-card p-4">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="text-amount font-bold text-[#1D3557]">{formatEgp(item.amount)}</div>
          <span className="text-body text-text-secondary">·</span>
          <span className="text-body font-medium text-text-primary">{item.customerName}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {item.chequeDate ? (
            <>
              <div>
                <p className="text-label text-text-secondary">{labels.chequeDateLabel}</p>
                <p className="text-body font-medium text-text-primary">
                  {formatDate(item.chequeDate)}
                </p>
              </div>
              <div>
                <p className="text-label text-text-secondary">{labels.chequeNumberLabel}</p>
                <p className="text-body font-medium text-text-primary">
                  {item.chequeNumber ?? '—'}
                </p>
              </div>
            </>
          ) : (
            <div>
              <p className="text-label text-text-secondary">{labels.dueDateLabel}</p>
              <p className="text-body font-medium text-text-primary">
                {formatDate(item.dueDate)}
              </p>
            </div>
          )}

          {item.bankName ? (
            <div>
              <p className="text-label text-text-secondary">{labels.bankNameLabel}</p>
              <p className="text-body font-medium text-text-primary">{item.bankName}</p>
            </div>
          ) : null}

          {item.reference && !isBankTransfer ? (
            <div>
              <p className="text-label text-text-secondary">{labels.referenceLabel}</p>
              <p className="text-body font-medium text-text-primary">{item.reference}</p>
            </div>
          ) : null}
        </div>

        {/* Editable reference — Bank Transfer only */}
        {isBankTransfer ? (
          <div className="mt-4 border-t border-border pt-4">
            <label className="mb-1.5 block text-label font-medium text-text-primary">
              {labels.transferReferenceLabel}
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => onReferenceChange(e.target.value)}
              disabled={!isPending}
              placeholder={labels.transferReferencePlaceholder}
              className="w-full rounded-input border border-border bg-white px-3 py-2.5 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted"
            />
            {isPending ? (
              <p className="mt-1 text-label text-text-muted">{labels.transferReferenceNote}</p>
            ) : null}
          </div>
        ) : null}
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
                  <td className="px-4 py-2.5 text-body text-text-primary">{line.partNumber}</td>
                  <td className="max-w-[220px] px-4 py-2.5 text-body text-text-primary">
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
                <td
                  colSpan={5}
                  className="px-4 py-2.5 text-right text-label font-semibold text-text-secondary"
                >
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
          <>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleConfirm}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-input border border-transparent bg-brand-navy px-4 text-body font-medium text-white transition-colors hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
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
                {labels.confirmButtonLabel}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {labels.rejectButtonLabel}
              </button>
            </div>
            <p className="mt-3 text-center text-badge text-text-muted">
              {labels.confirmReleaseNote}
            </p>
          </>
        ) : (
          <StatusBadge
            variant={labels.statusVariantMap[item.status]}
            label={labels.statusLabelMap[item.status]}
          />
        )}
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * @param {object} props
 * @param {object|null} props.item
 * @param {{ pendingCount, totalValue, pdcsDueThisWeek, overduePdcs }} props.stats
 * @param {string} props.reference
 * @param {(val: string) => void} props.onReferenceChange
 * @param {(id: string, comment: string, ref: string) => void} props.onConfirm
 * @param {(id: string, comment: string) => void} props.onReject
 * @param {object} props.labels
 * @param {(n: number) => string} props.formatEgp
 */
export default function FinanceDetail({
  item,
  stats,
  reference,
  onReferenceChange,
  onConfirm,
  onReject,
  labels,
  formatEgp,
}) {
  return (
    <div className="flex h-full flex-col">
      <StatsBar stats={stats} labels={labels} formatEgp={formatEgp} />

      {item ? (
        <ItemDetail
          key={item.id}
          item={item}
          reference={reference}
          onReferenceChange={onReferenceChange}
          onConfirm={onConfirm}
          onReject={onReject}
          labels={labels}
          formatEgp={formatEgp}
        />
      ) : (
        <EmptyState labels={labels} />
      )}
    </div>
  )
}
