export const currentUser = {
  id: 'USR-001',
  name: 'Ahmed Hassan',
  role: 'counter_staff',
  branch: 'Cairo East Branch',
  discountCeiling: 5,
}

export const currentCustomer = {
  id: 'CN-00482',
  name: 'Al Nour Auto Parts',
  type: 'Corporate',
  creditLimit: 50000,
  exposure: 31200,
  overdueBalance: 0,
  creditStatus: 'ok',
  creditStatusLabel: 'Credit OK',
  currency: 'EGP',
  creditChipLabels: {
    limit: 'Limit',
    exposure: 'Exposure',
    available: 'Available',
  },
  loadedVia: 'license_scan',
  loadedViaDisplay: 'license scan',
}

// ─── Login / Landing (Routing step) ──────────────────────────────────────────

export const loginPageLabels = {
  logoLabel: 'SP',
  appName: 'Counter Sales Platform',
  appTagline: 'Powered by SpareParts Pro',
  formTitle: 'Sign in to your account',
  usernameLabel: 'Username',
  usernamePlaceholder: 'Enter your username',
  passwordLabel: 'Password',
  passwordPlaceholder: '••••••••',
  signInLabel: 'Sign In',
}

export const landingPageLabels = {
  pageTitle: 'Identify Customer',
  subtitle:
    'Scan a license plate, enter a customer code, or select a recent customer below.',
  searchPlaceholder: 'Search customer name or code…',
  loadButtonLabel: 'Load Customer →',
  recentCustomersTitle: 'Recent customers',
  creditLabel: 'Available credit',
  typeLabel: 'Type',
  creditStatusOk: 'Credit OK',
  transactionTypeTitle: 'Transaction type',
  recentActivityTitle: 'Recent',
}

export const landingNavItems = [
  {
    id: 'sale',
    label: 'New Sale',
    sublabel: 'Immediate & backorder lines',
    route: '/counter',
  },
  {
    id: 'quotation',
    label: 'New Quotation',
    sublabel: 'With validity date & conversion',
    route: '/quotation',
  },
  {
    id: 'return',
    label: 'Return',
    sublabel: 'Reference original invoice',
    route: '/returns',
  },
]

export const recentTransactions = [
  {
    id: 'SO-2026-0441',
    type: 'Sale',
    customer: 'Al Nour Auto Parts',
    amount: 12450.0,
    date: '2 Apr 2026',
  },
  {
    id: 'QT-2025-0089',
    type: 'Quotation',
    customer: 'Delta Motors',
    amount: 4220.0,
    date: '1 Apr 2026',
  },
  {
    id: 'RET-2026-0021',
    type: 'Return',
    customer: 'Cairo Fleet Services',
    amount: 1750.0,
    date: '31 Mar 2026',
  },
]

export const landingCustomers = [
  {
    id: 'CN-00482',
    name: 'Al Nour Auto Parts',
    type: 'Corporate',
    creditLimit: 50000,
    exposure: 31200,
    overdueBalance: 0,
    creditStatus: 'ok',
    creditStatusLabel: 'Credit OK',
    currency: 'EGP',
    creditChipLabels: { limit: 'Limit', exposure: 'Exposure', available: 'Available' },
    loadedVia: 'license_scan',
    loadedViaDisplay: 'license scan',
  },
  {
    id: 'CN-00291',
    name: 'Delta Motors',
    type: 'Corporate',
    creditLimit: 75000,
    exposure: 22400,
    overdueBalance: 0,
    creditStatus: 'ok',
    creditStatusLabel: 'Credit OK',
    currency: 'EGP',
    creditChipLabels: { limit: 'Limit', exposure: 'Exposure', available: 'Available' },
    loadedVia: 'customer_code',
    loadedViaDisplay: 'customer code',
  },
  {
    id: 'CN-00319',
    name: 'Cairo Fleet Services',
    type: 'Fleet',
    creditLimit: 120000,
    exposure: 98400,
    overdueBalance: 8200,
    creditStatus: 'warning',
    creditStatusLabel: 'Credit Watch',
    currency: 'EGP',
    creditChipLabels: { limit: 'Limit', exposure: 'Exposure', available: 'Available' },
    loadedVia: 'license_scan',
    loadedViaDisplay: 'license scan',
  },
]

// ─────────────────────────────────────────────────────────────────────────────

export const parts = [
  {
    id: 'PT-001',
    partNumber: '04152-YZZD2',
    description: 'Oil Filter — Toyota Corolla 2020–2023',
    qty: 2,
    unitPrice: 145.0,
    availability: 'available',
    stockQty: 14,
    discount: 3,
  },
  {
    id: 'PT-002',
    partNumber: '90916-03096',
    description: 'Air Filter Element — 2.0L Engine',
    qty: 1,
    unitPrice: 220.0,
    availability: 'available',
    stockQty: 6,
    discount: 0,
  },
  {
    id: 'PT-003',
    partNumber: '48520-09360',
    description: 'Front Shock Absorber LH — Hilux',
    qty: 2,
    unitPrice: 780.0,
    availability: 'unavailable',
    stockQty: 0,
    discount: 0,
  },
]

