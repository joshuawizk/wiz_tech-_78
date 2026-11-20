import { useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const links = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Skills', '#skills'],
  ['Projects', '#projects'],
  ['Experience', '#experience'],
  ['Blog', '#blog'],
  ['Contact', '#contact'],
]

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="wordmark" href="#home" onClick={closeMenu} aria-label="WIZTECH home">
          W<span>/</span>T<span className="wordmark__dot">.</span>
        </a>
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div
          className={`nav-content${menuOpen ? ' nav-content--open' : ''}`}
          id="primary-navigation"
        >
          <div className="nav-links">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={closeMenu}>{label}</a>
            ))}
          </div>
          <a className="button button--small button--outline nav-cta" href="#contact" onClick={closeMenu}>
            Let&apos;s talk <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </nav>
    </header>
  )
}
