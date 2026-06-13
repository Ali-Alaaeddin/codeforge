import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check if guest session exists in localStorage
    const cachedGuest = localStorage.getItem('codeforge_guest_user')
    if (cachedGuest) {
      try {
        const guestData = JSON.parse(cachedGuest)
        setUser(guestData)
        setSession({ user: guestData })
        setLoading(false)
        return
      } catch (e) {
        console.error('Failed to parse cached guest user:', e)
        localStorage.removeItem('codeforge_guest_user')
      }
    }

    // 2. If not a guest and Supabase is configured, check Supabase session
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGithub = async () => {
    if (!isSupabaseConfigured) {
      throw new Error('SUPABASE_NOT_CONFIGURED')
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
    if (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signInAsGuest = () => {
    const guestUser = {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'guest@codeforge.dev',
      user_metadata: {
        user_name: 'guest_dev',
        full_name: 'Guest Developer',
        avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4'
      }
    }
    setUser(guestUser)
    setSession({ user: guestUser })
    localStorage.setItem('codeforge_guest_user', JSON.stringify(guestUser))
  }

  const signOut = async () => {
    localStorage.removeItem('codeforge_guest_user')
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut()
      } catch (e) {
        console.error("Error signing out from Supabase:", e)
      }
    }
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGithub, signInAsGuest, signOut, isSupabaseConfigured }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
