import { useAuth } from './AuthProvider'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const { user, signOut } = useAuth()

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="container dashboard-header-inner">
          <div className="dashboard-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M8 8L12 12L8 16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="square" />
              <line x1="14" y1="16" x2="18" y2="16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
            <span className="mono">CodeForge</span>
          </div>
          
          <div className="dashboard-user">
            <span className="mono text-secondary">{user?.email}</span>
            <button onClick={signOut} className="btn-secondary btn-sm">Sign out</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main container">
        <div className="dashboard-top">
          <h1 className="dashboard-title">Pull Requests</h1>
          <button 
            className="btn-primary" 
            onClick={() => alert("Connecting a repository requires the CodeForge GitHub App to be installed on your GitHub account. For this demo, please manually insert a repository into the Supabase database.")}
          >
            Connect Repository
          </button>
        </div>

        <div className="dashboard-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="empty-icon text-muted">
            <path d="M12 2L20 7L12 12L4 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M4 12L12 17L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M4 17L12 22L20 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          <h2 className="empty-title">No repositories connected</h2>
          <p className="empty-subtitle text-secondary">
            Connect a GitHub repository to start reviewing pull requests.
          </p>
        </div>
      </main>
    </div>
  )
}
