import { ArrowUpRight } from 'lucide-react'

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="site-footer">
      <a className="wordmark" href="#home" aria-label="WIZTECH, back to top">
        W<span>/</span>T<span className="wordmark__dot">.</span>
      </a>
      <p>Building digital experiences. Turning ideas into technology.</p>
      <a className="footer-top" href="#home">
        Back to top <ArrowUpRight size={14} aria-hidden="true" />
      </a>
      <span className="footer-credit">© {currentYear} WIZTECH</span>
    </footer>
  )
}
