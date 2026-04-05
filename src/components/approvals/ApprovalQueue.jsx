import StatusBadge from '../common/StatusBadge'

// Fixed "now" for consistent relative times in the mock
const MOCK_NOW = new Date('2026-04-04T12:00:00')

function relativeTime(isoStr) {
  const diffMs = MOCK_NOW - new Date(isoStr)
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

// ─── Single item card ─────────────────────────────────────────────────────────

function ApprovalItemCard({ item, isSelected, onSelect, labels, formatEgp }) {
  const typeLabel = labels.typeLabelMap[item.type] ?? item.type
  const typeVariant = labels.typeVariantMap[item.type] ?? 'pending'
  const isProcessed = item.status !== 'pending'

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`w-full border-b border-border text-left transition-colors focus-visible:outline-none ${
        isSelected
          ? 'border-l-[3px] border-l-brand-navy bg-[#EBF4FF]'
          : 'border-l-[3px] border-l-transparent hover:bg-surface'
      } ${isProcessed ? 'opacity-60' : ''}`}
    >
      <div className="px-4 py-3">
        <div className="mb-1.5 flex items-start justify-between gap-2">
          <StatusBadge variant={typeVariant} label={typeLabel} />
          <span className="shrink-0 text-label text-text-muted">
            {relativeTime(item.submittedAt)}
          </span>
        </div>

        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="truncate text-body font-semibold text-text-primary">
            {item.customerName}
          </span>
          <span className="shrink-0 text-body font-semibold text-text-primary">
            {formatEgp(item.amount)}
          </span>
        </div>

        <p className="truncate text-label text-text-secondary">{item.triggerSummary}</p>

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
export default function ApprovalQueue({
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
      <div className="flex shrink-0 gap-0 border-b border-border">
        {filterTabs.map((tab) => {
          const isActive = filterTab === tab.id
          const count = tabCount(tab)
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-body font-medium transition-colors focus-visible:outline-none ${
                isActive
                  ? 'border-brand-navy text-brand-navy'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-badge font-semibold ${
                  isActive
                    ? 'bg-brand-navy text-white'
                    : 'bg-surface text-text-muted'
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
            <ApprovalItemCard
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