export const activeSaleOrder = {
  transactionId: 'TXN-2025-0441',
  erpDocNumber: 'SO-ERP-241901',
  status: 'open',
  paymentMethod: null,
}

export const branches = [
  { id: 'BR-001', name: 'Cairo East Branch', current: true },
  { id: 'BR-002', name: 'Cairo Central Branch' },
  { id: 'BR-003', name: 'Cairo West Branch' },
  { id: 'BR-004', name: 'Alexandria Branch' },
  { id: 'BR-005', name: 'Giza Branch' },
]

export const pendingApprovals = [
  {
    id: 'APR-001',
    type: 'discount',
    customerName: 'Delta Motors',
    amount: 12450.0,
    submittedAt: '2026-04-02T09:15:00',
    submittedBy: 'Ahmed Hassan',
    orderRef: 'SO-2026-0441',
    status: 'pending',
    triggerSummary: 'Line discount exceeds branch ceiling',
    triggerDetail:
      'Counter staff applied a 12% discount on Oil Filter (04152-YZZD2). The branch ceiling is 5%. An override is required before the order can be confirmed.',
    lines: [
      {
        id: 'APL-001-1',
        partNumber: '04152-YZZD2',
        description: 'Oil Filter — Toyota Corolla 2020–2023',
        qty: 10,
        unitPrice: 145.0,
        discount: 12,
      },
      {
        id: 'APL-001-2',
        partNumber: '90916-03096',
        description: 'Air Filter Element — 2.0L Engine',
        qty: 5,
        unitPrice: 220.0,
        discount: 0,
      },
      {
        id: 'APL-001-3',
        partNumber: '48520-09360',
        description: 'Front Shock Absorber LH — Hilux',
        qty: 2,
        unitPrice: 780.0,
        discount: 0,
      },
    ],
  },
  {
    id: 'APR-002',
    type: 'return',
    customerName: 'Cairo Fleet Services',
    amount: 3890.5,
    submittedAt: '2026-04-02T08:42:00',
    submittedBy: 'Mona Khalil',
    orderRef: 'INV-2026-0318',
    status: 'pending',
    triggerSummary: 'Return value above auto-approval limit',
    triggerDetail:
      'Return total of EGP 3,890.50 exceeds the EGP 2,000 per-transaction auto-approval ceiling. Manual sign-off required.',
    lines: [
      {
        id: 'APL-002-1',
        partNumber: '48520-09360',
        description: 'Front Shock Absorber LH — Hilux',
        qty: 3,
        unitPrice: 780.0,
        discount: 0,
      },
      {
        id: 'APL-002-2',
        partNumber: '04465-06170',
        description: 'Front Brake Pad Set — Land Cruiser',
        qty: 2,
        unitPrice: 420.0,
        discount: 0,
      },
    ],
  },
  {
    id: 'APR-003',
    type: 'credit',
    customerName: 'Nile Parts Co.',
    amount: 67200.0,
    submittedAt: '2026-04-01T16:20:00',
    submittedBy: 'Sara Mostafa',
    orderRef: 'SO-2026-0419',
    status: 'pending',
    triggerSummary: 'Exposure would exceed temporary credit uplift',
    triggerDetail:
      'This order would raise Nile Parts Co. total exposure to EGP 98,500, exceeding their approved temporary uplift ceiling of EGP 90,000. Credit team sign-off required.',
    lines: [
      {
        id: 'APL-003-1',
        partNumber: '04465-06170',
        description: 'Front Brake Pad Set — Land Cruiser',
        qty: 20,
        unitPrice: 420.0,
        discount: 0,
      },
      {
        id: 'APL-003-2',
        partNumber: '33201-36010',
        description: 'Clutch Disc Assembly — Hilux',
        qty: 15,
        unitPrice: 1240.0,
        discount: 5,
      },
      {
        id: 'APL-003-3',
        partNumber: '90916-03096',
        description: 'Air Filter Element — 2.0L Engine',
        qty: 30,
        unitPrice: 220.0,
        discount: 0,
      },
    ],
  },
  {
    id: 'APR-004',
    type: 'discount',
    customerName: 'Alexandria Workshop',
    amount: 2100.0,
    submittedAt: '2026-04-01T14:05:00',
    submittedBy: 'Ahmed Hassan',
    orderRef: 'SO-2026-0397',
    status: 'pending',
    triggerSummary: 'Additional discount on already discounted SKU',
    triggerDetail:
      'Part 48520-09360 already carries a 5% supplier discount coded into the base price. Staff applied an additional 8% discount, requiring manager approval.',
    lines: [
      {
        id: 'APL-004-1',
        partNumber: '48520-09360',
        description: 'Front Shock Absorber LH — Hilux',
        qty: 3,
        unitPrice: 780.0,
        discount: 8,
      },
    ],
  },
  {
    id: 'APR-005',
    type: 'return',
    customerName: 'Red Sea Garage',
    amount: 950.0,
    submittedAt: '2026-04-01T11:30:00',
    submittedBy: 'Omar Fathy',
    orderRef: 'INV-2025-3192',
    status: 'pending',
    triggerSummary: 'Serialized part return without original invoice line',
    triggerDetail:
      'Serialized part (SN: TYO-2024-00981) cannot be automatically matched to an original invoice line. Physical verification and manual approval required before processing.',
    lines: [
      {
        id: 'APL-005-1',
        partNumber: '12631-0H020',
        description: 'Engine Mount — Front Lower RH',
        qty: 1,
        unitPrice: 950.0,
        discount: 0,
      },
    ],
  },
  {
    id: 'APR-006',
    type: 'discount',
    customerName: 'Giza Trucks LLC',
    amount: 45100.0,
    submittedAt: '2026-04-01T09:00:00',
    submittedBy: 'Karim Adel',
    orderRef: 'SO-2026-0388',
    status: 'pending',
    triggerSummary: 'Bulk order discount above customer tier limit',
    triggerDetail:
      'A 15% bulk discount was requested on a large Hilux parts order for Giza Trucks LLC. The maximum pre-approved discount for this customer tier (Gold) is 10%.',
    lines: [
      {
        id: 'APL-006-1',
        partNumber: '48520-09360',
        description: 'Front Shock Absorber LH — Hilux',
        qty: 10,
        unitPrice: 780.0,
        discount: 15,
      },
      {
        id: 'APL-006-2',
        partNumber: '48530-09360',
        description: 'Front Shock Absorber RH — Hilux',
        qty: 10,
        unitPrice: 780.0,
        discount: 15,
      },
      {
        id: 'APL-006-3',
        partNumber: '04465-06170',
        description: 'Front Brake Pad Set — Land Cruiser',
        qty: 8,
        unitPrice: 420.0,
        discount: 15,
      },
    ],
  },
]

