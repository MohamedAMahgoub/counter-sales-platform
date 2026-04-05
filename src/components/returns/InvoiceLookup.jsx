import { useState } from 'react'
import ActionButton from '../common/ActionButton'

function round2(n) {
  return Math.round(n * 100) / 100
}

function invoiceTotal(invoice) {
  return invoice.lines.reduce(
    (sum, l) => round2(sum + round2(l.qty * l.unitPrice * (1 - l.discount / 100))),
    0,
  )
}

// ─── Recent invoice row ───────────────────────────────────────────────────────

function RecentInvoiceRow({ invoice, labels, formatEgp, onSelectAndAdvance }) {
  const eligible = invoice.returnEligible
  return (
    <div
      className={`flex items-center justify-between rounded-input border border-border px-4 py-3 ${
        eligible ? 'bg-surface-card' : 'bg-surface opacity-60'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="text-body font-semibold text-text-primary">{invoice.id}</span>
          <span className="text-label text-text-muted">·</span>
          <span className="text-label text-text-secondary">{invoice.date}</span>
          <span className="text-label text-text-muted">·</span>
          <span className="text-label font-medium text-text-primary">
            {formatEgp(invoice.total)}
          </span>
          <span className="text-label text-text-muted">·</span>
          <span className="text-label text-text-secondary">
            {invoice.lineCount} {labels.invoiceItemsSuffix}
          </span>
        </div>
        {eligible ? (
          <span className="inline-flex items-center rounded-badge bg-[#E8F5E9] px-2.5 py-0.5 text-badge font-medium text-[#1E8449]">
            {labels.eligibleBadgeLabel}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-badge border border-border bg-surface px-2.5 py-0.5 text-badge font-medium text-text-muted">
            {labels.ineligibleBadgeLabel}
          </span>
        )}
      </div>

      <div className="ml-4 shrink-0">
        {eligible ? (
          <button
            type="button"
            onClick={() => onSelectAndAdvance(invoice)}
            className="text-body font-medium text-brand-navy hover:text-brand-secondary focus-visible:outline-none"
          >
            {labels.selectInvoiceLabel} →
          </button>
        ) : (
          <span className="text-body text-text-muted">{labels.unavailableLabel}</span>
        )}
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

const tabPlaceholders = {
  license: 'scanLicensePlaceholder',
  customer: 'customerCodePlaceholder',
  invoice: 'searchPlaceholder',
}

/**
 * @param {object} props
 * @param {object[]} props.invoices            — searchable invoices (manual lookup)
 * @param {object[]} props.recentInvoices      — pre-loaded recent invoice rows
 * @param {{ id: string, label: string }[]} props.lookupTabs
 * @param {object|null} props.foundInvoice
 * @param {(invoice: object|null) => void} props.onInvoiceFound
 * @param {(invoice: object) => void} props.onSelectAndAdvance
 * @param {object} props.labels
 * @param {(n: number) => string} props.formatEgp
 */
export default function InvoiceLookup({
  invoices,
  recentInvoices,
  lookupTabs,
  foundInvoice,
  onInvoiceFound,
  onSelectAndAdvance,
  labels,
  formatEgp,
}) {
  const [activeTab, setActiveTab] = useState(() => lookupTabs[0]?.id ?? 'license')
  const [query, setQuery] = useState(() => foundInvoice?.id ?? '')
  const [searched, setSearched] = useState(() => foundInvoice !== null)

  const handleTabChange = (id) => {
    setActiveTab(id)
    setQuery('')
    setSearched(false)
    if (foundInvoice) onInvoiceFound(null)
  }

  const handleSearch = () => {
    if (activeTab === 'invoice') {
      const match = invoices.find(
        (inv) => inv.id.toLowerCase() === query.trim().toLowerCase(),
      )
      onInvoiceFound(match ?? null)
    } else {
      onInvoiceFound(null)
    }
    setSearched(true)
  }

  const notFound = searched && !foundInvoice

  const placeholder = labels[tabPlaceholders[activeTab]] ?? labels.searchPlaceholder

  return (
    <div className="mx-auto w-full max-w-[640px] px-0 py-8">
      <h2 className="mb-5 px-0 text-heading font-semibold text-text-primary">
        {labels.pageTitle}
      </h2>

      <div className="w-full rounded-card border border-border bg-surface-card p-6">
        {/* ── Lookup method tabs ── */}
        <div className="mb-5 flex gap-1 rounded-input border border-border bg-surface p-1">
          {lookupTabs.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 rounded-[4px] py-2 text-body font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-navy text-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ── Search input ── */}
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value)
              setSearched(false)
              if (foundInvoice) onInvoiceFound(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 rounded-input border border-border bg-white px-3 py-2.5 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus"
          />
          <ActionButton
            variant="primary"
            label={labels.searchButtonLabel}
            onClick={handleSearch}
          />
        </div>

        {notFound ? (
          <p className="mt-3 text-body text-status-alert">
            {labels.invoiceNotFoundMessage}
          </p>
        ) : null}

        {/* ── Manual search result ── */}
        {foundInvoice ? (
          <div className="mt-4 rounded-input border border-[#27AE60] bg-[#F0FFF4] p-4">
            <p className="mb-3 text-body font-semibold text-text-primary">
              {labels.foundInvoiceTitle}: {foundInvoice.id}
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <span className="text-label text-text-secondary">
                  {labels.invoiceDateLabel}:{' '}
                </span>
                <span className="text-label font-medium text-text-primary">
                  {foundInvoice.date}
                </span>
              </div>
              <div>
                <span className="text-label text-text-secondary">
                  {labels.invoicePaymentLabel}:{' '}
                </span>
                <span className="text-label font-medium text-text-primary">
                  {foundInvoice.paymentMethod}
                </span>
              </div>
              <div>
                <span className="text-label text-text-secondary">
                  {labels.invoiceLinesLabel}:{' '}
                </span>
                <span className="text-label font-medium text-text-primary">
                  {foundInvoice.lines.length} {labels.invoiceItemsSuffix}
                </span>
              </div>
              <div>
                <span className="text-label text-text-secondary">
                  {labels.invoiceTotalLabel}:{' '}
                </span>
                <span className="text-label font-medium text-text-primary">
                  {formatEgp(invoiceTotal(foundInvoice))}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Recent invoices ── */}
        {recentInvoices?.length > 0 ? (
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="shrink-0 text-label font-semibold uppercase tracking-wide text-text-muted">
                {labels.recentInvoicesTitle}
              </span>
              <div className="flex-1 border-t border-border" />
            </div>

            <div className="flex flex-col gap-2">
              {recentInvoices.map((inv) => (
                <RecentInvoiceRow
                  key={inv.id}
                  invoice={inv}
                  labels={labels}
                  formatEgp={formatEgp}
                  onSelectAndAdvance={onSelectAndAdvance}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
