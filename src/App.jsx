import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Navbar from './components/Navbar'
import AuthModal from './components/AuthModal'
import LandingPage from './pages/LandingPage'
import StorePage from './pages/StorePage'
import CalculatorPage from './pages/CalculatorPage'

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar onOpenAuth={() => setAuthOpen(true)} />
        {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
        <Routes>
          <Route path="/" element={<LandingPage onOpenAuth={() => setAuthOpen(true)} />} />
          <Route path="/store" element={<StorePage onOpenAuth={() => setAuthOpen(true)} />} />
          <Route path="/calculator" element={<CalculatorPage onOpenAuth={() => setAuthOpen(true)} />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
