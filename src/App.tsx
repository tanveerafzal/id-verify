import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { IDVerification } from './components/IDVerification'
import { PartnerRegister } from './components/PartnerRegister'
import { PartnerLogin } from './components/PartnerLogin'
import { PartnerDashboard } from './components/PartnerDashboard'
import { PartnerVerifications } from './components/PartnerVerifications'
import { PartnerSettings } from './components/PartnerSettings'
import './styles/verification.css'
import './styles/partner.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IDVerification />} />
        <Route path="/partner/register" element={<PartnerRegister />} />
        <Route path="/partner/login" element={<PartnerLogin />} />
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        <Route path="/partner/verifications" element={<PartnerVerifications />} />
        <Route path="/partner/settings" element={<PartnerSettings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
