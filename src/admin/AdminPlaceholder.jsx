import { ArrowUpRight } from 'lucide-react'

export function AdminPlaceholder() {
  return (
    <div className="admin-page">
      <a className="skip-link" href="#admin-main">Skip to admin content</a>
      <header className="admin-header">
        <div className="admin-header__inner">
          <a className="wordmark" href="/" aria-label="WIZTECH public portfolio">
            W<span>/</span>T<span className="wordmark__dot">.</span>
          </a>
          <a className="admin-header__link" href="/">
            View portfolio <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </header>

      <main className="admin-content" id="admin-main" tabIndex="-1">
        <section className="admin-card" aria-labelledby="admin-title">
          <p className="admin-eyebrow">
            <span className="status-dot" aria-hidden="true" />
            WIZTECH ADMIN
          </p>
          <h1 id="admin-title">Dashboard setup is underway.</h1>
          <p className="admin-description">
            This area is reserved for portfolio management. Dashboard features and
            administrator sign-in will be added in a later stage.
          </p>
          <p className="admin-notice" role="note">
            Placeholder only: this page is not protected and does not manage or store data.
          </p>
          <a className="button button--primary" href="/">
            Return to portfolio <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </section>
      </main>

      <footer className="admin-footer">
        <span>WIZTECH</span>
        <span>Portfolio management</span>
      </footer>
    </div>
  )
}
