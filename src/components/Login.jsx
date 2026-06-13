import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import '../styles/Login.css'

export default function Login() {
  const { user, signInWithGithub, signInAsGuest, isSupabaseConfigured } = useAuth()
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setErrorMsg('')
    setIsLoading(true)
    try {
      await signInWithGithub()
    } catch (err) {
      if (err.message === 'SUPABASE_NOT_CONFIGURED') {
        setErrorMsg(
          'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables, then redeploy.'
        )
      } else {
        setErrorMsg(`Sign-in failed: ${err.message}`)
      }
      setIsLoading(false)
    }
  }

  const handleGuestLogin = () => {
    setIsLoading(true)
    // Small timeout for nice visual transition effect
    setTimeout(() => {
      signInAsGuest()
      setIsLoading(false)
    }, 600)
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <Link to="/" className="login-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M8 8L12 12L8 16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="square" />
            <line x1="14" y1="16" x2="18" y2="16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="square" />
          </svg>
          <span className="mono">CodeForge</span>
        </Link>
        
        <h1 className="login-title">Sign in to CodeForge</h1>
        <p className="login-subtitle text-secondary">Connect your GitHub account to start reviewing code.</p>

        {!isSupabaseConfigured && (
          <div className="login-warning">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L15 14H1L8 1Z" stroke="var(--accent)" strokeWidth="1.2" fill="none"/>
              <line x1="8" y1="6" x2="8" y2="10" stroke="var(--accent)" strokeWidth="1.2"/>
              <circle cx="8" cy="12" r="0.7" fill="var(--accent)"/>
            </svg>
            <span className="mono">Supabase not configured — click <strong>Explore Demo</strong> below to try all features locally!</span>
          </div>
        )}

        <div className="login-actions">
          <button 
            onClick={handleLogin} 
            className="btn-github mono"
            disabled={isLoading || !isSupabaseConfigured}
            style={!isSupabaseConfigured ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {isLoading && !user ? 'Redirecting...' : 'Continue with GitHub'}
          </button>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button 
            onClick={handleGuestLogin} 
            className="btn-guest mono"
            disabled={isLoading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {isLoading && user ? 'Loading Demo...' : 'Explore Demo / Guest Mode'}
          </button>
        </div>

        {errorMsg && (
          <p className="login-error">{errorMsg}</p>
        )}

        <p className="login-footer text-tertiary">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
