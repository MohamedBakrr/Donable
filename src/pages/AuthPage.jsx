import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { signedIn } from '../store/slices/authSlice'
import { authService } from '../services/authService'

export default function AuthPage({ mode }) {
    const isSignup = mode === 'signup'
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const submit = (event) => {
        event.preventDefault()
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError('Enter a valid email address.')
            return
        }
        if (password.length < 6) {
            setError('Use at least 6 characters for your password.')
            return
        }
        if (isSignup && name.trim().length < 2) {
            setError('Please enter your name.')
            return
        }
        const user = authService.login({ name, email })
        dispatch(signedIn(user))
        navigate('/app/dashboard')
    }

    return (
        <main className="auth-page">
            <div className="auth-aside"><Link className="brand" to="/"><span className="brand-mark"><Check size={17} strokeWidth={3} /></span><span>donable<span className="brand-period">.</span></span></Link><Link to="/" className="auth-back"><ArrowLeft size={15} /> Back to home</Link><div className="auth-aside-copy"><div className="eyebrow"><span className="eyebrow-dot" /> A calmer kind of productivity</div><h1>Make space<br />for <span>your next</span><br />good thing.</h1><p>Small steps, steady momentum. Your workspace is ready when you are.</p><div className="auth-aside-bottom"><span>✳</span><p>“You don’t have to see the whole staircase.<br />Just take the first step.”</p></div></div><div className="auth-aside-footer">© {new Date().getFullYear()} Donable</div></div>
            <section className="auth-content"><div className="auth-mobile-brand"><Link className="brand" to="/"><span className="brand-mark"><Check size={16} strokeWidth={3} /></span><span>donable<span className="brand-period">.</span></span></Link></div><div className="auth-form-wrap"><span className="auth-step">{isSignup ? 'GET STARTED' : 'WELCOME BACK'}</span><h2>{isSignup ? 'Create your space.' : 'Good to see you.'}</h2><p className="auth-lead">{isSignup ? 'A little more intention starts right here.' : 'Pick up where you left off.'}</p><form className="auth-form" onSubmit={submit} noValidate>
                {isSignup && <label>Your name<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Mohamed Hassan" required /></label>}
                <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setError('') }} placeholder="you@example.com" required /></label>
                <label>Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} placeholder="At least 6 characters" required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="button button-dark auth-submit" type="submit">{isSignup ? 'Create my workspace' : 'Log in to Donable'} <ArrowRight size={16} /></button>
            </form><p className="auth-switch">{isSignup ? 'Already have a workspace?' : 'New around here?'} <Link to={isSignup ? '/login' : '/signup'}>{isSignup ? 'Log in' : 'Create an account'}</Link></p><p className="auth-demo-note">Demo mode · Your workspace is stored on this device only.</p></div><div className="auth-legal">By continuing, you agree to keep showing up for yourself. <span>That’s the only commitment.</span></div></section>
        </main>
    )
}
