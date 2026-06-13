import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { 
  getMockPRDetails, 
  toggleMockChecklistItem, 
  addMockComment, 
  updateMockPRStatus, 
  triggerMockAISimulation 
} from '../lib/mockData'
import '../styles/PullRequestDetails.css'

export default function PullRequestDetails() {
  const { prId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [pr, setPr] = useState(null)
  const [activeTab, setActiveTab] = useState('checklist') // checklist, files, conversation
  const [generalComment, setGeneralComment] = useState('')
  const [expandedFileIndex, setExpandedFileIndex] = useState(0)
  
  // State for inline comments
  const [activeCommentLine, setActiveCommentLine] = useState({ fileIndex: null, lineNum: null })
  const [inlineCommentText, setInlineCommentText] = useState('')
  const [isSimulatingBot, setIsSimulatingBot] = useState(false)

  useEffect(() => {
    loadPRDetails()
  }, [prId])

  const loadPRDetails = () => {
    const details = getMockPRDetails(prId)
    if (!details) {
      // Redirect to dashboard if PR not found
      navigate('/dashboard')
      return
    }
    setPr(details)
  }

  if (!pr) {
    return <div className="loading mono container">Loading pull request details...</div>
  }

  const handleToggleCheck = (checklistId, itemIndex) => {
    const updatedPr = toggleMockChecklistItem(pr.id, checklistId, itemIndex)
    if (updatedPr) {
      setPr({ ...updatedPr })
    }
  }

  const handlePostGeneralComment = () => {
    if (!generalComment.trim()) return
    const updatedPr = addMockComment(pr.id, null, null, generalComment)
    if (updatedPr) {
      setPr({ ...updatedPr })
      setGeneralComment('')
    }
  }

  const handleOpenInlineComment = (fileIndex, lineNum) => {
    setActiveCommentLine({ fileIndex, lineNum })
    setInlineCommentText('')
  }

  const handlePostInlineComment = (fileName) => {
    if (!inlineCommentText.trim()) return
    const updatedPr = addMockComment(pr.id, fileName, activeCommentLine.lineNum, inlineCommentText)
    if (updatedPr) {
      setPr({ ...updatedPr })
      setActiveCommentLine({ fileIndex: null, lineNum: null })
      setInlineCommentText('')
    }
  }

  const handleUpdateStatus = (status) => {
    const updatedPr = updateMockPRStatus(pr.id, status)
    if (updatedPr) {
      setPr({ ...updatedPr })
    }
  }

  const handleTriggerAISimulation = () => {
    setIsSimulatingBot(true)
    triggerMockAISimulation(pr.id, () => {
      loadPRDetails()
      setIsSimulatingBot(false)
      // Switch tab to conversation to show the bot's post
      setActiveTab('conversation')
    })
  }

  // Helper to parse file diff into lines with types
  const parseDiffLines = (diffString) => {
    if (!diffString) return []
    const lines = diffString.split('\n')
    let leftLineNum = 0
    let rightLineNum = 0

    return lines.map((line, index) => {
      let type = 'normal'
      
      if (line.startsWith('@@')) {
        type = 'meta'
        // Parse starting line numbers e.g. @@ -12,4 +12,8 @@
        const match = line.match(/@@\s+-(\d+),?\d*\s+\+(\d+),?\d*\s+@@/)
        if (match) {
          leftLineNum = parseInt(match[1]) - 1
          rightLineNum = parseInt(match[2]) - 1
        }
      } else if (line.startsWith('+') && !line.startsWith('+++')) {
        type = 'addition'
        rightLineNum++
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        type = 'deletion'
        leftLineNum++
      } else {
        leftLineNum++
        rightLineNum++
      }

      return {
        id: index,
        content: line,
        type,
        leftLineNum: type === 'addition' ? '' : leftLineNum,
        rightLineNum: type === 'deletion' ? '' : rightLineNum
      }
    })
  }

  // Calculate total and checked checklist items
  const getPRStats = () => {
    let total = 0
    let checked = 0
    pr.checklists.forEach(c => {
      total += c.items.length
      checked += c.items.filter(i => i.checked).length
    })
    return { total, checked, percent: total > 0 ? Math.round((checked / total) * 100) : 0 }
  }

  const stats = getPRStats()
  const totalCommentsCount = pr.comments.length + (pr.inlineComments ? pr.inlineComments.length : 0)

  return (
    <div className="pr-detail-container">
      {/* Top Header */}
      <header className="pr-detail-header">
        <div className="container header-inner">
          <div className="header-left">
            <Link to="/dashboard" className="btn-back mono text-xs text-tertiary">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Back to Dashboard</span>
            </Link>
            
            <div className="title-section">
              <div className="pr-badge-num">
                <span className="pr-number mono">#{pr.number}</span>
                <span className={`status-badge status-${pr.status} mono`}>
                  {pr.status === 'changes_requested' ? 'changes requested' : pr.status}
                </span>
              </div>
              <h1 className="pr-title">{pr.title}</h1>
            </div>
            
            <div className="pr-meta-info mono text-tertiary text-xs">
              <div className="pr-meta-author">
                {pr.author.avatar_url && <img src={pr.author.avatar_url} alt="" className="meta-avatar" />}
                <span className="text-secondary">{pr.author.github_username}</span>
              </div>
              <span>•</span>
              <div className="branch-label">
                <span className="branch-name">{pr.source_branch}</span>
                <span className="arrow">into</span>
                <span className="branch-name">{pr.target_branch}</span>
              </div>
              <span>•</span>
              <span>opened {new Date(pr.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action box */}
          <div className="header-right">
            <div className="review-actions">
              <h4 className="mono text-xs uppercase-title text-tertiary">Submit Review</h4>
              <div className="action-buttons">
                <button 
                  onClick={() => handleUpdateStatus('approved')}
                  className={`btn-secondary btn-sm mono ${pr.status === 'approved' ? 'active-approve' : ''}`}
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleUpdateStatus('changes_requested')}
                  className={`btn-secondary btn-sm mono ${pr.status === 'changes_requested' ? 'active-reject' : ''}`}
                >
                  Request Changes
                </button>
                <button 
                  onClick={handleTriggerAISimulation}
                  className="btn-primary btn-sm mono btn-trigger-ai"
                  disabled={isSimulatingBot}
                >
                  {isSimulatingBot ? 'AI Reviewing...' : 'Run AI Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Menu */}
      <div className="pr-detail-tabs border-subtle">
        <div className="container tabs-inner">
          <button 
            className={`tab-btn mono ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tab-icon">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            <span>AI Checklist ({stats.checked}/{stats.total})</span>
          </button>
          
          <button 
            className={`tab-btn mono ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tab-icon">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>Files Changed ({pr.files.length})</span>
          </button>
          
          <button 
            className={`tab-btn mono ${activeTab === 'conversation' ? 'active' : ''}`}
            onClick={() => setActiveTab('conversation')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tab-icon">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Conversation ({totalCommentsCount})</span>
          </button>
        </div>
      </div>

      {/* Main body of tabs */}
      <main className="pr-detail-main container">
        {/* TAB 1: CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="tab-pane-checklist animate-fade-in">
            <div className="checklist-layout">
              {/* Left Column: Checklists */}
              <div className="checklists-group">
                {pr.checklists.map(chk => (
                  <div key={chk.id} className="checklist-card">
                    <h3 className="checklist-rule-title mono text-sm">{chk.rule_name}</h3>
                    <div className="checklist-items">
                      {chk.items.map((item, idx) => (
                        <label key={idx} className={`checklist-item-label ${item.checked ? 'item-checked' : ''}`}>
                          <input 
                            type="checkbox" 
                            checked={item.checked}
                            onChange={() => handleToggleCheck(chk.id, idx)}
                            className="checklist-checkbox"
                          />
                          <span className="checklist-item-text">{item.text}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: AI Summary panel */}
              <aside className="checklist-summary-panel">
                <div className="panel-card">
                  <h4 className="mono text-xs text-tertiary uppercase-title">AI Checklist Integrity</h4>
                  <div className="stat-row">
                    <span className="mono text-2xl font-bold">{stats.percent}%</span>
                    <span className="text-secondary text-sm">compliance score</span>
                  </div>
                  
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${stats.percent}%` }}></div>
                  </div>
                  
                  <div className="stats-breakdown text-secondary text-xs mono">
                    <span>{stats.checked} of {stats.total} checks complete</span>
                  </div>

                  <hr className="divider-line" />
                  
                  <p className="text-tertiary text-xs leading-relaxed">
                    CodeForge generates customized automated checks based on the Git diff file extensions and patterns. Resolving all checklist items ensures a robust codebase and minimal review latency.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* TAB 2: FILES CHANGED */}
        {activeTab === 'files' && (
          <div className="tab-pane-files animate-fade-in">
            <div className="files-layout">
              {/* Left Column: File Tree list */}
              <aside className="files-sidebar">
                <h4 className="mono text-xs text-tertiary uppercase-title border-bottom-subtle">Changed Files</h4>
                <div className="files-tree-list">
                  {pr.files.map((file, idx) => (
                    <div 
                      key={idx}
                      className={`file-tree-item mono text-xs ${expandedFileIndex === idx ? 'active' : ''}`}
                      onClick={() => setExpandedFileIndex(idx)}
                    >
                      <span className="file-diff-stats text-xs">
                        <span className="text-green">+{file.additions}</span>
                      </span>
                      <span className="file-path truncate" title={file.path}>{file.path.split('/').pop()}</span>
                    </div>
                  ))}
                </div>
              </aside>

              {/* Right Column: Code Diff display */}
              <div className="files-diff-viewer">
                {pr.files.map((file, fileIdx) => {
                  if (fileIdx !== expandedFileIndex) return null
                  const parsedLines = parseDiffLines(file.diff)
                  
                  return (
                    <div key={fileIdx} className="diff-file-wrapper">
                      <div className="diff-file-header">
                        <span className="file-header-path mono text-sm">{file.path}</span>
                        <div className="file-header-counts mono text-xs">
                          <span className="text-green">+{file.additions} additions</span>
                        </div>
                      </div>

                      <div className="diff-code-table mono text-sm">
                        {parsedLines.map(line => {
                          // Find inline comments matching this file and line
                          const matchingComments = (pr.inlineComments || []).filter(
                            c => c.filePath === file.path && c.lineNumber === line.rightLineNum
                          )

                          return (
                            <div key={line.id} className="diff-line-container">
                              <div className={`diff-line-row diff-line-${line.type}`}>
                                <div className="line-num left-line-num">{line.leftLineNum}</div>
                                <div className="line-num right-line-num">{line.rightLineNum}</div>
                                
                                <div 
                                  className="line-add-comment-btn"
                                  onClick={() => handleOpenInlineComment(fileIdx, line.rightLineNum)}
                                  title="Add comment"
                                >
                                  +
                                </div>
                                
                                <div className="line-content">{line.content}</div>
                              </div>

                              {/* Inline Comments Stream */}
                              {matchingComments.map(comment => (
                                <div key={comment.id} className="inline-comment-card">
                                  <div className="comment-header">
                                    <div className="comment-author">
                                      {comment.author.avatar_url && (
                                        <img src={comment.author.avatar_url} alt="" className="comment-avatar" />
                                      )}
                                      <span className="comment-author-name mono text-xs">{comment.author.github_username}</span>
                                    </div>
                                    <span className="comment-date text-tertiary text-xs">
                                      {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <div className="comment-body">
                                    <p>{comment.body}</p>
                                  </div>
                                </div>
                              ))}

                              {/* Inline Comment Form */}
                              {activeCommentLine.fileIndex === fileIdx && activeCommentLine.lineNum === line.rightLineNum && (
                                <div className="inline-comment-form">
                                  <textarea
                                    placeholder="Write a code review comment..."
                                    value={inlineCommentText}
                                    onChange={(e) => setInlineCommentText(e.target.value)}
                                    rows="2"
                                    className="inline-comment-textarea"
                                    autoFocus
                                  />
                                  <div className="inline-comment-actions">
                                    <button 
                                      className="btn-secondary btn-sm mono" 
                                      onClick={() => setActiveCommentLine({ fileIndex: null, lineNum: null })}
                                    >
                                      Cancel
                                    </button>
                                    <button 
                                      className="btn-primary btn-sm mono"
                                      onClick={() => handlePostInlineComment(file.path)}
                                    >
                                      Post Comment
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONVERSATION */}
        {activeTab === 'conversation' && (
          <div className="tab-pane-conversation animate-fade-in">
            <div className="conversation-layout">
              {/* Stream of Events & Comments */}
              <div className="timeline-stream">
                <div className="timeline-event">
                  <div className="timeline-icon">🚀</div>
                  <div className="timeline-event-content text-secondary text-sm">
                    <strong className="text-primary">{pr.author.github_username}</strong> opened this pull request and requested review.
                  </div>
                </div>

                {/* Render General Comments */}
                {pr.comments.map(cmt => (
                  <div key={cmt.id} className="comment-thread-card">
                    <div className="comment-header">
                      <div className="comment-author">
                        {cmt.author.avatar_url && (
                          <img src={cmt.author.avatar_url} alt="" className="comment-avatar" />
                        )}
                        <span className="comment-author-name mono text-sm">{cmt.author.github_username}</span>
                      </div>
                      <span className="comment-date text-tertiary text-xs">
                        {new Date(cmt.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="comment-body">
                      {cmt.body.startsWith('🤖') ? (
                        <div className="ai-bot-styled-body">{cmt.body}</div>
                      ) : (
                        <p>{cmt.body}</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* General Comment Form */}
                <div className="general-comment-form">
                  <h3 className="mono text-sm text-secondary">Leave a comment</h3>
                  <textarea
                    placeholder="Leave a general comment on this pull request..."
                    value={generalComment}
                    onChange={(e) => setGeneralComment(e.target.value)}
                    rows="4"
                    className="general-comment-textarea"
                  />
                  <div className="general-comment-actions">
                    <button 
                      onClick={handlePostGeneralComment} 
                      className="btn-primary btn-sm mono"
                      disabled={!generalComment.trim()}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
