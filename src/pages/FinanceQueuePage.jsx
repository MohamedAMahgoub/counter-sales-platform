import { useMemo, useState } from 'react'
import FinanceDetail from '../components/approvals/FinanceDetail'
import FinanceQueue from '../components/approvals/FinanceQueue'
import Navbar from '../components/layout/Navbar'
import {
  financeFilterTabs,
  financeQueueLabels,
  formatEgpAmount,
  layoutShellDemo,
  navbarBrand,
  navbarLogoutAriaLabel,
  navbarTabs,
  pendingPayments,
} from '../data/mockData'

// Fixed mock date for PDC calculations
const MOCK_TODAY = new Date('2026-04-04')

function round2(n) {
  return Math.round(n * 100) / 100
}

const { navbar } = layoutShellDemo

export default function FinanceQueuePage() {
  const [items, setItems] = useState(() => pendingPayments)
  const [selectedId, setSelectedId] = useState(null)
  const [filterTab, setFilterTab] = useState('all')
  const [references, setReferences] = useState(() =>
    Object.fromEntries(pendingPayments.map((i) => [i.id, i.reference ?? ''])),
  )

  // ── Stats (always computed from full pending list) ────────────────────────

  const stats = useMemo(() => {
    const pending = items.filter((i) => i.status === 'pending')
    const totalValue = round2(pending.reduce((sum, i) => sum + i.amount, 0))
    const pdcPending = pending.filter((i) => i.type === 'PDC')
    const pdcsDueThisWeek = pdcPending.filter((i) => {
      if (!i.chequeDate) return false
      const diff = Math.round((new Date(i.chequeDate) - MOCK_TODAY) / 86400000)
      return diff >= 0 && diff <= 7
    }).length
    const overduePdcs = pdcPending.filter((i) => {
      if (!i.chequeDate) return false
      const diff = Math.round((new Date(i.chequeDate) - MOCK_TODAY) / 86400000)
      return diff < 0
    }).length
    return { pendingCount: pending.length, totalValue, pdcsDueThisWeek, overduePdcs }
  }, [items])

  // ── Filtering + sorting ──────────────────────────────────────────────────

  const filteredItems = useMemo(() => {
    const activeTab = financeFilterTabs.find((t) => t.id === filterTab)
    const typed = activeTab?.type
      ? items.filter((i) => i.type === activeTab.type)
      : items

    return [
      ...typed.filter((i) => i.status === 'pending'),
      ...typed.filter((i) => i.status !== 'pending'),
    ]
  }, [items, filterTab])

  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedId) ?? null,
    [items, selectedId],
  )

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleConfirm = (id, comment, ref) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: 'confirmed',
              reference: ref || i.reference,
              resolvedComment: comment || undefined,
            }
          : i,
      ),
    )
  }

  const handleReject = (id, comment) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: 'rejected', resolvedComment: comment || undefined }
          : i,
      ),
    )
  }

  const handleReferenceChange = (id, value) => {
    setReferences((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div className="flex min-h-screen min-w-desktop flex-col bg-surface">
      <Navbar
        activeTab="sale"
        userName={navbar.userName}
        userRole={navbar.userRole}
        branchName={navbar.branchName}
        logoLabel={navbarBrand.logoLabel}
        tabs={navbarTabs}
        logoutAriaLabel={navbarLogoutAriaLabel}
      />

      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 60px)' }}>
        {/* Left panel — fixed 400px */}
        <div className="flex w-[400px] shrink-0 flex-col border-r border-border bg-surface-card">
          <FinanceQueue
            items={filteredItems}
            allItems={items}
            selectedId={selectedId}
            filterTab={filterTab}
            filterTabs={financeFilterTabs}
            onSelectItem={setSelectedId}
            onFilterChange={setFilterTab}
            labels={financeQueueLabels}
            formatEgp={formatEgpAmount}
          />
        </div>

        {/* Right panel */}
        <div className="flex flex-1 flex-col overflow-hidden bg-surface">
          <FinanceDetail
            item={selectedItem}
            stats={stats}
            reference={selectedId ? (references[selectedId] ?? '') : ''}
            onReferenceChange={(val) => selectedId && handleReferenceChange(selectedId, val)}
            onConfirm={handleConfirm}
            onReject={handleReject}
            labels={financeQueueLabels}
            formatEgp={formatEgpAmount}
          />
        </div>
      </div>
    </div>
  )
}
