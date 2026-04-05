import { useLocation, useNavigate } from 'react-router-dom'

const TAB_ROUTES = {
  sale: '/counter',
  quotation: '/quotation',
  return: '/returns',
}

const ROUTE_TO_TAB = {
  '/counter': 'sale',
  '/quotation': 'quotation',
  '/returns': 'return',
}

const PAGE_TITLES = {
  '/approvals': 'Approval Queue',
  '/finance': 'Finance Queue',
}

/**
 * @param {object} props
 * @param {'sale'|'quotation'|'return'} [props.activeTab] — fallback when URL doesn't match a tab
 * @param {string} props.userName
 * @param {string} props.userRole
 * @param {string} props.branchName
 * @param {string} props.logoLabel
 * @param {{ id: string, label: string }[]} props.tabs
 * @param {string} props.logoutAriaLabel
 * @param {() => void} [props.onLogout]
 */
export default function Navbar({
  activeTab,
  userName,
  userRole,
  branchName,
  logoLabel,
  tabs,
  logoutAriaLabel,
  onLogout,
}) {
  const navigate = useNavigate()
  const location = useLocation()

  // Derive active tab from URL; fall back to the prop
  const currentTab = ROUTE_TO_TAB[location.pathname] ?? activeTab

  const handleTabClick = (tabId) => {
    const route = TAB_ROUTES[tabId]
    // Pass existing route state through so the loaded customer persists across tabs
    if (route) navigate(route, { state: location.state })
  }

  const pageTitle = PAGE_TITLES[location.pathname]

  const handleLogout = onLogout ?? (() => navigate('/'))

  return (
    <header className="relative flex h-[60px] w-full min-w-desktop shrink-0 items-center bg-brand-navy px-6 text-white">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-body font-bold text-brand-navy"
          aria-hidden
        >
          {logoLabel}
        </div>
        <span className="truncate text-body font-medium">{branchName}</span>
      </div>

      {pageTitle ? (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-body font-semibold text-white">
          {pageTitle}
        </span>
      ) : (
        <nav
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1"
          aria-label="Main"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === currentTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-body font-medium ${
                  isActive
                    ? 'bg-white text-brand-navy'
                    : 'bg-transparent text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>
      )}

      <div className="flex min-w-0 flex-1 items-center justify-end gap-1 pl-4">
        {/* Back + Home shortcuts */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="shrink-0 rounded-input p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Go back"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => navigate('/landing')}
          className="shrink-0 rounded-input p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Go to home"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15.75A.75.75 0 0115 21v-5.25a.75.75 0 00-.75-.75h-4.5a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
          </svg>
        </button>

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-white/20" />

        <span className="ml-1 truncate text-body font-medium">{userName}</span>
        <span className="shrink-0 rounded-badge border border-white/40 px-2.5 py-0.5 text-badge font-medium text-white">
          {userRole}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="shrink-0 rounded-input p-1.5 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={logoutAriaLabel}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}
