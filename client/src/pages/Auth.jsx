import { useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Footer from '../components/Footer'
import {
  confirmPasswordReset,
  login,
  registerRequestOtp,
  registerVerifyOtp,
  requestPasswordReset,
} from '../lib/api'

const initialRegister = { name: '', email: '', password: '', otp: '' }
const initialLogin = { email: '', password: '' }
const initialReset = { email: '', password: '', otp: '' }

function Auth() {
  const navigate = useNavigate()
  const { completeAuth, pushToast } = useOutletContext()
  const [mode, setMode] = useState('login')
  const [loginForm, setLoginForm] = useState(initialLogin)
  const [registerForm, setRegisterForm] = useState(initialRegister)
  const [resetForm, setResetForm] = useState(initialReset)
  const [otpRequested, setOtpRequested] = useState(false)
  const [resetOtpRequested, setResetOtpRequested] = useState(false)
  const [debugOtp, setDebugOtp] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [message, setMessage] = useState('')

  const canLogin = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email) && loginForm.password.length >= 8,
    [loginForm]
  )
  const canRegister = useMemo(
    () =>
      registerForm.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email) &&
      registerForm.password.length >= 8,
    [registerForm]
  )
  const canRequestReset = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetForm.email),
    [resetForm.email]
  )
  const canConfirmReset = useMemo(
    () =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetForm.email) &&
      resetForm.otp.trim().length >= 4 &&
      resetForm.password.length >= 8,
    [resetForm]
  )

  const switchMode = (nextMode) => {
    setMode(nextMode)
    setMessage('')
    setDebugOtp('')
    setOtpRequested(false)
    setResetOtpRequested(false)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    if (!canLogin) return
    setIsBusy(true)
    setMessage('')
    try {
      const payload = await login(loginForm)
      completeAuth(payload)
      pushToast('Welcome back')
      navigate(payload.user?.role === 'admin' ? '/admin' : '/account')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleRequestOtp = async (event) => {
    event.preventDefault()
    if (!canRegister) return
    setIsBusy(true)
    setMessage('')
    try {
      const payload = await registerRequestOtp(registerForm)
      setOtpRequested(true)
      setDebugOtp(payload.debugOtp || '')
      setMessage(payload.delivery?.fallback ? 'OTP generated locally because Brevo is not configured yet.' : 'OTP sent to your email.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    setIsBusy(true)
    setMessage('')
    try {
      const payload = await registerVerifyOtp({
        email: registerForm.email,
        otp: registerForm.otp,
      })
      completeAuth(payload)
      pushToast('Account created successfully')
      navigate('/account')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleRequestPasswordReset = async (event) => {
    event.preventDefault()
    if (!canRequestReset) return
    setIsBusy(true)
    setMessage('')
    try {
      const payload = await requestPasswordReset({ email: resetForm.email })
      setResetOtpRequested(true)
      setDebugOtp(payload.debugOtp || '')
      setMessage(payload.message || 'If the account exists, a reset OTP has been sent.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleConfirmPasswordReset = async (event) => {
    event.preventDefault()
    if (!canConfirmReset) return
    setIsBusy(true)
    setMessage('')
    try {
      const payload = await confirmPasswordReset(resetForm)
      completeAuth(payload)
      pushToast('Password updated successfully')
      navigate(payload.user?.role === 'admin' ? '/admin' : '/account')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div className="page">
      <section className="page-hero">
        <div>
          <h1>
            {mode === 'login'
              ? 'Sign in'
              : mode === 'register'
                ? 'Create your account'
                : 'Reset your password'}
          </h1>
          <p>Secure customer access with JWT sessions, refresh tokens, and OTP verification.</p>
        </div>
        <div className="hero-cta">
          {mode !== 'login' && (
            <button className="btn ghost" type="button" onClick={() => switchMode('login')}>
              Back to login
            </button>
          )}
        </div>
      </section>

      <section className="checkout-grid">
        {mode === 'login' ? (
          <form className="checkout-form" onSubmit={handleLogin}>
            <h3>Sign in to continue</h3>
            <label>
              Email
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </label>
            <button className="btn primary" type="submit" disabled={!canLogin || isBusy}>
              {isBusy ? 'Signing in...' : 'Sign in'}
            </button>
            <button className="btn ghost" type="button" onClick={() => switchMode('reset')}>
              Forgot password?
            </button>
            <button className="btn ghost" type="button" onClick={() => switchMode('register')}>
              Create account
            </button>
            {message && <p className="banner-info">{message}</p>}
          </form>
        ) : mode === 'register' ? (
          <form className="checkout-form" onSubmit={otpRequested ? handleVerifyOtp : handleRequestOtp}>
            <h3>Register with email OTP</h3>
            <label>
              Full name
              <input
                type="text"
                value={registerForm.name}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, name: event.target.value }))}
                disabled={otpRequested}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
                disabled={otpRequested}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={registerForm.password}
                onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                disabled={otpRequested}
              />
            </label>
            {otpRequested && (
              <label>
                OTP
                <input
                  type="text"
                  value={registerForm.otp}
                  onChange={(event) => setRegisterForm((prev) => ({ ...prev, otp: event.target.value }))}
                />
              </label>
            )}
            <button className="btn primary" type="submit" disabled={(otpRequested ? !registerForm.otp : !canRegister) || isBusy}>
              {isBusy ? 'Please wait...' : otpRequested ? 'Verify OTP' : 'Send OTP'}
            </button>
            <button className="btn ghost" type="button" onClick={() => switchMode('login')}>
              Already have an account?
            </button>
            {debugOtp && <p className="small-note">Development OTP: {debugOtp}</p>}
            {message && <p className="banner-info">{message}</p>}
          </form>
        ) : (
          <form className="checkout-form" onSubmit={resetOtpRequested ? handleConfirmPasswordReset : handleRequestPasswordReset}>
            <h3>Reset password with OTP</h3>
            <label>
              Email
              <input
                type="email"
                value={resetForm.email}
                onChange={(event) => setResetForm((prev) => ({ ...prev, email: event.target.value }))}
                disabled={resetOtpRequested}
              />
            </label>
            {resetOtpRequested && (
              <>
                <label>
                  OTP
                  <input
                    type="text"
                    value={resetForm.otp}
                    onChange={(event) => setResetForm((prev) => ({ ...prev, otp: event.target.value }))}
                  />
                </label>
                <label>
                  New password
                  <input
                    type="password"
                    value={resetForm.password}
                    onChange={(event) => setResetForm((prev) => ({ ...prev, password: event.target.value }))}
                  />
                </label>
              </>
            )}
            <button className="btn primary" type="submit" disabled={(resetOtpRequested ? !canConfirmReset : !canRequestReset) || isBusy}>
              {isBusy ? 'Please wait...' : resetOtpRequested ? 'Reset password' : 'Send reset OTP'}
            </button>
            <button className="btn ghost" type="button" onClick={() => switchMode('login')}>
              Back to login
            </button>
            {debugOtp && <p className="small-note">Development OTP: {debugOtp}</p>}
            {message && <p className="banner-info">{message}</p>}
          </form>
        )}

        <aside className="checkout-summary">
          <h3>Production baseline included</h3>
          <div className="summary-items">
            <div className="summary-item"><span>JWT auth</span><span>Ready</span></div>
            <div className="summary-item"><span>Refresh tokens</span><span>Ready</span></div>
            <div className="summary-item"><span>Brevo OTP</span><span>Ready</span></div>
            <div className="summary-item"><span>Paystack checkout</span><span>Ready</span></div>
            <div className="summary-item"><span>Password reset</span><span>Ready</span></div>
            <div className="summary-item"><span>Admin dashboard</span><span>Ready</span></div>
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  )
}

export default Auth
