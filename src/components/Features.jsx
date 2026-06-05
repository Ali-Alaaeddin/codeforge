import { useEffect, useRef } from 'react'
import '../styles/Features.css'

const features = [
  {
    id: 'structured-reviews',
    label: '01',
    title: 'Structured reviews, not rubber stamps.',
    description: 'Every review has a checklist. Reviewers know what to look for. Authors know what to fix. No more vague "LGTM" approvals on 800-line PRs.',
    detail: {
      type: 'checklist',
      items: [
        { text: 'Type safety verified', checked: true },
        { text: 'Error handling covers edge cases', checked: true },
        { text: 'No N+1 queries introduced', checked: false },
        { text: 'Test coverage above threshold', checked: true },
      ]
    }
  },
  {
    id: 'async-approvals',
    label: '02',
    title: 'Async-first. No more blocking on reviews.',
    description: 'Your team works across time zones. CodeForge tracks review state across sessions, sends smart notifications, and never loses context. Reviews happen when your team is ready — not when Slack pings.',
    detail: {
      type: 'timeline',
      items: [
        { time: '09:14', user: 'alex.k', action: 'requested review', zone: 'PST' },
        { time: '14:22', user: 'sarah.c', action: 'left 3 comments', zone: 'EST' },
        { time: '18:45', user: 'alex.k', action: 'pushed fixes', zone: 'PST' },
        { time: '08:01', user: 'yuki.m', action: 'approved', zone: 'JST' },
      ]
    }
  },
  {
    id: 'eng-metrics',
    label: '03',
    title: 'Measure what matters. Ship the rest.',
    description: 'Track review turnaround, bottlenecks, and team velocity without turning engineers into data entry clerks. Real metrics from real workflows — not vanity dashboards.',
    detail: {
      type: 'metrics',
      items: [
        { label: 'Avg. review time', value: '4.2h', trend: '-23%', good: true },
        { label: 'PRs merged/week', value: '142', trend: '+18%', good: true },
        { label: 'Review bottleneck', value: 'auth-svc', trend: '', good: false },
        { label: 'First response', value: '47m', trend: '-31%', good: true },
      ]
    }
  }
]

export default function Features() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    const cards = sectionRef.current?.querySelectorAll('.feature-card')
    cards?.forEach((card) => observer.observe(card))

    return () => cards?.forEach((card) => observer.unobserve(card))
  }, [])

  return (
    <section className="features" id="features" ref={sectionRef}>
      <div className="container">
        <div className="features-header">
          <span className="section-label mono text-tertiary">// Features</span>
          <h2 className="section-title">Built for how engineers actually work.</h2>
          <p className="section-subtitle text-secondary">
            Not another project management tool wearing a code review costume.
            CodeForge is built by engineers who got tired of broken review workflows.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card" id={`feature-${feature.id}`}>
              <div className="feature-text">
                <span className="feature-label mono text-accent">{feature.label}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description text-secondary">{feature.description}</p>
              </div>

              <div className="feature-detail">
                {feature.detail.type === 'checklist' && (
                  <div className="feature-checklist">
                    {feature.detail.items.map((item, i) => (
                      <div key={i} className={`checklist-item ${item.checked ? 'checked' : 'unchecked'}`}>
                        <span className="checklist-icon mono">
                          {item.checked ? '✓' : '○'}
                        </span>
                        <span className="checklist-text mono">{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {feature.detail.type === 'timeline' && (
                  <div className="feature-timeline">
                    {feature.detail.items.map((item, i) => (
                      <div key={i} className="timeline-item">
                        <span className="timeline-time mono">{item.time}</span>
                        <div className="timeline-dot"></div>
                        <span className="timeline-user mono">{item.user}</span>
                        <span className="timeline-action">{item.action}</span>
                        <span className="timeline-zone mono text-muted">{item.zone}</span>
                      </div>
                    ))}
                  </div>
                )}

                {feature.detail.type === 'metrics' && (
                  <div className="feature-metrics">
                    {feature.detail.items.map((item, i) => (
                      <div key={i} className="metric-item">
                        <span className="metric-label">{item.label}</span>
                        <div className="metric-value-row">
                          <span className="metric-value mono">{item.value}</span>
                          {item.trend && (
                            <span className={`metric-trend mono ${item.good ? 'good' : 'bad'}`}>
                              {item.trend}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
