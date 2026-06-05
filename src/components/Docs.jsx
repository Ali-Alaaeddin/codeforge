import Navbar from './Navbar'
import Footer from './Footer'
import '../styles/Docs.css'

export default function Docs() {
  return (
    <>
      <Navbar />
      <div className="docs-page">
        <div className="container docs-container">
          <aside className="docs-sidebar">
            <h3 className="docs-nav-title mono">Getting Started</h3>
            <ul className="docs-nav-list">
              <li><a href="#quickstart" className="docs-nav-link active">Quickstart</a></li>
              <li><a href="#installation" className="docs-nav-link">Installation</a></li>
              <li><a href="#cli" className="docs-nav-link">CLI Reference</a></li>
            </ul>
            
            <h3 className="docs-nav-title mono mt-8">Guides</h3>
            <ul className="docs-nav-list">
              <li><a href="#checklists" className="docs-nav-link">Custom Checklists</a></li>
              <li><a href="#webhooks" className="docs-nav-link">Webhooks</a></li>
              <li><a href="#ci-cd" className="docs-nav-link">CI/CD Integration</a></li>
            </ul>
          </aside>
          
          <main className="docs-content">
            <span className="mono text-accent docs-breadcrumbs">Docs / Getting Started / Quickstart</span>
            <h1 className="docs-title">Quickstart</h1>
            <p className="docs-subtitle text-secondary">
              Learn how to integrate CodeForge into your repository in under 5 minutes.
            </p>
            
            <div className="docs-prose">
              <h2>1. Connect your repository</h2>
              <p>
                From your dashboard, click <strong>Connect Repository</strong> and authenticate with GitHub. 
                CodeForge will automatically install the necessary webhooks to listen for pull request events.
              </p>
              
              <h2>2. Create a CodeForge config file</h2>
              <p>
                In the root of your repository, create a <code>codeforge.yml</code> file. This defines your default review rules.
              </p>
              
              <div className="docs-code-block">
                <div className="docs-code-header">
                  <span className="mono">codeforge.yml</span>
                </div>
                <pre className="mono">
{`version: 1.0
rules:
  - name: "Database Schema Changes"
    condition: "files_changed: src/db/**"
    checklist:
      - "Verify no N+1 queries"
      - "Check index performance"
      - "Run backward compatibility test"`}
                </pre>
              </div>
              
              <h2>3. Open a Pull Request</h2>
              <p>
                The next time a developer opens a pull request that modifies the database schema, 
                CodeForge will automatically inject the required checklist and block the merge until 
                a designated reviewer approves it.
              </p>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}
