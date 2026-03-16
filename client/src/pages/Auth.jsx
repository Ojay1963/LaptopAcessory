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
      await registerRequestOtp(registerForm)
      setOtpRequested(true)
      setMessage('Check your email for the verification code, then enter it below.')
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
      setMessage(payload.message || 'If that email exists, we have sent a reset code.')
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
          <p>Manage your orders, wishlist, and checkout faster with your OJ Devices account.</p>
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
            {message && <p className="banner-info">{message}</p>}
          </form>
        )}

        <aside className="checkout-summary">
          <h3>Why create an account?</h3>
          <p className="small-note">
            Save your details, follow orders from payment to delivery, and return to your basket anytime.
          </p>
          <div className="summary-items">
            <div className="summary-item"><span>Track your orders</span><span>Anytime</span></div>
            <div className="summary-item"><span>Save your favourites</span><span>Instantly</span></div>
            <div className="summary-item"><span>Faster checkout</span><span>Ready</span></div>
            <div className="summary-item"><span>Secure account recovery</span><span>Included</span></div>
            <div className="summary-item"><span>Access your account history</span><span>Easy</span></div>
            <div className="summary-item"><span>Manage deliveries</span><span>Simple</span></div>
          </div>
        </aside>
      </section>
      <Footer />
    </div>
  )
}

export default Auth
