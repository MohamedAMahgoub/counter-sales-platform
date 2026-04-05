import { useNavigate } from 'react-router-dom'
import { loginPageLabels } from '../data/mockData'

const L = loginPageLabels

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4">
      {/* Logo + app name */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-navy shadow-sm">
          <span className="text-heading font-bold text-white">{L.logoLabel}</span>
        </div>
        <div className="text-center">
          <h1 className="text-heading font-bold text-text-primary">{L.appName}</h1>
          <p className="mt-0.5 text-body text-text-secondary">{L.appTagline}</p>
        </div>
      </div>

      {/* Login card */}
      <div className="w-full max-w-sm rounded-card border border-border bg-surface-card p-6">
        <h2 className="mb-5 text-body font-semibold text-text-primary">{L.formTitle}</h2>

        <div className="mb-4">
          <label className="mb-1.5 block text-label font-medium text-text-primary">
            {L.usernameLabel}
          </label>
          <input
            type="text"
            defaultValue="ahmed.hassan"
            placeholder={L.usernamePlaceholder}
            className="w-full rounded-input border border-border bg-white px-3 py-2.5 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1.5 block text-label font-medium text-text-primary">
            {L.passwordLabel}
          </label>
          <input
            type="password"
            defaultValue="password"
            placeholder={L.passwordPlaceholder}
            className="w-full rounded-input border border-border bg-white px-3 py-2.5 text-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus"
          />
        </div>

        <button
          type="button"
          onClick={() => navigate('/landing')}
          className="w-full rounded-input bg-brand-navy py-2.5 text-body font-semibold text-white transition-colors hover:bg-brand-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
        >
          {L.signInLabel}
        </button>
      </div>
    </div>
  )
}
