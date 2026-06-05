import { useEffect, useRef } from 'react'
import '../styles/Workflow.css'

const steps = [
  {
    num: '01',
    command: 'forge review create --branch feature/auth-refactor',
    title: 'Open a review.',
    description: 'Push your branch. CodeForge picks up the diff, assigns reviewers based on code ownership, and sets up the review context automatically.',
  },
  {
    num: '02',
    command: 'forge review status --watch',
    title: 'Review with context.',
    description: 'Reviewers see the full picture — related PRs, test results, deployment risk. Comments thread inline, not in Slack.',
  },
  {
    num: '03',
    command: 'forge review approve --merge-when-ready',
    title: 'Approve and ship.',
    description: 'When all checks pass and reviewers sign off, CodeForge merges. No manual merge buttons. No "did anyone approve this?" in standup.',
  },
]

export default function Workflow() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.15 }
    )
    const items = ref.current?.querySelectorAll('.workflow-step')
    items?.forEach((el) => observer.observe(el))
    return () => items?.forEach((el) => observer.unobserve(el))
  }, [])

  return (
    <section className="workflow" id="workflow" ref={ref}>
      <div className="container">
        <div className="workflow-header">
          <span className="section-label mono text-tertiary">// How it works</span>
          <h2 className="section-title">Three commands. Zero friction.</h2>
          <p className="section-subtitle text-secondary">
            CodeForge integrates into your existing Git workflow.
            No migrations. No new mental models. Just better reviews.
          </p>
        </div>

        <div className="workflow-steps">
          {steps.map((step, i) => (
            <div key={step.num} className="workflow-step" style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="workflow-step-header">
                <span className="workflow-num mono text-accent">{step.num}</span>
                <div className="workflow-command-bar">
                  <span className="workflow-prompt mono text-muted">$</span>
                  <code className="workflow-command mono">{step.command}</code>
                </div>
              </div>
              <div className="workflow-step-body">
                <h3 className="workflow-step-title">{step.title}</h3>
                <p className="workflow-step-desc text-secondary">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