export const pendingPayments = [
  {
    id: 'PAY-001',
    type: 'Bank Transfer',
    customerName: 'Al Nour Auto Parts',
    amount: 18420.5,
    dueDate: '2026-04-05',
    submittedAt: '2026-04-03T09:00:00',
    orderRef: 'SO-2026-0441',
    bankName: 'CIB Bank',
    reference: '',
    status: 'pending',
    lines: [
      {
        id: 'PL-001-1',
        partNumber: '04152-YZZD2',
        description: 'Oil Filter — Toyota Corolla 2020–2023',
        qty: 20,
        unitPrice: 145.0,
        discount: 0,
      },
      {
        id: 'PL-001-2',
        partNumber: '90916-03096',
        description: 'Air Filter Element — 2.0L Engine',
        qty: 15,
        unitPrice: 220.0,
        discount: 0,
      },
      {
        id: 'PL-001-3',
        partNumber: '48520-09360',
        description: 'Front Shock Absorber LH — Hilux',
        qty: 8,
        unitPrice: 780.0,
        discount: 5,
      },
    ],
  },
  {
    id: 'PAY-002',
    type: 'CDC',
    customerName: 'Delta Motors',
    amount: 8900.0,
    dueDate: '2026-04-03',
    submittedAt: '2026-04-02T11:30:00',
    orderRef: 'SO-2026-0397',
    chequeNumber: 'CDC-77821',
    reference: 'CDC-77821',
    status: 'pending',
    lines: [
      {
        id: 'PL-002-1',
        partNumber: '48520-09360',
        description: 'Front Shock Absorber LH — Hilux',
        qty: 5,
        unitPrice: 780.0,
        discount: 0,
      },
      {
        id: 'PL-002-2',
        partNumber: '04465-06170',
        description: 'Front Brake Pad Set — Land Cruiser',
        qty: 8,
        unitPrice: 420.0,
        discount: 5,
      },
    ],
  },
  {
    id: 'PAY-003',
    type: 'PDC',
    customerName: 'Cairo Fleet Services',
    amount: 15200.0,
    chequeDate: '2026-04-04',
    submittedAt: '2026-04-02T14:20:00',
    orderRef: 'SO-2026-0385',
    chequeNumber: 'CHQ-004821',
    reference: '',
    status: 'pending',
    lines: [
      {
        id: 'PL-003-1',
        partNumber: '33201-36010',
        description: 'Clutch Disc Assembly — Hilux',
        qty: 10,
        unitPrice: 1240.0,
        discount: 0,
      },
      {
        id: 'PL-003-2',
        partNumber: '04152-YZZD2',
        description: 'Oil Filter — Toyota Corolla 2020–2023',
        qty: 10,
        unitPrice: 145.0,
        discount: 0,
      },
    ],
  },
  {
    id: 'PAY-004',
    type: 'PDC',
    customerName: 'Nile Parts Co.',
    amount: 42000.0,
    chequeDate: '2026-04-09',
    submittedAt: '2026-04-01T16:00:00',
    orderRef: 'SO-2026-0419',
    chequeNumber: 'CHQ-006203',
    reference: '',
    status: 'pending',
    lines: [
      {
        id: 'PL-004-1',
        partNumber: '04465-06170',
        description: 'Front Brake Pad Set — Land Cruiser',
        qty: 30,
        unitPrice: 420.0,
        discount: 0,
      },
      {
        id: 'PL-004-2',
        partNumber: '33201-36010',
        description: 'Clutch Disc Assembly — Hilux',
        qty: 20,
        unitPrice: 1240.0,
        discount: 5,
      },
    ],
  },
  {
    id: 'PAY-005',
    type: 'Refund',
    customerName: 'Alexandria Workshop',
    amount: 1750.0,
    dueDate: '2026-04-02',
    submittedAt: '2026-04-01T10:30:00',
    orderRef: 'INV-2026-0288',
    reference: 'RET-9081',
    status: 'pending',
    lines: [
      {
        id: 'PL-005-1',
        partNumber: '48520-09360',
        description: 'Front Shock Absorber LH — Hilux',
        qty: 2,
        unitPrice: 780.0,
        discount: 0,
      },
    ],
  },
  {
    id: 'PAY-006',
    type: 'Bank Transfer',
    customerName: 'Giza Trucks LLC',
    amount: 32100.75,
    dueDate: '2026-04-08',
    submittedAt: '2026-04-03T13:45:00',
    orderRef: 'SO-2026-0388',
    bankName: 'Banque Misr',
    reference: '',
    status: 'pending',
    lines: [
      {
        id: 'PL-006-1',
        partNumber: '48520-09360',
        description: 'Front Shock Absorber LH — Hilux',
        qty: 10,
        unitPrice: 780.0,
        discount: 15,
      },
      {
        id: 'PL-006-2',
        partNumber: '48530-09360',
        description: 'Front Shock Absorber RH — Hilux',
        qty: 10,
        unitPrice: 780.0,
        discount: 15,
      },
      {
        id: 'PL-006-3',
        partNumber: '04465-06170',
        description: 'Front Brake Pad Set — Land Cruiser',
        qty: 8,
        unitPrice: 420.0,
        discount: 15,
      },
    ],
  },
  {
    id: 'PAY-007',
    type: 'Bank Transfer',
    customerName: 'Red Sea Garage',
    amount: 4200.0,
    dueDate: '2026-04-06',
    submittedAt: '2026-04-03T15:00:00',
    orderRef: 'SO-2026-0412',
    bankName: 'NBE',
    reference: '',
    status: 'pending',
    lines: [
      {
        id: 'PL-007-1',
        partNumber: '12631-0H020',
        description: 'Engine Mount — Front Lower RH',
        qty: 4,
        unitPrice: 950.0,
        discount: 0,
      },
    ],
  },
  {
    id: 'PAY-008',
    type: 'CDC',
    customerName: 'Cairo Workshop Co.',
    amount: 3780.0,
    dueDate: '2026-04-07',
    submittedAt: '2026-04-03T16:15:00',
    orderRef: 'SO-2026-0409',
    chequeNumber: 'CDC-88203',
    reference: 'CDC-88203',
    status: 'pending',
    lines: [
      {
        id: 'PL-008-1',
        partNumber: '90916-03096',
        description: 'Air Filter Element — 2.0L Engine',
        qty: 6,
        unitPrice: 220.0,
        discount: 0,
      },
      {
        id: 'PL-008-2',
        partNumber: '04152-YZZD2',
        description: 'Oil Filter — Toyota Corolla 2020–2023',
        qty: 12,
        unitPrice: 145.0,
        discount: 0,
      },
    ],
  },
]

