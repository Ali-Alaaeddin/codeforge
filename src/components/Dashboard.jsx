import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { getMockRepos, connectMockRepo, disconnectMockRepo, getMockPRs } from '../lib/mockData'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [repos, setRepos] = useState([])
  const [activeRepoId, setActiveRepoId] = useState(null)
  const [prs, setPrs] = useState([])
  const [newRepoName, setNewRepoName] = useState('')
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const displayName = user?.user_metadata?.user_name || user?.user_metadata?.full_name || user?.email || 'User'
  const avatarUrl = user?.user_metadata?.avatar_url

  // Load repositories on mount
  useEffect(() => {
    loadRepos()
  }, [])

  // Load PRs when active repository changes
  useEffect(() => {
    if (activeRepoId) {
      const repoPrs = getMockPRs(activeRepoId)
      setPrs(repoPrs)
    } else {
      setPrs([])
    }
  }, [activeRepoId])

  const loadRepos = () => {
    const list = getMockRepos()
    setRepos(list)
    if (list.length > 0) {
      // Keep active repo if it still exists, otherwise set first one
      if (!activeRepoId || !list.find(r => r.id === activeRepoId)) {
        setActiveRepoId(list[0].id)
      }
    } else {
      setActiveRepoId(null)
    }
  }

  const handleConnectRepo = (nameToConnect) => {
    const targetName = nameToConnect || newRepoName
    if (!targetName.trim()) {
      setErrorMessage('Please enter a repository name.')
      return
    }

    // Must be in organization/repository format
    if (!targetName.includes('/')) {
      setErrorMessage('Format must be organization/repository (e.g. facebook/react).')
      return
    }

    const newRepo = connectMockRepo(targetName)
    if (newRepo) {
      setNewRepoName('')
      setErrorMessage('')
      setShowConnectModal(false)
      loadRepos()
      setActiveRepoId(newRepo.id)
    }
  }

  const handleDisconnectRepo = (e, repoId) => {
    e.stopPropagation()
    e.preventDefault()
    if (confirm('Are you sure you want to disconnect this repository? All associated pull request checklists and reviews will be removed.')) {
      disconnectMockRepo(repoId)
      loadRepos()
    }
  }

  // Calculate checklist progress for a PR
  const getPRChecklistProgress = (pr) => {
    let totalItems = 0
    let checkedItems = 0
    
    if (pr.checklists && pr.checklists.length > 0) {
      pr.checklists.forEach(chk => {
        if (chk.items && chk.items.length > 0) {
          totalItems += chk.items.length
          checkedItems += chk.items.filter(item => item.checked).length
        }
      })
    }
    
    return { total: totalItems, checked: checkedItems, percent: totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0 }
  }

  return (
    <div className="dashboard-container">
      {/* Top Navigation */}
      <header className="dashboard-header">
        <div className="container dashboard-header-inner">
          <Link to="/" className="dashboard-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M8 8L12 12L8 16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="square" />
              <line x1="14" y1="16" x2="18" y2="16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
            <span className="mono">CodeForge</span>
          </Link>
          
          <div className="dashboard-user">
            <div className="user-profile-info">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="dashboard-avatar" />
              ) : (
                <div className="dashboard-avatar-placeholder mono">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="mono text-secondary">{displayName}</span>
            </div>
            <button onClick={signOut} className="btn-secondary btn-sm">Sign out</button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="dashboard-layout container">
        {/* Left Sidebar - Repositories */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <h3 className="mono text-tertiary text-xs uppercase-title">Connected Repositories</h3>
            <button 
              onClick={() => setShowConnectModal(true)} 
              className="btn-add-repo"
              title="Connect Repository"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Connect</span>
            </button>
          </div>

          <div className="repos-list">
            {repos.length === 0 ? (
              <p className="no-repos-text text-tertiary mono text-xs">No repositories connected.</p>
            ) : (
              repos.map(repo => (
                <div 
                  key={repo.id}
                  className={`repo-item ${activeRepoId === repo.id ? 'active' : ''}`}
                  onClick={() => setActiveRepoId(repo.id)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="repo-icon">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className="repo-name truncate mono">{repo.name}</span>
                  <button 
                    onClick={(e) => handleDisconnectRepo(e, repo.id)} 
                    className="btn-disconnect-repo" 
                    title="Disconnect Repo"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Work Area - Pull Requests */}
        <main className="dashboard-main">
          {activeRepoId ? (
            <div className="pr-workspace">
              <div className="dashboard-top">
                <div className="dashboard-top-info">
                  <span className="mono text-tertiary text-xs">Repository</span>
                  <h1 className="dashboard-title mono">
                    {repos.find(r => r.id === activeRepoId)?.name}
                  </h1>
                </div>
              </div>

              <div className="prs-section">
                <h3 className="section-title mono text-secondary text-sm">Active Pull Requests ({prs.length})</h3>
                
                {prs.length === 0 ? (
                  <div className="dashboard-empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="empty-icon text-muted">
                      <path d="M12 2L20 7L12 12L4 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M4 12L12 17L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M4 17L12 22L20 17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                    <h2 className="empty-title">No pull requests in this repo</h2>
                    <p className="empty-subtitle text-secondary">
                      Create a pull request on GitHub to trigger AI checklists and start reviews.
                    </p>
                  </div>
                ) : (
                  <div className="prs-list">
                    {prs.map(pr => {
                      const progress = getPRChecklistProgress(pr)
                      return (
                        <Link 
                          to={`/dashboard/pulls/${pr.id}`} 
                          key={pr.id} 
                          className="pr-card"
                        >
                          <div className="pr-card-header">
                            <div className="pr-number-title">
                              <span className="pr-number mono">#{pr.number}</span>
                              <h4 className="pr-title">{pr.title}</h4>
                            </div>
                            <span className={`status-badge status-${pr.status} mono`}>
                              {pr.status === 'changes_requested' ? 'changes requested' : pr.status}
                            </span>
                          </div>

                          <div className="pr-card-meta">
                            <div className="pr-author">
                              {pr.author.avatar_url && (
                                <img src={pr.author.avatar_url} alt="" className="pr-author-avatar" />
                              )}
                              <span className="mono text-secondary text-xs">{pr.author.github_username}</span>
                            </div>
                            <div className="pr-branches mono text-tertiary text-xs">
                              <span>{pr.source_branch}</span>
                              <span className="arrow">→</span>
                              <span>{pr.target_branch}</span>
                            </div>
                            <div className="pr-time text-tertiary text-xs">
                              {new Date(pr.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </div>
                          </div>

                          {progress.total > 0 && (
                            <div className="pr-checklist-progress">
                              <div className="progress-label mono text-tertiary text-xs">
                                <span>AI Checklist Review</span>
                                <span>{progress.checked}/{progress.total} checked ({progress.percent}%)</span>
                              </div>
                              <div className="progress-bar-container">
                                <div 
                                  className="progress-bar-fill" 
                                  style={{ width: `${progress.percent}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* No repositories connected - Empty state */
            <div className="dashboard-workspace-empty">
              <div className="connect-repo-focus">
                <div className="focus-icon-circle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </div>
                <h2>Connect a repository to start review</h2>
                <p className="text-secondary max-width-p">
                  Enter your GitHub repository name below to generate automated AI checklists, inspect code diffs, and perform pull request reviews live.
                </p>

                <div className="connect-form-inline">
                  <input 
                    type="text" 
                    placeholder="e.g. Ali-Alaaeddin/codeforge"
                    value={newRepoName}
                    onChange={(e) => setNewRepoName(e.target.value)}
                    className="mono input-connect"
                    onKeyDown={(e) => e.key === 'Enter' && handleConnectRepo()}
                  />
                  <button onClick={() => handleConnectRepo()} className="btn-primary">Connect Repository</button>
                </div>
                {errorMessage && <p className="connect-error mono text-xs">{errorMessage}</p>}

                <div className="quick-connect-templates">
                  <span className="mono text-tertiary text-xs">Quick Start Templates:</span>
                  <div className="template-buttons">
                    <button onClick={() => handleConnectRepo('Ali-Alaaeddin/codeforge')} className="btn-secondary btn-sm mono">
                      Ali-Alaaeddin/codeforge
                    </button>
                    <button onClick={() => handleConnectRepo('facebook/react')} className="btn-secondary btn-sm mono">
                      facebook/react
                    </button>
                    <button onClick={() => handleConnectRepo('vercel/next.js')} className="btn-secondary btn-sm mono">
                      vercel/next.js
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Connect Modal Overlay */}
      {showConnectModal && (
        <div className="modal-overlay" onClick={() => setShowConnectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="mono">Connect New Repository</h3>
              <button className="modal-close" onClick={() => setShowConnectModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="text-secondary text-sm">
                Import any public GitHub repository. This will automatically scan open pull requests, generate interactive review checklists, and load files.
              </p>
              
              <div className="form-group">
                <label className="mono text-xs text-tertiary">Repository Path</label>
                <input 
                  type="text" 
                  placeholder="e.g. organization/repository"
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  className="mono modal-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleConnectRepo()}
                  autoFocus
                />
              </div>
              {errorMessage && <p className="connect-error mono text-xs">{errorMessage}</p>}

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowConnectModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={() => handleConnectRepo()}>Connect</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
