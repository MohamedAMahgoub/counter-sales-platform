import { useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import QuotationSummaryBar from '../components/quotation/QuotationSummaryBar'
import QuotationTable from '../components/quotation/QuotationTable'
import ValidityBar from '../components/quotation/ValidityBar'
import CustomerBar from '../components/layout/CustomerBar'
import Navbar from '../components/layout/Navbar'
import {
  addPartRowPlaceholder,
  consumptionBarCopy,
  currentCustomer,
  currentUser,
  customerBarSubtitleLabels,
  deleteQuotationLineAriaLabel,
  discountCeilingInlineWarning,
  formatEgpAmount,
  layoutShellDemo,
  navbarBrand,
  navbarLogoutAriaLabel,
  navbarTabs,
  quotationAvailabilityCopy,
  quotationColumnLabels,
  quotationStatusLabelMap,
  quotationStatusVariantMap,
  quotationSummaryLabels,
  quotations,
  validityBarLabels,
} from '../data/mockData'

function round2(n) {
  return Math.round(n * 100) / 100
}

function qtyRemaining(line) {
  return Math.max(0, line.qtyQuoted - line.qtyConsumed)
}

function lineGross(line) {
  return round2(qtyRemaining(line) * line.unitPrice)
}

function computeLineTotal(line) {
  return round2(lineGross(line) - line.discountValue)
}

function initialDiscountValue(line) {
  return round2((line.discount / 100) * lineGross(line))
}

function defaultValidityDate() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

const quotation = quotations[0]
const { navbar } = layoutShellDemo

export default function QuotationPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  // Respect customer passed from LandingPage or preserved via Navbar tab click
  const customer = state?.customer ?? currentCustomer

  const [validityDate, setValidityDate] = useState(
    () => quotation.validityDate ?? defaultValidityDate(),
  )

  const [lines, setLines] = useState(() =>
    quotation.lines.map((l) => ({
      ...l,
      discountValue: initialDiscountValue(l),
    })),
  )

  const getLineTotal = useCallback((line) => computeLineTotal(line), [])

  const { subtotal, vatAmount, grandTotal, totalConsumedUnits, totalQuotedUnits } =
    useMemo(() => {
      let sub = 0
      let consumed = 0
      let quoted = 0
      for (const line of lines) {
        const isFullyConsumed = line.qtyConsumed >= line.qtyQuoted
        if (!isFullyConsumed) sub = round2(sub + computeLineTotal(line))
        consumed += line.qtyConsumed
        quoted += line.qtyQuoted
      }
      const vat = round2(sub * 0.14)
      const grand = round2(sub + vat)
      return {
        subtotal: sub,
        vatAmount: vat,
        grandTotal: grand,
        totalConsumedUnits: consumed,
        totalQuotedUnits: quoted,
      }
    }, [lines])

  const onDiscountUpdate = useCallback((id, payload) => {
    setLines((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, discount: payload.discount, discountValue: payload.discountValue } : l,
      ),
    )
  }, [])

  const onRemoveLine = useCallback((id) => {
    setLines((prev) => prev.filter((l) => l.id !== id))
  }, [])

  const activeLinesCount = useMemo(
    () => lines.filter((l) => l.qtyConsumed < l.qtyQuoted).length,
    [lines],
  )

  const unavailableLinesCount = useMemo(
    () => lines.filter((l) => l.availability === 'unavailable' && l.qtyConsumed < l.qtyQuoted).length,
    [lines],
  )

  const handleCopyToOrder = useCallback(() => {
    const activeLines = lines.filter((l) => l.qtyConsumed < l.qtyQuoted)
    const copiedLines = activeLines.map((l) => {
      const remainingQty = qtyRemaining(l)
      const gross = round2(remainingQty * l.unitPrice)
      const discountValue = round2((l.discount / 100) * gross)
      return {
        id: l.id,
        partNumber: l.partNumber,
        description: l.description,
        qty: remainingQty,
        unitPrice: l.unitPrice,
        availability: l.availability ?? 'available',
        stockQty: l.stockQty ?? 0,
        discount: l.discount,
        discountValue,
      }
    })
    navigate('/counter', {
      state: {
        customer,
        copiedLines,
        quotationRef: quotation.id,
      },
    })
  }, [lines, customer, navigate])

  const handleSaveDraft = useCallback(() => {
    console.log('[Save as Draft] validityDate:', validityDate, 'lines:', lines)
  }, [validityDate, lines])

  const quotationStatus = quotation.status
  const statusVariant = quotationStatusVariantMap[quotationStatus] ?? 'pending'
  const statusLabel = quotationStatusLabelMap[quotationStatus] ?? quotationStatus

  return (
    <div className="flex h-screen min-w-desktop flex-col overflow-hidden bg-surface">
      <Navbar
        activeTab="quotation"
        userName={navbar.userName}
        userRole={navbar.userRole}
        branchName={navbar.branchName}
        logoLabel={navbarBrand.logoLabel}
        tabs={navbarTabs}
        logoutAriaLabel={navbarLogoutAriaLabel}
      />
      <CustomerBar
        customer={customer}
        creditStatus={customer.creditStatus}
        subtitleLabels={customerBarSubtitleLabels}
      />
      <ValidityBar
        quotationId={quotation.id}
        quotationStatus={quotationStatus}
        quotationStatusLabel={statusLabel}
        quotationStatusVariant={statusVariant}
        validityDate={validityDate}
        onValidityDateChange={setValidityDate}
        totalUnits={totalQuotedUnits}
        consumedUnits={totalConsumedUnits}
        labels={validityBarLabels}
      />

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <QuotationTable
            lines={lines}
            discountCeiling={currentUser.discountCeiling}
            discountCeilingWarningText={discountCeilingInlineWarning}
            columnLabels={quotationColumnLabels}
            consumptionCopy={consumptionBarCopy}
            availabilityCopy={quotationAvailabilityCopy}
            formatEgp={formatEgpAmount}
            deleteLineAriaLabel={deleteQuotationLineAriaLabel}
            onDiscountUpdate={onDiscountUpdate}
            onRemoveLine={onRemoveLine}
            getLineTotal={getLineTotal}
            addPartPlaceholder={addPartRowPlaceholder}
          />
        </div>
        <QuotationSummaryBar
          subtotal={subtotal}
          vatAmount={vatAmount}
          grandTotal={grandTotal}
          labels={quotationSummaryLabels}
          onCopyToOrder={handleCopyToOrder}
          onSaveDraft={handleSaveDraft}
          copyToOrderDisabled={activeLinesCount === 0}
          unavailableLinesCount={unavailableLinesCount}
        />
      </div>
    </div>
  )
}
