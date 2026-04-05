import { Fragment, useState } from 'react'
import { useLocation } from 'react-router-dom'
import InvoiceLookup from '../components/returns/InvoiceLookup'
import LineSelection from '../components/returns/LineSelection'
import RefundMethod from '../components/returns/RefundMethod'
import RefundConfirmation from '../components/returns/RefundConfirmation'
import CustomerBar from '../components/layout/CustomerBar'
import Navbar from '../components/layout/Navbar'
import ActionButton from '../components/common/ActionButton'
import {
  currentCustomer,
  customerBarSubtitleLabels,
  formatEgpAmount,
  layoutShellDemo,
  lookupMethodTabs,
  mockReturnInvoices,
  navbarBrand,
  navbarLogoutAriaLabel,
  navbarTabs,
  recentReturnInvoices,
  returnStepsList,
  returnsLabels,
} from '../data/mockData'

// ─── Step indicator ───────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ProgressIndicator({ steps, currentStep }) {
  return (
    <div className="flex w-full min-w-desktop items-center justify-center border-b border-border bg-surface-card px-6 py-4">
      {steps.map((step, idx) => {
        const isDone = currentStep > step.id
        const isActive = currentStep === step.id
        return (
          <Fragment key={step.id}>
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-badge font-bold ${
                  isDone
                    ? 'bg-[#27AE60] text-white'
                    : isActive
                      ? 'bg-brand-navy text-white'
                      : 'border-2 border-border bg-surface text-text-muted'
                }`}
              >
                {isDone ? <CheckIcon /> : step.id}
              </div>
              <span
                className={`text-body font-medium ${
                  isActive ? 'text-text-primary' : 'text-text-secondary'
                }`}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`mx-4 h-px w-14 ${isDone ? 'bg-[#27AE60]' : 'bg-border'}`}
              />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const { navbar } = layoutShellDemo

export default function ReturnsPage() {
  const { state } = useLocation()
  const customer = state?.customer ?? currentCustomer

  const [step, setStep] = useState(1)
  const [foundInvoice, setFoundInvoice] = useState(null)
  const [returnLines, setReturnLines] = useState([])
  const [refundMethod, setRefundMethod] = useState('same')
  const [showNoLinesWarning, setShowNoLinesWarning] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleInvoiceFound = (invoice) => {
    setFoundInvoice(invoice)
    if (invoice) {
      setReturnLines(
        invoice.lines.map((l) => ({
          ...l,
          selected: false,
          returnQty: l.qty,
        })),
      )
    } else {
      setReturnLines([])
    }
    setShowNoLinesWarning(false)
  }

  const activeReturnLines = returnLines.filter(
    (l) => l.selected && l.returnQty > 0,
  )

  const handleNext = () => {
    if (step === 1) {
      if (!foundInvoice) return
      setStep(2)
    } else if (step === 2) {
      if (activeReturnLines.length === 0) {
        setShowNoLinesWarning(true)
        return
      }
      setShowNoLinesWarning(false)
      setStep(3)
    } else if (step === 3) {
      setStep(4)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1)
    setShowNoLinesWarning(false)
  }

  const handleConfirm = () => setConfirmed(true)

  const handleSelectAndAdvance = (invoice) => {
    setFoundInvoice(invoice)
    setReturnLines(
      invoice.lines.map((l) => ({ ...l, selected: false, returnQty: l.qty })),
    )
    setShowNoLinesWarning(false)
    setStep(2)
  }

  const handleNewReturn = () => {
    setStep(1)
    setFoundInvoice(null)
    setReturnLines([])
    setRefundMethod('same')
    setShowNoLinesWarning(false)
    setConfirmed(false)
  }

  const nextDisabled = step === 1 && !foundInvoice

  // Bottom-bar "next" button label
  const nextLabel =
    step === 3 ? returnsLabels.continueToConfirmLabel : returnsLabels.nextLabel

  return (
    <div className="flex min-h-screen min-w-desktop flex-col bg-surface">
      <Navbar
        activeTab="return"
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

      <ProgressIndicator steps={returnStepsList} currentStep={step} />

      <div className="flex-1 overflow-y-auto pb-24">
        {step === 1 && (
          <InvoiceLookup
            invoices={mockReturnInvoices}
            recentInvoices={recentReturnInvoices}
            lookupTabs={lookupMethodTabs}
            foundInvoice={foundInvoice}
            onInvoiceFound={handleInvoiceFound}
            onSelectAndAdvance={handleSelectAndAdvance}
            labels={returnsLabels}
            formatEgp={formatEgpAmount}
          />
        )}

        {step === 2 && foundInvoice && (
          <LineSelection
            invoice={foundInvoice}
            returnLines={returnLines}
            onLinesChange={(lines) => {
              setReturnLines(lines)
              setShowNoLinesWarning(false)
            }}
            labels={returnsLabels}
            formatEgp={formatEgpAmount}
            showNoLinesWarning={showNoLinesWarning}
          />
        )}

        {step === 3 && foundInvoice && (
          <RefundMethod
            invoice={foundInvoice}
            activeReturnLines={activeReturnLines}
            refundMethod={refundMethod}
            onRefundMethodChange={setRefundMethod}
            labels={returnsLabels}
            formatEgp={formatEgpAmount}
          />
        )}

        {step === 4 && foundInvoice && (
          <RefundConfirmation
            invoice={foundInvoice}
            activeReturnLines={activeReturnLines}
            refundMethod={refundMethod}
            labels={returnsLabels}
            formatEgp={formatEgpAmount}
            confirmed={confirmed}
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-10 flex min-w-desktop items-center justify-between border-t border-border bg-surface-card px-6 py-4">
        <div>
          {step > 1 && !confirmed && (
            <ActionButton
              variant="secondary"
              label={returnsLabels.backLabel}
              onClick={handleBack}
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          {confirmed ? (
            <ActionButton
              variant="primary"
              label={returnsLabels.newReturnLabel}
              onClick={handleNewReturn}
            />
          ) : step < 4 ? (
            <ActionButton
              variant={nextDisabled ? 'disabled' : 'primary'}
              label={nextLabel}
              onClick={handleNext}
            />
          ) : (
            <ActionButton
              variant="primary"
              label={returnsLabels.confirmButtonLabel}
              onClick={handleConfirm}
            />
          )}
        </div>
      </div>
    </div>
  )
}
