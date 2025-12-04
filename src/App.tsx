import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LandingPage } from './components/LandingPage'
import { IDVerification } from './components/IDVerification'
import { PartnerRegister } from './components/PartnerRegister'
import { PartnerLogin } from './components/PartnerLogin'
import { PartnerForgotPassword } from './components/PartnerForgotPassword'
import { PartnerResetPassword } from './components/PartnerResetPassword'
import { PartnerDashboard } from './components/PartnerDashboard'
import { PartnerVerifications } from './components/PartnerVerifications'
import { PartnerSettings } from './components/PartnerSettings'
import { PartnerRequestVerification } from './components/PartnerRequestVerification'
import { Roadmap } from './components/Roadmap'
import './styles/landing.css'
import './styles/verification.css'
import './styles/partner.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify" element={<IDVerification />} />
        <Route path="/partner/register" element={<PartnerRegister />} />
        <Route path="/partner/login" element={<PartnerLogin />} />
        <Route path="/partner/forgot-password" element={<PartnerForgotPassword />} />
        <Route path="/reset-password" element={<PartnerResetPassword />} />
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        <Route path="/partner/verifications" element={<PartnerVerifications />} />
        <Route path="/partner/request-verification" element={<PartnerRequestVerification />} />
        <Route path="/partner/settings" element={<PartnerSettings />} />
        <Route path="/roadmap" element={<Roadmap />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