export const quotations = [
  {
    id: 'QT-2025-0089',
    status: 'open',
    validityDate: '2026-05-02',
    totalUnits: 24,
    consumedUnits: 11,
    lines: [
      {
        id: 'QTL-001',
        partNumber: '04152-YZZD2',
        description: 'Oil Filter — Toyota Corolla 2020–2023',
        qtyQuoted: 10,
        qtyConsumed: 4,
        unitPrice: 145.0,
        discount: 2,
        availability: 'available',
        stockQty: 14,
        linkedOrderBackorder: null,
      },
      {
        id: 'QTL-002',
        partNumber: '90916-03096',
        description: 'Air Filter Element — 2.0L Engine',
        qtyQuoted: 8,
        qtyConsumed: 5,
        unitPrice: 220.0,
        discount: 0,
        availability: 'available',
        stockQty: 6,
        linkedOrderBackorder: null,
      },
      {
        id: 'QTL-003',
        partNumber: '48520-09360',
        description: 'Front Shock Absorber LH — Hilux',
        qtyQuoted: 6,
        qtyConsumed: 2,
        unitPrice: 780.0,
        discount: 0,
        availability: 'unavailable',
        stockQty: 0,
        linkedOrderBackorder: {
          orderId: 'SO-2025-1203',
          sourceBranch: 'Cairo Central Branch',
          eta: '2 days',
          qty: 2,
          status: 'backordered',
        },
      },
    ],
  },
]

