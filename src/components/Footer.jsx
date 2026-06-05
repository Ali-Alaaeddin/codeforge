import '../styles/Footer.css'

export default function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M8 8L12 12L8 16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="square" />
                <line x1="14" y1="16" x2="18" y2="16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
              <span className="mono">CodeForge</span>
            </div>
            <p className="footer-tagline text-tertiary">
              Code review for teams that ship.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title mono">Product</h4>
            <a href="#features" className="footer-link">Features</a>
            <a href="#pricing" className="footer-link">Pricing</a>
            <a href="#changelog" className="footer-link">Changelog</a>
            <a href="#integrations" className="footer-link">Integrations</a>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title mono">Resources</h4>
            <a href="#docs" className="footer-link">Documentation</a>
            <a href="#api" className="footer-link">API Reference</a>
            <a href="#blog" className="footer-link">Engineering Blog</a>
            <a href="#status" className="footer-link">System Status</a>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title mono">Company</h4>
            <a href="#about" className="footer-link">About</a>
            <a href="#careers" className="footer-link">Careers</a>
            <a href="#security" className="footer-link">Security</a>
            <a href="#privacy" className="footer-link">Privacy</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy text-muted">© 2026 CodeForge, Inc.</span>
          <div className="footer-socials">
            <a href="#github" className="footer-social-link" aria-label="GitHub">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <a href="#twitter" className="footer-social-link" aria-label="Twitter">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
