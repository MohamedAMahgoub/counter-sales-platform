import { useMemo, useState } from 'react'
import ApprovalDetail from '../components/approvals/ApprovalDetail'
import ApprovalQueue from '../components/approvals/ApprovalQueue'
import Navbar from '../components/layout/Navbar'
import {
  approvalFilterTabs,
  approvalQueueLabels,
  formatEgpAmount,
  layoutShellDemo,
  navbarBrand,
  navbarLogoutAriaLabel,
  navbarTabs,
  pendingApprovals,
} from '../data/mockData'

const { navbar } = layoutShellDemo

export default function ApprovalQueuePage() {
  const [items, setItems] = useState(() => pendingApprovals)
  const [selectedId, setSelectedId] = useState(null)
  const [filterTab, setFilterTab] = useState('all')

  // ── Filtering + sorting ──────────────────────────────────────────────────

  const filteredItems = useMemo(() => {
    const activeTab = approvalFilterTabs.find((t) => t.id === filterTab)
    const typed = activeTab?.type
      ? items.filter((i) => i.type === activeTab.type)
      : items

    // Pending items first, then approved/rejected (moved to bottom)
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

  const handleApprove = (id, comment) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: 'approved', resolvedComment: comment || undefined }
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

      {/* Split panel — fills remaining viewport height */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 60px)' }}>
        {/* Left panel — fixed 400px */}
        <div className="flex w-[400px] shrink-0 flex-col border-r border-border bg-surface-card">
          <ApprovalQueue
            items={filteredItems}
            allItems={items}
            selectedId={selectedId}
            filterTab={filterTab}
            filterTabs={approvalFilterTabs}
            onSelectItem={setSelectedId}
            onFilterChange={(tab) => setFilterTab(tab)}
            labels={approvalQueueLabels}
            formatEgp={formatEgpAmount}
          />
        </div>

        {/* Right panel — fills remaining width */}
        <div className="flex flex-1 flex-col overflow-hidden bg-surface">
          <ApprovalDetail
            key={selectedId}
            item={selectedItem}
            onApprove={handleApprove}
            onReject={handleReject}
            labels={approvalQueueLabels}
            formatEgp={formatEgpAmount}
          />
        </div>
      </div>
    </div>
  )
}
