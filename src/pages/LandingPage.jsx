import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  currentUser,
  landingCustomers,
  landingNavItems,
  landingPageLabels,
  loginPageLabels,
  recentTransactions,
} from '../data/mockData'

const L = landingPageLabels

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initialsFromName(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

const creditStatusStyle = {
  ok: { border: '#27AE60', badge: 'bg-[#E8F5E9] text-[#1E8449]' },
  warning: { border: '#F39C12', badge: 'bg-[#FFF3CD] text-[#856404]' },
  blocked: { border: '#E74C3C', badge: 'bg-[#FFEBEE] text-[#C62828]' },
}

const txTypeBadge = {
  Sale: 'bg-[#EBF5FB] text-[#1A5276]',
  Quotation: 'bg-[#EAF7F0] text-[#1D6A45]',
  Return: 'bg-[#FEF9E7] text-[#7D6608]',
}

// ─── Customer card ─────────────────────────────────────────────────────────────

function CustomerCard({ customer, onLoad }) {
  const available = Math.max(0, customer.creditLimit - customer.exposure)
  const cs = creditStatusStyle[customer.creditStatus] ?? creditStatusStyle.ok

  return (
    <div
      className="flex flex-col rounded-card border border-border bg-surface-card p-5"
      style={{ borderLeftWidth: '4px', borderLeftColor: cs.border }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-navy text-body font-semibold text-white">
          {initialsFromName(customer.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-body font-bold text-text-primary">{customer.name}</p>
          <p className="text-label text-text-secondary">{customer.id}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-badge border border-border bg-surface px-2.5 py-0.5 text-badge font-medium text-text-secondary">
          {customer.type}
        </span>
        <span className={`rounded-badge px-2.5 py-0.5 text-badge font-medium ${cs.badge}`}>
          {customer.creditStatusLabel}
        </span>
      </div>

      <div className="mb-5 rounded-input border border-border bg-surface px-3 py-2">
        <p className="text-label text-text-secondary">{L.creditLabel}</p>
        <p className="text-body font-bold" style={{ color: cs.border }}>
          EGP {formatCurrency(available)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onLoad(customer)}
        className="mt-auto w-full rounded-input bg-brand-navy py-2.5 text-body font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
      >
        {L.loadButtonLabel}
      </button>
    </div>
  )
}

// ─── Left nav pane ─────────────────────────────────────────────────────────────

function LeftNav({ selectedType, onSelectType, onLogout }) {
  return (
    <aside className="flex w-[320px] shrink-0 flex-col overflow-hidden bg-[#1D3557]">
      {/* Logo + app name */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-body font-bold text-brand-navy">
          {loginPageLabels.logoLabel}
        </div>
        <div>
          <p className="text-body font-bold text-white">{loginPageLabels.appName}</p>
          <p className="text-badge text-white/50">{loginPageLabels.appTagline}</p>
        </div>
      </div>

      {/* Transaction type selector */}
      <div className="px-3 py-4">
        <p className="mb-2 px-2 text-badge font-semibold uppercase tracking-wide text-white/40">
          {L.transactionTypeTitle}
        </p>
        {landingNavItems.map((item) => {
          const isSelected = selectedType === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectType(item.id)}
              className={`mb-1 w-full rounded-input px-4 py-3 text-left transition-colors ${
                isSelected
                  ? 'bg-white/15 ring-1 ring-white/20'
                  : 'hover:bg-white/8 text-white/70 hover:text-white'
              }`}
            >
              <p className={`text-body font-semibold ${isSelected ? 'text-white' : ''}`}>
                {item.label}
              </p>
              <p className={`text-label ${isSelected ? 'text-white/60' : 'text-white/40'}`}>
                {item.sublabel}
              </p>
            </button>
          )
        })}
      </div>

      {/* Recent transactions */}
      <div className="flex-1 overflow-y-auto px-5 py-2">
        <p className="mb-3 text-badge font-semibold uppercase tracking-wide text-white/40">
          {L.recentActivityTitle}
        </p>
        <div className="flex flex-col gap-1">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="rounded-input px-2 py-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <span
                      className={`shrink-0 rounded-badge px-1.5 py-0.5 text-badge font-medium ${txTypeBadge[tx.type] ?? 'bg-white/10 text-white/60'}`}
                    >
                      {tx.type}
                    </span>
                    <span className="truncate text-label font-medium text-white/80">{tx.id}</span>
                  </div>
                  <p className="truncate text-badge text-white/50">{tx.customer}</p>
                </div>
                <p className="shrink-0 text-label text-white/60">
                  EGP {formatCurrency(tx.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User info */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-badge font-bold text-white">
            {initialsFromName(currentUser.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-label font-semibold text-white">{currentUser.name}</p>
            <p className="text-badge text-white/50">Counter staff</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="shrink-0 rounded-input p-1.5 text-white/50 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Sign out"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState('sale')

  const currentNavItem = landingNavItems.find((i) => i.id === selectedType)

  const handleLoad = (customer) => {
    navigate(currentNavItem?.route ?? '/counter', { state: { customer } })
  }

  return (
    <div className="flex min-h-screen min-w-desktop">
      <LeftNav
        selectedType={selectedType}
        onSelectType={setSelectedType}
        onLogout={() => navigate('/')}
      />

      {/* Right content area */}
      <main className="flex flex-1 flex-col overflow-y-auto bg-surface">
        {/* Header strip */}
        <div className="border-b border-border bg-surface-card px-8 py-6">
          <h1 className="text-heading font-bold text-text-primary">{L.pageTitle}</h1>
          <p className="mt-1 text-body text-text-secondary">{L.subtitle}</p>
        </div>

        <div className="px-8 py-6">
          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder={L.searchPlaceholder}
              className="w-full max-w-md rounded-input border border-border bg-surface-card px-3 py-2.5 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus"
            />
          </div>

          {/* Recent customers heading */}
          <div className="mb-5 flex items-center gap-3">
            <span className="text-label font-semibold uppercase tracking-wide text-text-muted">
              {L.recentCustomersTitle}
            </span>
            <div className="flex-1 border-t border-border" />
            {currentNavItem && (
              <span className="text-label text-text-secondary">
                Loading into{' '}
                <span className="font-semibold text-brand-navy">{currentNavItem.label}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-5">
            {landingCustomers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} onLoad={handleLoad} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