export const step1StatusBadgeLabels = {
  available: 'In stock',
  backorder: 'Backorder',
  pending: 'Pending',
  blocked: 'Blocked',
  approved: 'Approved',
  rejected: 'Rejected',
  draft: 'Draft',
  consumed: 'Consumed',
  expired: 'Expired',
}

export const step1PreviewCopy = {
  pageTitle: 'Step 1 — Common components',
  pageSubtitle:
    'Preview only. Routing and remaining screens start in Step 2 after your confirmation.',
  sectionStatusBadge: 'StatusBadge',
  sectionActionButton: 'ActionButton',
  sectionMetricCard: 'MetricCard',
}

export const step1ActionButtonDemo = [
  { id: 'btn-primary', variant: 'primary', label: 'Primary' },
  { id: 'btn-secondary', variant: 'secondary', label: 'Secondary' },
  { id: 'btn-destructive', variant: 'destructive', label: 'Destructive' },
  { id: 'btn-disabled', variant: 'disabled', label: 'Disabled' },
]

export const step1MetricCardDemo = [
  {
    id: 'mc-exposure',
    label: 'Exposure',
    value: 'EGP 31,200.00',
    valueTone: 'default',
  },
  {
    id: 'mc-overdue',
    label: 'Overdue',
    value: 'EGP 4,500.00',
    valueTone: 'warning',
  },
  {
    id: 'mc-blocked',
    label: 'Blocked lines',
    value: '3',
    valueTone: 'alert',
  },
]

export const navbarBrand = {
  logoLabel: 'SP',
}

export const navbarTabs = [
  { id: 'sale', label: 'Sale' },
  { id: 'quotation', label: 'Quotation' },
  { id: 'return', label: 'Return' },
]

export const navbarLogoutAriaLabel = 'Log out'

export const customerBarSubtitleLabels = {
  customerIdPrefix: 'Customer ID:',
  separator: '·',
  loadedViaPrefix: 'Loaded via',
}

export const layoutShellDemo = {
  navbar: {
    activeTab: 'sale',
    userName: currentUser.name,
    userRole: 'Counter staff',
    branchName: currentUser.branch,
  },
  customerBar: {
    customer: currentCustomer,
    creditStatus: currentCustomer.creditStatus,
  },
}

export const discountCeilingInlineWarning = 'Exceeds your 5% ceiling'

export const partsTableColumnLabels = {
  partNumber: 'Part number',
  description: 'Description',
  qty: 'Qty',
  unitPrice: 'Unit price',
  availability: 'AVAILABILITY',
  discountPercent: 'DISC. %',
  discountValue: 'DISC. VAL',
  lineTotal: 'Line total',
  action: 'Actions',
}

export const availabilityCopy = {
  availableLabel: 'Available',
  inStock: 'in stock',
  unavailableLabel: 'Out of Stock',
  backorderedLabel: 'Backordered',
  etaPrefix: 'ETA',
  daysWord: 'days',
  backorderLinkLabel: 'Backorder →',
  branchSelectPlaceholder: 'Select source branch',
  branchSelectError: 'Select a source branch to confirm backorder',
}

export const addPartRowPlaceholder =
  'Scan barcode, enter part number, or search EPC catalog'

export const paymentDropdownPlaceholder = 'Select payment method'

export const paymentDropdownOptions = [
  { value: 'pos_card', label: 'POS / Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'credit', label: 'Credit' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cdc', label: 'CDC' },
  { value: 'pdc', label: 'PDC' },
]

export const paymentCreditValue = 'credit'

export const paymentWarningNotSelected =
  'Payment method not selected — please confirm with customer'

export const paymentWarningCreditBlocked =
  'Credit account blocked — switch method or request override'

export const blockedBannerMessage =
  'This customer has overdue balance — credit payment is blocked until the account is cleared or an override is applied.'

export const creditSaleBlockedBadgeLabel = 'Credit Blocked'

export const financeApprovalPaymentValues = ['bank_transfer', 'cdc', 'pdc']

export const pendingOverrideBannerMessage =
  'Override request sent — awaiting supervisor approval before this sale can be confirmed.'

export const pendingFinanceBannerMessage =
  'Awaiting finance confirmation — payment reference required before order is released.'

