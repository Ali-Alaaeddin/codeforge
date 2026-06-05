import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Hero.css'

const diffLines = [
  { type: 'context', num: [142, 142], code: '  async function submitReview(pr) {' },
  { type: 'context', num: [143, 143], code: '    const checks = await runChecks(pr);' },
  { type: 'delete',  num: [144, ''],  code: '    if (checks.passed) {' },
  { type: 'delete',  num: [145, ''],  code: '      return approve(pr);' },
  { type: 'delete',  num: [146, ''],  code: '    }' },
  { type: 'add',     num: ['', 144],  code: '    if (!checks.passed) {' },
  { type: 'add',     num: ['', 145],  code: '      return requestChanges(pr, checks.failures);' },
  { type: 'add',     num: ['', 146],  code: '    }' },
  { type: 'add',     num: ['', 147],  code: '' },
  { type: 'add',     num: ['', 148],  code: '    await notifyAuthor(pr.author, {' },
  { type: 'add',     num: ['', 149],  code: '      status: "approved",' },
  { type: 'add',     num: ['', 150],  code: '      reviewedBy: currentUser.handle' },
  { type: 'add',     num: ['', 151],  code: '    });' },
  { type: 'context', num: [147, 152], code: '    return approve(pr);' },
  { type: 'context', num: [148, 153], code: '  }' },
]

const reviewComment = {
  author: 'sarah.chen',
  time: '2 min ago',
  line: 148,
  text: 'Nice catch. We should also log the notification payload for debugging — can you add that before we merge?',
}

export default function Hero() {
  const diffRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const el = diffRef.current
    if (el) observer.observe(el)

    return () => { if (el) observer.unobserve(el) }
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="container hero-inner">
        <div className="hero-content">
          <div className="hero-badge animate-fade-in-up">
            <span className="mono text-tertiary">v2.4 — now with inline threads</span>
          </div>

          <h1 className="hero-title animate-fade-in-up delay-1">
            Code review that<br />
            <span className="text-accent">ships better software.</span>
          </h1>

          <p className="hero-subtitle animate-fade-in-up delay-2">
            CodeForge gives your team structured reviews, async approvals,
            and the context to make every pull request count. No more
            drive-by LGTMs. No more merge-and-pray.
          </p>

          <div className="hero-actions animate-fade-in-up delay-3">
            <Link to="/login" className="btn-primary btn-lg" id="hero-cta">
              Start Reviewing Code
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </Link>
            <a href="#demo" className="btn-secondary btn-lg" id="hero-secondary-cta">
              Watch a 2-min demo
            </a>
          </div>

          <div className="hero-proof animate-fade-in-up delay-4">
            <div className="hero-stat">
              <span className="hero-stat-value mono">2,400+</span>
              <span className="hero-stat-label">engineering teams</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-value mono">1.2M</span>
              <span className="hero-stat-label">reviews this month</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="hero-stat-value mono">40%</span>
              <span className="hero-stat-label">faster merge times</span>
            </div>
          </div>
        </div>

        <div className="hero-visual animate-fade-in delay-3" ref={diffRef}>
          <div className="diff-window">
            <div className="diff-toolbar">
              <div className="diff-tab active">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="12" height="12" stroke="currentColor" strokeWidth="1" fill="none" rx="0" />
                  <line x1="4" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1" />
                  <line x1="4" y1="7" x2="8" y2="7" stroke="currentColor" strokeWidth="1" />
                  <line x1="4" y1="9" x2="10" y2="9" stroke="currentColor" strokeWidth="1" />
                </svg>
                <span>review/submit.ts</span>
              </div>
              <div className="diff-tab-meta">
                <span className="diff-additions mono">+8</span>
                <span className="diff-deletions mono">-3</span>
              </div>
            </div>

            <div className="diff-body">
              {diffLines.map((line, i) => (
                <div key={i} className={`diff-line diff-${line.type}`} style={{ animationDelay: `${0.8 + i * 0.05}s` }}>
                  <span className="diff-line-num mono">{line.num[0]}</span>
                  <span className="diff-line-num mono">{line.num[1]}</span>
                  <span className="diff-line-marker mono">
                    {line.type === 'add' ? '+' : line.type === 'delete' ? '-' : ' '}
                  </span>
                  <span className="diff-line-code mono">{line.code}</span>
                </div>
              ))}
            </div>

            <div className="diff-comment" style={{ animationDelay: '1.8s' }}>
              <div className="diff-comment-header">
                <div className="diff-comment-avatar">{reviewComment.author[0].toUpperCase()}</div>
                <span className="diff-comment-author mono">{reviewComment.author}</span>
                <span className="diff-comment-time">{reviewComment.time}</span>
                <span className="diff-comment-line mono">L{reviewComment.line}</span>
              </div>
              <p className="diff-comment-text">{reviewComment.text}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-border-bottom"></div>
    </section>
  )
}
