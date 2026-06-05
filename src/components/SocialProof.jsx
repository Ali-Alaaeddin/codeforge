import '../styles/SocialProof.css'

const testimonials = [
  {
    id: 'testimonial-1',
    quote: "We moved from GitHub PRs to CodeForge and cut our review cycle from 2 days to 4 hours. The structured checklists alone saved us from three production incidents last quarter.",
    author: 'Tomás Vega',
    role: 'Staff Engineer',
    company: 'Lattice',
  },
  {
    id: 'testimonial-2',
    quote: "As an eng manager, I finally have visibility into where reviews stall without micromanaging anyone. The async workflow means our distributed team actually ships on schedule.",
    author: 'Priya Nair',
    role: 'Engineering Manager',
    company: 'Ramp',
  },
  {
    id: 'testimonial-3',
    quote: "Most tools try to replace Git. CodeForge just makes the review part not suck. It took our team 20 minutes to onboard — that never happens.",
    author: 'Jake Morrison',
    role: 'CTO',
    company: 'Gather',
  },
]

const logos = ['Vercel', 'Linear', 'Notion', 'Ramp', 'Lattice', 'Retool']

export default function SocialProof() {
  return (
    <section className="social-proof" id="social-proof">
      <div className="container">
        <div className="logos-bar">
          <span className="logos-label mono text-muted">Trusted by engineering teams at</span>
          <div className="logos-list">
            {logos.map((logo) => (
              <span key={logo} className="logo-item mono">{logo}</span>
            ))}
          </div>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card" id={t.id}>
              <blockquote className="testimonial-quote">"{t.quote}"</blockquote>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.author[0]}</div>
                <div className="testimonial-info">
                  <span className="testimonial-name">{t.author}</span>
                  <span className="testimonial-role text-tertiary">{t.role} · {t.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