export const orderSummaryLabels = {
  immediateTotal: 'Immediate lines',
  backorderTotal: 'Backorder lines',
  unavailableTotal: 'Unavailable',
  subtotal: 'Subtotal',
  vat: 'VAT (14%)',
  total: 'Total',
  paymentMethod: 'Payment method',
  confirm: 'Confirm sale',
  requestOverride: 'Request Override',
  cancelTransaction: 'Cancel Transaction',
  withdrawRequest: 'Withdraw Request',
  outOfStockWarning:
    'Some lines are out of stock — backorder or remove before confirming',
}

export const saleConfirmationLabels = {
  confirmedTitle: 'Sale Confirmed',
  pendingTitle: 'Order Confirmed — Awaiting Payment',
  transactionIdLabel: 'Transaction',
  erpDocLabel: 'ERP Doc',
  statusClosed: 'Closed',
  statusPartiallyFulfilled: 'Partially fulfilled',
  statusPending: 'Open — Awaiting Payment',
  paymentReceivedPrefix: 'Payment received via',
  paymentConfirmedText: 'Payment confirmed',
  financeNote: 'Payment will be confirmed by the finance team',
  markPaymentReceived: 'Mark Payment Received',
  newTransaction: 'New Transaction →',
  printReceipt: 'Print Receipt',
  immediateDeliveryTitle: 'Immediate delivery',
  backorderSectionTitle: 'Backorder',
  shippedFromPrefix: 'Shipped from',
  transferRequestPrefix: 'Transfer request sent to',
}

export const copyFromBannerLabels = {
  prefix: 'Copied from',
  suffix: '· Prices locked from quotation',
  viewOriginal: 'View original →',
}

export const deleteLineAriaLabel = 'Remove line'

// ─── Quotation (Step 4) ───────────────────────────────────────────────────────

export const quotationColumnLabels = {
  partNumber: 'Part number',
  description: 'Description',
  qtyQuoted: 'Qty quoted',
  consumption: 'CONSUMPTION',
  unitPrice: 'Unit price',
  availability: 'AVAILABILITY',
  discountPercent: 'DISC. %',
  discountValue: 'DISC. VAL',
  lineTotal: 'Line total',
  action: 'Actions',
}

export const quotationStatusVariantMap = {
  open: 'available',
  draft: 'draft',
  expired: 'expired',
  consumed: 'consumed',
}

export const quotationStatusLabelMap = {
  open: 'Open',
  draft: 'Draft',
  expired: 'Expired',
  consumed: 'Fully consumed',
}

export const validityBarLabels = {
  quotationPrefix: 'Quotation',
  validUntilLabel: 'Valid until',
  unitsConvertedSuffix: 'units converted',
}

export const consumptionBarCopy = {
  ofLabel: 'of',
  convertedSuffix: 'converted',
  fullyConsumedLabel: 'Fully consumed',
  fullyConsumedMessage: 'Fully converted',
  backorderNoteSuffix: 'units on backorder — see linked order',
}

export const quotationSummaryLabels = {
  subtotal: 'Subtotal',
  vat: 'VAT (14%)',
  total: 'Total',
  copyToOrder: 'Copy to order',
  saveDraft: 'Save as draft',
  unavailableNoteSuffix:
    'unavailable at current branch — backorder will be managed at order level',
}

export const quotationAvailabilityCopy = {
  availableLabel: 'Available',
  inStock: 'in stock',
  unavailableLabel: 'Out of Stock',
  notAvailableText: 'Not available at current branch',
  backorderedLabel: 'Backordered',
  etaPrefix: 'ETA',
  qtyLabel: 'Qty:',
  onBackorderText: 'on backorder',
  viewOrderLabel: 'View order →',
}

export const deleteQuotationLineAriaLabel = 'Remove quotation line'

// ─── Returns (Step 5) ────────────────────────────────────────────────────────

export const mockReturnInvoices = [
  {
    id: 'INV-2025-3841',
    date: '12 Mar 2025',
    customerName: 'Al Nour Auto Parts',
    paymentMethod: 'Cash',
    lines: [
      {
        id: 'INV-L-001',
        partNumber: '04152-YZZD2',
        description: 'Oil Filter — Toyota Corolla 2020–2023',
        qty: 4,
        unitPrice: 145.0,
        discount: 0,
      },
      {
        id: 'INV-L-002',
        partNumber: '90916-03096',
        description: 'Air Filter Element — 2.0L Engine',
        qty: 2,
        unitPrice: 220.0,
        discount: 0,
      },
    ],
  },
]

