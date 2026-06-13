import { Link } from 'react-router-dom'
import '../styles/Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar" id="navbar">
      <div className="container navbar-inner">
        <a href="/" className="navbar-logo" id="navbar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M8 8L12 12L8 16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="square" />
            <line x1="14" y1="16" x2="18" y2="16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
          <span className="mono">CodeForge</span>
        </a>

        <nav className="navbar-nav" id="navbar-nav">
          <a href="/#features" className="navbar-link">Features</a>
          <a href="/#workflow" className="navbar-link">Workflow</a>
          <Link to="/docs" className="navbar-link">Docs</Link>
        </nav>

        <div className="navbar-actions">
          <Link to="/login" className="navbar-link" id="signin-link">Sign in</Link>
          <Link to="/login" className="btn-primary btn-sm" id="navbar-cta">
            Start Reviewing Code
          </Link>
        </div>

        <button className="navbar-mobile-toggle" id="navbar-mobile-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}
