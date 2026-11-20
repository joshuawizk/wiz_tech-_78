import { useEffect, useState } from 'react'
import { ArrowUpRight, LogOut } from 'lucide-react'
import { getSupabaseClient, getSupabaseConfigurationError } from '../lib/supabase.js'
import { ProjectsManager } from './ProjectsManager.jsx'
import { SkillsManager } from './SkillsManager.jsx'

function getErrorMessage(error, fallback) {
  if (error && typeof error.message === 'string') return error.message
  return fallback
}

function AdminShell({ children, session, onSignOut, isSigningOut, signOutError }) {
  return (
    <div className="admin-page">
      <a className="skip-link" href="#admin-main">Skip to admin content</a>
      <header className="admin-header">
        <div className="admin-header__inner">
          <a className="wordmark" href="/" aria-label="WIZTECH public portfolio">
            W<span>/</span>T<span className="wordmark__dot">.</span>
          </a>
          <div className="admin-header__actions">
            <a className="admin-header__link" href="/">
              View portfolio <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            {session && (
              <button
                className="admin-signout"
                type="button"
                onClick={onSignOut}
                disabled={isSigningOut}
              >
                <LogOut size={14} aria-hidden="true" />
                {isSigningOut ? 'Signing out…' : 'Sign out'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="admin-content" id="admin-main" tabIndex="-1">
        {signOutError && <p className="admin-error" role="alert">{signOutError}</p>}
        {children}
      </main>

      <footer className="admin-footer">
        <span>WIZTECH</span>
        <span>Portfolio management</span>
      </footer>
    </div>
  )
}

function AdminCard({ eyebrow = 'WIZTECH ADMIN', title, children }) {
  return (
    <section className="admin-card" aria-labelledby="admin-title">
      <p className="admin-eyebrow">
        <span className="status-dot" aria-hidden="true" />
        {eyebrow}
      </p>
      <h1 id="admin-title">{title}</h1>
      {children}
    </section>
  )
}

function SignInForm({ supabase, requestedPath }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) setError(signInError.message)
    } catch (signInError) {
      setError(getErrorMessage(signInError, 'Unable to sign in. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminCard title="Administrator sign in">
      <p className="admin-description">
        Sign in with the administrator account invited through Supabase. Public sign-up is disabled.
      </p>
      {requestedPath !== '/admin' && (
        <p className="admin-notice" role="status">
          Sign in to continue to this protected admin page.
        </p>
      )}
      <form className="contact-form admin-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck="false"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="button button--primary form-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AdminCard>
  )
}

function AdminWorkspace({ supabase, pathname }) {
  const isSkillsPage = pathname === '/admin/skills' || pathname.startsWith('/admin/skills/')

  return (
    <div className="admin-workspace">
      <nav className="admin-module-nav" aria-label="Admin modules">
        <a href="/admin" aria-current={!isSkillsPage ? 'page' : undefined}>
          Projects
        </a>
        <a href="/admin/skills" aria-current={isSkillsPage ? 'page' : undefined}>
          Skills
        </a>
      </nav>
      {isSkillsPage
        ? <SkillsManager supabase={supabase} />
        : <ProjectsManager supabase={supabase} />}
    </div>
  )
}

function AdminAuthorization({ supabase, session, pathname }) {
  const [authorization, setAuthorization] = useState({ status: 'checking', error: '' })
  const userId = session.user.id

  useEffect(() => {
    let active = true

    supabase.rpc('is_admin')
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setAuthorization({ status: 'error', error: error.message })
        } else if (typeof data !== 'boolean') {
          setAuthorization({
            status: 'error',
            error: 'The admin authorization function returned an unexpected response.',
          })
        } else {
          setAuthorization({ status: data ? 'authorized' : 'unauthorized', error: '' })
        }
      })
      .catch((error) => {
        if (!active) return
        setAuthorization({
          status: 'error',
          error: getErrorMessage(error, 'Unable to verify administrator access.'),
        })
      })

    return () => {
      active = false
    }
  }, [supabase, userId])

  if (authorization.status === 'checking') {
    return <p className="admin-description" role="status">Verifying administrator access…</p>
  }

  if (authorization.status === 'error') {
    return (
      <AdminCard title="Could not verify access">
        <p className="admin-error" role="alert">
          The database authorization check failed. Confirm the admin migration is applied, then try again.
        </p>
        <p className="admin-technical-detail">{authorization.error}</p>
        <a className="button button--outline" href={pathname}>Retry authorization</a>
      </AdminCard>
    )
  }

  if (authorization.status === 'unauthorized') {
    return (
      <AdminCard title="Administrator access required">
        <p className="admin-description">
          This signed-in account is not authorized to manage WIZTECH content.
        </p>
        <p className="admin-technical-detail">Signed in as {session.user.email || 'an account without an email address'}.</p>
      </AdminCard>
    )
  }

  return <AdminWorkspace supabase={supabase} pathname={pathname} />
}

function AdminSession({ pathname }) {
  const supabase = getSupabaseClient()
  const [session, setSession] = useState(null)
  const [authStatus, setAuthStatus] = useState('loading')
  const [authError, setAuthError] = useState('')
  const [signOutError, setSignOutError] = useState('')
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      setAuthError('')
      setAuthStatus(nextSession ? 'authenticated' : 'unauthenticated')
    })

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          setAuthError(error.message)
          setAuthStatus('error')
          return
        }
        setSession(data.session)
        setAuthStatus(data.session ? 'authenticated' : 'unauthenticated')
      })
      .catch((error) => {
        if (!active) return
        setAuthError(getErrorMessage(error, 'Unable to restore the sign-in session.'))
        setAuthStatus('error')
      })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabase])

  async function handleSignOut() {
    setIsSigningOut(true)
    setSignOutError('')

    try {
      const { error } = await supabase.auth.signOut()
      if (error) setSignOutError(error.message)
    } catch (error) {
      setSignOutError(getErrorMessage(error, 'Unable to sign out. Please try again.'))
    } finally {
      setIsSigningOut(false)
    }
  }

  let content

  if (authStatus === 'loading') {
    content = <p className="admin-description" role="status">Checking your sign-in session…</p>
  } else if (authStatus === 'error') {
    content = (
      <AdminCard title="Unable to check your session">
        <p className="admin-error" role="alert">{authError}</p>
        <a className="button button--outline" href="/admin">Try again</a>
      </AdminCard>
    )
  } else if (!session) {
    content = <SignInForm supabase={supabase} requestedPath={pathname} />
  } else {
    content = (
      <AdminAuthorization
        key={session.user.id}
        supabase={supabase}
        session={session}
        pathname={pathname}
      />
    )
  }

  return (
    <AdminShell
      session={session}
      onSignOut={handleSignOut}
      isSigningOut={isSigningOut}
      signOutError={signOutError}
    >
      {content}
    </AdminShell>
  )
}

export function AdminApp({ pathname }) {
  const configurationError = getSupabaseConfigurationError()

  if (configurationError) {
    return (
      <AdminShell>
        <AdminCard title="Supabase configuration required">
          <p className="admin-error" role="alert">{configurationError}</p>
        </AdminCard>
      </AdminShell>
    )
  }

  return <AdminSession pathname={pathname} />
}
