import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Workflow from './components/Workflow'
import SocialProof from './components/SocialProof'
import CTA from './components/CTA'
import Footer from './components/Footer'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import PullRequestDetails from './components/PullRequestDetails'
import Docs from './components/Docs'
import ProtectedRoute from './components/ProtectedRoute'

function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <SocialProof />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/pulls/:prId" 
        element={
          <ProtectedRoute>
            <PullRequestDetails />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}
