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
import { PartnerTeam } from './components/PartnerTeam'
import { PartnerAcceptInvite } from './components/PartnerAcceptInvite'
import { Roadmap } from './components/Roadmap'
import { AdminLogin } from './components/AdminLogin'
import { AdminForgotPassword } from './components/AdminForgotPassword'
import { AdminResetPassword } from './components/AdminResetPassword'
import { AdminDashboard } from './components/AdminDashboard'
import { AdminPartners } from './components/AdminPartners'
import { AdminVerifications } from './components/AdminVerifications'
import { AdminSettings } from './components/AdminSettings'
import { UserRegister } from './components/UserRegister'
import { UserLogin } from './components/UserLogin'
import { UserDashboard } from './components/UserDashboard'
import { UserCertificate } from './components/UserCertificate'
import { CertificateVerify } from './components/CertificateVerify'
import './styles/landing.css'
import './styles/verification.css'
import './styles/partner.css'
import './styles/admin.css'
import './styles/user.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/verify" element={<IDVerification />} />
        <Route path="/partner/register" element={<PartnerRegister />} />
        <Route path="/partner/login" element={<PartnerLogin />} />
        <Route path="/partner/forgot-password" element={<PartnerForgotPassword />} />
        <Route path="/partner/reset-password" element={<PartnerResetPassword />} />
        <Route path="/partner/dashboard" element={<PartnerDashboard />} />
        <Route path="/partner/verifications" element={<PartnerVerifications />} />
        <Route path="/partner/request-verification" element={<PartnerRequestVerification />} />
        <Route path="/partner/settings" element={<PartnerSettings />} />
        <Route path="/partner/team" element={<PartnerTeam />} />
        <Route path="/partner/accept-invite" element={<PartnerAcceptInvite />} />
        <Route path="/roadmap" element={<Roadmap />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
        <Route path="/admin/reset-password" element={<AdminResetPassword />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/partners" element={<AdminPartners />} />
        <Route path="/admin/verifications" element={<AdminVerifications />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        {/* User Routes */}
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/certificate" element={<UserCertificate />} />

        {/* Public Certificate Verification */}
        <Route path="/certificate/verify/:verificationId" element={<CertificateVerify />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
