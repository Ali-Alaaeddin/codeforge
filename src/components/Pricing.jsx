import '../styles/Pricing.css'

export default function Pricing() {
  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="pricing-header">
          <span className="section-label mono text-accent">// Pricing</span>
          <h2 className="section-title">Simple pricing for serious teams.</h2>
          <p className="section-subtitle text-secondary">
            Start for free, upgrade when you need advanced workflows and unlimited history.
          </p>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="pricing-tier mono">Hobby</h3>
            <div className="pricing-price">
              <span className="price-symbol">$</span>
              <span className="price-amount">0</span>
              <span className="price-period">/mo</span>
            </div>
            <p className="pricing-desc text-secondary">Perfect for open source and small indie teams.</p>
            
            <ul className="pricing-features">
              <li><span className="mono text-accent">✓</span> Up to 3 users</li>
              <li><span className="mono text-accent">✓</span> Unlimited public repos</li>
              <li><span className="mono text-accent">✓</span> 30-day review history</li>
              <li><span className="mono text-accent">✓</span> Basic checklists</li>
            </ul>
            
            <a href="#signup" className="btn-secondary btn-full">Start for free</a>
          </div>

          <div className="pricing-card popular">
            <div className="popular-badge mono">Most Popular</div>
            <h3 className="pricing-tier mono text-accent">Pro</h3>
            <div className="pricing-price">
              <span className="price-symbol">$</span>
              <span className="price-amount">12</span>
              <span className="price-period">/user/mo</span>
            </div>
            <p className="pricing-desc text-secondary">For professional engineering teams moving fast.</p>
            
            <ul className="pricing-features">
              <li><span className="mono text-accent">✓</span> Unlimited users</li>
              <li><span className="mono text-accent">✓</span> Unlimited private repos</li>
              <li><span className="mono text-accent">✓</span> Unlimited history</li>
              <li><span className="mono text-accent">✓</span> Advanced custom checklists</li>
              <li><span className="mono text-accent">✓</span> Real-time Slack notifications</li>
            </ul>
            
            <a href="#signup" className="btn-primary btn-full">Get started</a>
          </div>
        </div>
      </div>
    </section>
  )
}
