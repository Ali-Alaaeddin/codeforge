import { Link } from 'react-router-dom'
import '../styles/CTA.css'

export default function CTA() {
  return (
    <section className="cta-section" id="cta-section">
      <div className="container">
        <div className="cta-box">
          <div className="cta-content">
            <div className="cta-terminal">
              <span className="mono text-muted">$</span>
              <span className="mono cta-command">npx create-codeforge@latest</span>
              <span className="cta-cursor"></span>
            </div>
            <h2 className="cta-title">
              Stop losing context.<br />
              Start reviewing code.
            </h2>
            <p className="cta-subtitle text-secondary">
              Free for teams up to 5 engineers. No credit card required.<br />
              Set up takes less time than your last code review.
            </p>
            <div className="cta-actions">
              <Link to="/login" className="btn-primary btn-lg" id="cta-primary">
                Start Reviewing Code
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </Link>
              <a href="#contact" className="btn-secondary btn-lg" id="cta-secondary">
                Talk to an engineer
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