export const recentReturnInvoices = [
  {
    id: 'INV-2025-3841',
    date: '12 Mar 2025',
    customerName: 'Al Nour Auto Parts',
    paymentMethod: 'Cash',
    total: 1020.0,
    lineCount: 2,
    returnEligible: true,
    lines: [
      {
        id: 'R-L-001',
        partNumber: '04152-YZZD2',
        description: 'Oil Filter — Toyota Corolla 2020–2023',
        qty: 4,
        unitPrice: 145.0,
        discount: 0,
      },
      {
        id: 'R-L-002',
        partNumber: '90916-03096',
        description: 'Air Filter Element — 2.0L Engine',
        qty: 2,
        unitPrice: 220.0,
        discount: 0,
      },
    ],
  },
  {
    id: 'INV-2025-3290',
    date: '28 Feb 2025',
    customerName: 'Al Nour Auto Parts',
    paymentMethod: 'POS / Card',
    total: 4220.0,
    lineCount: 6,
    returnEligible: true,
    lines: [
      {
        id: 'R-L-005',
        partNumber: '48520-09360',
        description: 'Front Shock Absorber LH — Hilux',
        qty: 3,
        unitPrice: 780.0,
        discount: 0,
      },
      {
        id: 'R-L-006',
        partNumber: '48530-09360',
        description: 'Front Shock Absorber RH — Hilux',
        qty: 3,
        unitPrice: 780.0,
        discount: 0,
      },
      {
        id: 'R-L-007',
        partNumber: '90916-03096',
        description: 'Air Filter Element — 2.0L Engine',
        qty: 2,
        unitPrice: 220.0,
        discount: 0,
      },
      {
        id: 'R-L-008',
        partNumber: '04152-YZZD2',
        description: 'Oil Filter — Toyota Corolla 2020–2023',
        qty: 2,
        unitPrice: 145.0,
        discount: 0,
      },
      {
        id: 'R-L-009',
        partNumber: '04152-31080',
        description: 'Oil Filter — Camry 2.5L',
        qty: 2,
        unitPrice: 130.0,
        discount: 0,
      },
      {
        id: 'R-L-010',
        partNumber: '90915-YZZE1',
        description: 'Cabin Air Filter — Yaris 1.3L',
        qty: 2,
        unitPrice: 95.0,
        discount: 0,
      },
    ],
  },
  {
    id: 'INV-2025-2901',
    date: '15 Jan 2025',
    customerName: 'Al Nour Auto Parts',
    paymentMethod: 'Cash',
    total: 980.0,
    lineCount: 2,
    returnEligible: false,
    lines: [],
  },
]

export const lookupMethodTabs = [
  { id: 'license', label: 'Scan License' },
  { id: 'customer', label: 'Customer Code' },
  { id: 'invoice', label: 'Invoice Number' },
]

export const returnStepsList = [
  { id: 1, label: 'Invoice lookup' },
  { id: 2, label: 'Select lines' },
  { id: 3, label: 'Refund method' },
  { id: 4, label: 'Confirm refund' },
]

export const returnsLabels = {
  pageTitle: 'Process return',
  scanLicensePlaceholder: 'Scan or enter vehicle license plate number',
  customerCodePlaceholder: 'Enter customer code (e.g. CN-00482)',
  searchPlaceholder: 'Enter invoice number (e.g. INV-2026-0441)',
  searchButtonLabel: 'Search',
  invoiceNotFoundMessage: 'No invoice found for that reference. Check the number and try again.',
  recentInvoicesTitle: 'Recent invoices for this customer',
  eligibleBadgeLabel: 'Eligible for return',
  ineligibleBadgeLabel: 'Outside return window',
  selectInvoiceLabel: 'Select',
  unavailableLabel: 'Unavailable',
  foundInvoiceTitle: 'Invoice found',
  invoiceDateLabel: 'Date',
  invoicePaymentLabel: 'Payment method',
  invoiceLinesLabel: 'Lines',
  invoiceTotalLabel: 'Invoice total',
  invoiceItemsSuffix: 'items',
  nextLabel: 'Next',
  backLabel: 'Back',
  selectLinesTitle: 'Select lines to return',
  selectLinesNote:
    'Choose which items to return and adjust quantities if only a partial return is needed.',
  columnPartNumber: 'Part number',
  columnDescription: 'Description',
  columnOrigQty: 'Orig. qty',
  columnReturnQty: 'Return qty',
  columnUnitPrice: 'Unit price',
  columnReturnValue: 'Return value',
  selectionSubtotalLabel: 'Return subtotal',
  noLinesWarning: 'Select at least one line to continue.',
  confirmTitle: 'Confirm return',
  invoiceRefLabel: 'Invoice ref',
  originalPaymentLabel: 'Original payment',
  linesBeingReturnedTitle: 'Items being returned',
  refundMethodLabel: 'Refund method',
  refundMethodNote: 'Auto-populated from original payment — not selectable',
  subtotalLabel: 'Subtotal',
  vatLabel: 'VAT (14%)',
  totalRefundLabel: 'Total refund',
  refundMethodTitle: 'Select Refund Method',
  refundMethodSectionLabel: 'How will the refund be issued?',
  refundMethodReturnSummaryTitle: 'Return summary',
  refundMethodSameLabel: 'Same as original payment',
  refundMethodCreditNoteLabel: 'Credit note',
  refundMethodCreditNoteSublabel:
    'Issue credit note against customer account for future use',
  refundMethodCreditNoteWarning:
    'Credit notes require finance team approval before they are issued',
  refundMethodTimingLabel: 'Refund timing',
  refundMethodTimingImmediate: 'Immediate',
  refundMethodTimingPending: 'Pending approval',
  continueToConfirmLabel: 'Continue to confirm →',
  confirmButtonLabel: 'Confirm return',
  backToSelectionLabel: 'Back',
  successTitle: 'Return confirmed',
  successMessage:
    'The return has been processed. A refund will be issued via the original payment method.',
  newReturnLabel: 'Process another return',
}

