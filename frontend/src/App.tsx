import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppWrapper } from './modules/app/components/AppWrapper'
import { Layout } from './modules/app/components/Layout'
import { LoginForm } from './modules/authentification/components/LoginForm'
import { RegisterForm } from './modules/authentification/components/RegisterForm'
import { OtpVerifyPage } from './modules/authentification/components/OtpVerifyPage'
import { ProfilePage } from './modules/user/components/ProfilePage'
import './App.css'


//Browerrouter to provide routing
//Routes to provide routes
function App() {
  return (
    <AppWrapper>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/otp-verify" element={<OtpVerifyPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppWrapper>
  )
}

export default App
