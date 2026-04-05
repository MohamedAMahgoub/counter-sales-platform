import StatusBadge from '../common/StatusBadge'

// Fixed mock date for PDC tint calculations (no time component for day comparison)
const MOCK_TODAY = new Date('2026-04-04')

const typeBadgeStyles = {
  'Bank Transfer': 'bg-[#E3F2FD] text-[#1565C0]',
  CDC: 'bg-[#E3F2FD] text-[#1565C0]',
  PDC: 'bg-[#F3E5F5] text-[#7B1FA2]',
  Refund: 'bg-[#FFEBEE] text-[#C62828]',
}

function pdcDiffDays(item) {
  if (item.type !== 'PDC' || !item.chequeDate) return null
  return Math.round((new Date(item.chequeDate) - MOCK_TODAY) / 86400000)
}

function pdcRowTint(item) {
  if (item.type !== 'PDC' || item.status !== 'pending') return ''
  const diff = pdcDiffDays(item)
  if (diff === null) return ''
  if (diff < 0) return 'bg-[#FFF5F5]'
  if (diff <= 7) return 'bg-[#FFFBF0]'
  return ''
}

function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function TypeBadge({ type }) {
  const cls = typeBadgeStyles[type] ?? 'bg-surface text-text-secondary'
  return (
    <span
      className={`inline-flex items-center rounded-badge px-2.5 py-0.5 text-badge font-medium ${cls}`}
    >
      {type}
    </span>
  )
}

// ─── Single item card ─────────────────────────────────────────────────────────

function FinanceItemCard({ item, isSelected, onSelect, labels, formatEgp }) {
  const tint = pdcRowTint(item)
  const isProcessed = item.status !== 'pending'
  const dateStr = item.chequeDate ? formatDate(item.chequeDate) : formatDate(item.dueDate)
  const dateLabel = item.chequeDate ? labels.chequeDateLabel : labels.dueDateLabel

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`w-full border-b border-border text-left transition-colors focus-visible:outline-none ${tint} ${
        isSelected
          ? 'border-l-[3px] border-l-brand-navy !bg-[#EBF4FF]'
          : 'border-l-[3px] border-l-transparent hover:bg-surface'
      } ${isProcessed ? 'opacity-60' : ''}`}
    >
      <div className="px-4 py-3">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <TypeBadge type={item.type} />
          <span className="shrink-0 text-body font-bold text-text-primary">
            {formatEgp(item.amount)}
          </span>
        </div>

        <p className="mb-1 truncate text-body font-semibold text-text-primary">
          {item.customerName}
        </p>

        <div className="flex items-center justify-between gap-2">
          <span className="text-label text-text-secondary">
            {dateLabel}: {dateStr}
          </span>
          {item.reference ? (
            <span className="shrink-0 text-label text-text-muted">{item.reference}</span>
          ) : null}
        </div>

        {isProcessed ? (
          <div className="mt-2">
            <StatusBadge
              variant={labels.statusVariantMap[item.status]}
              label={labels.statusLabelMap[item.status]}
            />
          </div>
        ) : null}
      </div>
    </button>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * @param {object} props
 * @param {object[]} props.items          — filtered + sorted items to display
 * @param {object[]} props.allItems       — full list for tab count computation
 * @param {string|null} props.selectedId
 * @param {string} props.filterTab
 * @param {object[]} props.filterTabs
 * @param {(id: string) => void} props.onSelectItem
 * @param {(tabId: string) => void} props.onFilterChange
 * @param {object} props.labels
 * @param {(n: number) => string} props.formatEgp
 */
export default function FinanceQueue({
  items,
  allItems,
  selectedId,
  filterTab,
  filterTabs,
  onSelectItem,
  onFilterChange,
  labels,
  formatEgp,
}) {
  const pendingCount = allItems.filter((i) => i.status === 'pending').length

  const tabCount = (tab) => {
    if (!tab.type) return allItems.length
    return allItems.filter((i) => i.type === tab.type).length
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2.5 border-b border-border px-4 py-3.5">
        <h2 className="text-body font-semibold text-text-primary">
          {labels.leftPanelTitle}
        </h2>
        {pendingCount > 0 ? (
          <span className="inline-flex items-center rounded-badge bg-[#FFF3CD] px-2.5 py-0.5 text-badge font-semibold text-[#856404]">
            {pendingCount} {labels.pendingBadgeSuffix}
          </span>
        ) : null}
      </div>

      {/* Filter tabs */}
      <div className="flex shrink-0 gap-0 overflow-x-auto border-b border-border">
        {filterTabs.map((tab) => {
          const isActive = filterTab === tab.id
          const count = tabCount(tab)
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-body font-medium transition-colors focus-visible:outline-none ${
                isActive
                  ? 'border-brand-navy text-brand-navy'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-badge font-semibold ${
                  isActive ? 'bg-brand-navy text-white' : 'bg-surface text-text-muted'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <p className="px-4 py-6 text-body text-text-muted">No items to show.</p>
        ) : (
          items.map((item) => (
            <FinanceItemCard
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onSelect={onSelectItem}
              labels={labels}
              formatEgp={formatEgp}
            />
          ))
        )}
      </div>
    </div>
  )
}