// ─── Finance Queue (Step 7) ──────────────────────────────────────────────────

export const financeFilterTabs = [
  { id: 'all', label: 'All', type: null },
  { id: 'bank-transfer', label: 'Bank Transfer', type: 'Bank Transfer' },
  { id: 'cdc', label: 'CDC', type: 'CDC' },
  { id: 'pdc', label: 'PDC', type: 'PDC' },
  { id: 'refund', label: 'Refunds', type: 'Refund' },
]

export const financeQueueLabels = {
  leftPanelTitle: 'Payment Approvals',
  pendingBadgeSuffix: 'pending',
  metricPending: 'Pending',
  metricTotalValue: 'Total value',
  metricPdcsDueThisWeek: 'PDCs due this week',
  metricOverduePdcs: 'Overdue PDCs',
  emptyDetailTitle: 'No payment selected',
  emptyDetailMessage: 'Select a payment from the list on the left to review it.',
  orderRefLabel: 'Order ref',
  submittedAtLabel: 'Submitted',
  dueDateLabel: 'Due date',
  chequeDateLabel: 'Cheque date',
  chequeNumberLabel: 'Cheque number',
  bankNameLabel: 'Bank',
  referenceLabel: 'Reference',
  transferReferenceLabel: 'Transfer reference',
  transferReferencePlaceholder: 'Enter bank transfer reference (e.g. TRF-20260404-001)',
  transferReferenceNote: 'Enter once the transfer is confirmed with the bank.',
  orderSummaryTitle: 'Order summary',
  columnPartNumber: 'Part number',
  columnDescription: 'Description',
  columnQty: 'Qty',
  columnUnitPrice: 'Unit price',
  columnDiscount: 'Disc. %',
  columnLineTotal: 'Line total',
  commentPlaceholder: 'Add a note (optional)…',
  confirmButtonLabel: 'Confirm payment',
  rejectButtonLabel: 'Reject',
  confirmReleaseNote: 'Confirming will release the order for delivery',
  confirmedOutcomeLabel: 'Payment confirmed',
  rejectedOutcomeLabel: 'Payment rejected',
  statusVariantMap: {
    pending: 'pending',
    confirmed: 'approved',
    rejected: 'rejected',
  },
  statusLabelMap: {
    pending: 'Pending',
    confirmed: 'Confirmed',
    rejected: 'Rejected',
  },
}

// ─── Approval Queue (Step 6) ─────────────────────────────────────────────────

export const approvalFilterTabs = [
  { id: 'all', label: 'All', type: null },
  { id: 'discount', label: 'Discounts', type: 'discount' },
  { id: 'return', label: 'Returns', type: 'return' },
  { id: 'credit', label: 'Credit', type: 'credit' },
]

export const approvalQueueLabels = {
  leftPanelTitle: 'Pending Approvals',
  pendingBadgeSuffix: 'pending',
  emptyDetailTitle: 'No request selected',
  emptyDetailMessage:
    'Select an approval request from the list on the left to review it.',
  triggerCardTitle: 'Why approval is needed',
  orderSummaryTitle: 'Order summary',
  commentPlaceholder: 'Add a comment (optional)…',
  approveButtonLabel: 'Approve',
  rejectButtonLabel: 'Reject',
  approvedOutcomeLabel: 'Approved',
  rejectedOutcomeLabel: 'Rejected',
  submittedByLabel: 'Submitted by',
  submittedAtLabel: 'Submitted',
  orderRefLabel: 'Order ref',
  columnPartNumber: 'Part number',
  columnDescription: 'Description',
  columnQty: 'Qty',
  columnUnitPrice: 'Unit price',
  columnDiscount: 'Disc. %',
  columnLineTotal: 'Line total',
  typeLabelMap: {
    discount: 'Discount',
    return: 'Return',
    credit: 'Credit',
  },
  typeVariantMap: {
    discount: 'pending',
    return: 'backorder',
    credit: 'blocked',
  },
  statusVariantMap: {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
  },
  statusLabelMap: {
    pending: 'Pending review',
    approved: 'Approved',
    rejected: 'Rejected',
  },
  triggerTintMap: {
    discount: { bg: '#FFFBF0', border: '#F39C12' },
    return: { bg: '#FFFBF0', border: '#F39C12' },
    credit: { bg: '#FFF5F5', border: '#E74C3C' },
  },
}

export function formatEgpAmount(amount) {
  const s = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return `EGP ${s}`
}
