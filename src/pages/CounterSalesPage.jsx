import { useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ActionButton from '../components/common/ActionButton'
import PartsTable from '../components/counter/PartsTable'
import BlockedBanner from '../components/layout/BlockedBanner'
import CustomerBar from '../components/layout/CustomerBar'
import Navbar from '../components/layout/Navbar'
import OrderSummaryBar from '../components/layout/OrderSummaryBar'
import PendingBanner from '../components/layout/PendingBanner'
import {
  activeSaleOrder,
  addPartRowPlaceholder,
  availabilityCopy,
  blockedBannerMessage,
  copyFromBannerLabels,
  creditSaleBlockedBadgeLabel,
  currentCustomer,
  currentUser,
  customerBarSubtitleLabels,
  deleteLineAriaLabel,
  discountCeilingInlineWarning,
  financeApprovalPaymentValues,
  formatEgpAmount,
  layoutShellDemo,
  navbarBrand,
  navbarLogoutAriaLabel,
  navbarTabs,
  orderSummaryLabels,
  parts as partsSeed,
  partsTableColumnLabels,
  paymentCreditValue,
  paymentDropdownOptions,
  paymentDropdownPlaceholder,
  pendingOverrideBannerMessage,
  paymentWarningCreditBlocked,
  paymentWarningNotSelected,
  saleConfirmationLabels,
} from '../data/mockData'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round2(n) {
  return Math.round(n * 100) / 100
}

function lineTotalForPart(part) {
  return round2(part.qty * part.unitPrice - part.discountValue)
}

function initialDiscountValue(part) {
  return round2((part.discount / 100) * (part.qty * part.unitPrice))
}

// ─── Confirmation screens ─────────────────────────────────────────────────────

function GreenCheckCircle() {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#27AE60]">
      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  )
}

function BlueClockCircle() {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2980B9]">
      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      </svg>
    </div>
  )
}

function SaleConfirmedScreen({ transactionId, erpDoc, paymentLabel, isPaymentConfirmed, labels, onNewTransaction }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-surface px-6">
      <div className="w-full max-w-md rounded-card border border-border bg-surface-card p-10 text-center">
        <GreenCheckCircle />
        <h1 className="mt-5 text-amount font-bold text-text-primary">{labels.confirmedTitle}</h1>
        <div className="mt-4 flex flex-col gap-0.5">
          <span className="text-label text-text-secondary">
            {labels.transactionIdLabel}:{' '}
            <span className="font-semibold text-text-primary">{transactionId}</span>
          </span>
          <span className="text-label text-text-secondary">
            {labels.erpDocLabel}:{' '}
            <span className="font-semibold text-text-primary">{erpDoc}</span>
          </span>
        </div>
        <div className="mt-4 flex justify-center">
          <span className="rounded-badge bg-[#E8F5E9] px-3 py-1 text-badge font-semibold text-[#1E8449]">
            {labels.statusClosed}
          </span>
        </div>
        <p className="mt-4 text-body font-medium text-[#27AE60]">
          {isPaymentConfirmed
            ? labels.paymentConfirmedText
            : `${labels.paymentReceivedPrefix} ${paymentLabel}`}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <ActionButton variant="secondary" label={labels.printReceipt} onClick={() => {}} />
          <ActionButton variant="primary" label={labels.newTransaction} onClick={onNewTransaction} />
        </div>
      </div>
    </div>
  )
}

function FinancePendingScreen({ transactionId, erpDoc, labels, onMarkPaymentReceived, onNewTransaction }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-surface px-6">
      <div className="w-full max-w-md rounded-card border border-border bg-surface-card p-10 text-center">
        <BlueClockCircle />
        <h1 className="mt-5 text-amount font-bold text-text-primary">{labels.pendingTitle}</h1>
        <div className="mt-4 flex flex-col gap-0.5">
          <span className="text-label text-text-secondary">
            {labels.transactionIdLabel}:{' '}
            <span className="font-semibold text-text-primary">{transactionId}</span>
          </span>
          <span className="text-label text-text-secondary">
            {labels.erpDocLabel}:{' '}
            <span className="font-semibold text-text-primary">{erpDoc}</span>
          </span>
        </div>
        <div className="mt-4 flex justify-center">
          <span className="rounded-badge bg-[#FFF3CD] px-3 py-1 text-badge font-semibold text-[#856404]">
            {labels.statusPending}
          </span>
        </div>
        <p className="mt-4 text-label text-text-secondary">{labels.financeNote}</p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <ActionButton variant="primary" label={labels.markPaymentReceived} onClick={onMarkPaymentReceived} />
          <ActionButton variant="secondary" label={labels.newTransaction} onClick={onNewTransaction} />
        </div>
      </div>
    </div>
  )
}

// ─── Copy-from-quotation banner ───────────────────────────────────────────────

function CopyFromBanner({ quotationRef, labels }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#27AE60]/30 bg-[#E8F5E9] px-6 py-2.5">
      <svg className="h-4 w-4 shrink-0 text-[#27AE60]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <span className="text-body text-[#1E8449]">
        {labels.prefix}{' '}
        <span className="font-semibold">{quotationRef}</span>{' '}
        {labels.suffix}
      </span>
      <button
        type="button"
        className="ml-auto text-label font-medium text-brand-navy hover:underline focus-visible:outline-none"
      >
        {labels.viewOriginal}
      </button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const { navbar } = layoutShellDemo

export default function CounterSalesPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  // Customer from LandingPage / Quotation copy / Navbar tab, or fallback
  const customer = state?.customer ?? currentCustomer
  const creditStatus = customer.creditStatus

  const [lineItems, setLineItems] = useState(() => {
    // If coming from a quotation copy, use those lines
    if (state?.copiedLines) return state.copiedLines
    return partsSeed.map((p) => ({
      ...p,
      discountValue: initialDiscountValue(p),
    }))
  })

  // 'idle' | 'pending_override' | 'pending_finance' | 'confirmed' | 'payment_confirmed'
  const [pageState, setPageState] = useState('idle')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [showPaymentOptionalWarning, setShowPaymentOptionalWarning] = useState(false)

  // Fix 5: isBlocked only when Credit is explicitly selected AND overdue balance exists
  const isCreditSaleBlocked =
    pageState === 'idle' &&
    paymentMethod === paymentCreditValue &&
    customer.overdueBalance > 0

  const getLineTotal = useCallback((part) => lineTotalForPart(part), [])

  const { immediateTotal, backorderTotal, subtotal, vatAmount, grandTotal } =
    useMemo(() => {
      let immediate = 0
      let backorder = 0
      for (const part of lineItems) {
        const lt = lineTotalForPart(part)
        if (part.availability === 'backorder') backorder = round2(backorder + lt)
        else immediate = round2(immediate + lt)
      }
      const sub = round2(immediate + backorder)
      const vat = round2(sub * 0.14)
      const grand = round2(sub + vat)
      return { immediateTotal: immediate, backorderTotal: backorder, subtotal: sub, vatAmount: vat, grandTotal: grand }
    }, [lineItems])

  const anyLineExceedsCeiling = useMemo(
    () => lineItems.some((p) => round2(p.discount) > currentUser.discountCeiling),
    [lineItems],
  )

  const onQtyChange = useCallback((id, qty) => {
    setLineItems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const gross = round2(qty * p.unitPrice)
        const dv = round2((p.discount / 100) * gross)
        return { ...p, qty, discountValue: dv }
      }),
    )
  }, [])

  const onDiscountUpdate = useCallback((id, payload) => {
    setLineItems((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, discount: payload.discount, discountValue: payload.discountValue }
          : p,
      ),
    )
  }, [])

  const onRemoveLine = useCallback((id) => {
    setLineItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const handlePaymentChange = useCallback((value) => {
    setPaymentMethod(value)
    if (value) setShowPaymentOptionalWarning(false)
    setPageState('idle')
  }, [])

  const handleMainAction = useCallback(() => {
    if (!paymentMethod) {
      setShowPaymentOptionalWarning(true)
      return
    }
    if (financeApprovalPaymentValues.includes(paymentMethod)) {
      setPageState('pending_finance')
      return
    }
    // POS / Card or Cash → immediate confirmation
    setPageState('confirmed')
  }, [paymentMethod])

  const handleRequestOverride = useCallback(() => {
    setPageState('pending_override')
  }, [])

  const handleCancelTransaction = useCallback(() => {
    setPaymentMethod('')
    setPageState('idle')
    navigate('/landing')
  }, [navigate])

  const handleWithdrawRequest = useCallback(() => {
    setPageState('idle')
  }, [])

  const mainActionDisabled = !customer?.id || lineItems.length === 0

  const frozenPaymentLabel =
    paymentDropdownOptions.find((o) => o.value === paymentMethod)?.label ?? ''

  const isPending = pageState === 'pending_override'

  const navbarProps = {
    activeTab: navbar.activeTab,
    userName: navbar.userName,
    userRole: navbar.userRole,
    branchName: navbar.branchName,
    logoLabel: navbarBrand.logoLabel,
    tabs: navbarTabs,
    logoutAriaLabel: navbarLogoutAriaLabel,
  }

  // ── Full-page confirmation screens ──────────────────────────────────────────

  const handleNewTransaction = useCallback(() => navigate('/landing'), [navigate])
  const handleMarkPaymentReceived = useCallback(() => setPageState('payment_confirmed'), [])

  if (pageState === 'confirmed' || pageState === 'payment_confirmed') {
    return (
      <div className="flex h-screen min-w-desktop flex-col overflow-hidden bg-surface">
        <Navbar {...navbarProps} />
        <SaleConfirmedScreen
          transactionId={activeSaleOrder.transactionId}
          erpDoc={activeSaleOrder.erpDocNumber}
          paymentLabel={frozenPaymentLabel}
          isPaymentConfirmed={pageState === 'payment_confirmed'}
          labels={saleConfirmationLabels}
          onNewTransaction={handleNewTransaction}
        />
      </div>
    )
  }

  if (pageState === 'pending_finance') {
    return (
      <div className="flex h-screen min-w-desktop flex-col overflow-hidden bg-surface">
        <Navbar {...navbarProps} />
        <FinancePendingScreen
          transactionId={activeSaleOrder.transactionId}
          erpDoc={activeSaleOrder.erpDocNumber}
          labels={saleConfirmationLabels}
          onMarkPaymentReceived={handleMarkPaymentReceived}
          onNewTransaction={handleNewTransaction}
        />
      </div>
    )
  }

  // ── Normal sale screen (idle + pending_override) ────────────────────────────

  return (
    <div className="flex h-screen min-w-desktop flex-col overflow-hidden bg-surface">
      <Navbar {...navbarProps} />

      {/* Banners */}
      {pageState === 'pending_override' ? (
        <PendingBanner message={pendingOverrideBannerMessage} />
      ) : isCreditSaleBlocked ? (
        <BlockedBanner message={blockedBannerMessage} />
      ) : null}

      <CustomerBar
        customer={customer}
        creditStatus={isCreditSaleBlocked || pageState === 'pending_override' ? 'blocked' : creditStatus}
        subtitleLabels={customerBarSubtitleLabels}
        statusBadgeLabel={
          isCreditSaleBlocked || pageState === 'pending_override'
            ? creditSaleBlockedBadgeLabel
            : undefined
        }
      />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Copy-from-quotation banner */}
          {state?.quotationRef && (
            <CopyFromBanner quotationRef={state.quotationRef} labels={copyFromBannerLabels} />
          )}
          <PartsTable
            parts={lineItems}
            discountCeiling={currentUser.discountCeiling}
            discountCeilingWarningText={discountCeilingInlineWarning}
            columnLabels={partsTableColumnLabels}
            availabilityCopy={availabilityCopy}
            formatEgp={formatEgpAmount}
            deleteLineAriaLabel={deleteLineAriaLabel}
            onQtyChange={onQtyChange}
            onDiscountUpdate={onDiscountUpdate}
            onRemoveLine={onRemoveLine}
            getLineTotal={getLineTotal}
            addPartPlaceholder={addPartRowPlaceholder}
            readOnly={isPending}
          />
        </div>
        <OrderSummaryBar
          immediateTotal={immediateTotal}
          backorderTotal={backorderTotal}
          subtotal={subtotal}
          vatAmount={vatAmount}
          grandTotal={grandTotal}
          labels={orderSummaryLabels}
          paymentOptions={paymentDropdownOptions}
          paymentPlaceholder={paymentDropdownPlaceholder}
          paymentValue={paymentMethod}
          onPaymentChange={handlePaymentChange}
          creditBlockedActive={isCreditSaleBlocked}
          showPaymentOptionalWarning={showPaymentOptionalWarning}
          paymentOptionalWarningText={paymentWarningNotSelected}
          creditBlockedWarningText={paymentWarningCreditBlocked}
          needsDiscountOverride={anyLineExceedsCeiling && !isCreditSaleBlocked}
          onMainAction={handleMainAction}
          mainActionDisabled={mainActionDisabled}
          pageState={pageState}
          onRequestOverride={handleRequestOverride}
          onCancelTransaction={handleCancelTransaction}
          onWithdrawRequest={handleWithdrawRequest}
          frozenPaymentLabel={frozenPaymentLabel}
        />
      </div>
    </div>
  )
}
