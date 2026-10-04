import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, CheckCircle2, Circle, Clock3, Flame, ListTodo, Menu, Moon, Play, Sun, Target, Timer, X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateSettings } from '../store/slices/settingsSlice'

const features = [
    { icon: ListTodo, number: 'TASKS', title: 'Keep the next step visible', text: 'Capture work, set a due date, and move each task through a simple board.' },
    { icon: Flame, number: 'HABITS', title: 'Make routines easier to keep', text: 'Check in each day and see your recent history without chasing a perfect streak.' },
    { icon: Timer, number: 'FOCUS', title: 'Give one thing your attention', text: 'Set a work and break length, link a task, and keep the timer running as you move around.' },
]

export default function LandingPage() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const tasks = useSelector((state) => state.tasks.items)
    const theme = useSelector((state) => state.settings.theme)
    const focusMinutes = useSelector((state) => state.settings.focusMinutes)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [systemPrefersDark, setSystemPrefersDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
    const done = tasks.filter((task) => task.status === 'DONE').length
    const destination = user ? '/app/dashboard' : '/signup'
    const focusDestination = user ? '/app/focus' : '/login'
    const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark)
    const toggleTheme = () => dispatch(updateSettings({ theme: isDark ? 'light' : 'dark' }))
    const closeMobileMenu = () => setMobileMenuOpen(false)

    useEffect(() => {
        const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
        const updateSystemTheme = (event) => setSystemPrefersDark(event.matches)
        colorScheme.addEventListener('change', updateSystemTheme)
        return () => colorScheme.removeEventListener('change', updateSystemTheme)
    }, [])

    return (
        <div className="landing">
            <header className="landing-nav">
                <Link className="brand" to="/"><span className="brand-mark"><Check size={17} strokeWidth={3} /></span><span>donable<span className="brand-period">.</span></span></Link>
                <nav className="landing-links" aria-label="Main navigation"><a href="#features">Features</a><a href="#product">Product</a><a href="#philosophy">Our approach</a></nav>
                <div className="landing-actions"><Link className="nav-login" to={user ? '/app/dashboard' : '/login'}>{user ? 'Open workspace' : 'Log in'}</Link><Link className="button button-dark button-small" to={destination}>Get started <ArrowRight size={15} /></Link></div>
                <button className="landing-theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`} aria-pressed={isDark} title={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
                    {isDark ? <Sun size={17} /> : <Moon size={17} />}
                </button>
                <button className="landing-menu" type="button" aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen} aria-controls="landing-mobile-menu" onClick={() => setMobileMenuOpen((open) => !open)}>{mobileMenuOpen ? <X size={19} /> : <Menu size={20} />}</button>
                <AnimatePresence>
                    {mobileMenuOpen && <motion.nav id="landing-mobile-menu" className="landing-mobile-menu" aria-label="Mobile navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.16 }}>
                        <a href="#features" onClick={closeMobileMenu}>Features</a>
                        <a href="#product" onClick={closeMobileMenu}>Product</a>
                        <a href="#philosophy" onClick={closeMobileMenu}>Our approach</a>
                        <Link to={user ? '/app/dashboard' : '/login'} onClick={closeMobileMenu}>{user ? 'Open workspace' : 'Log in'}</Link>
                        <Link className="button button-dark button-small" to={destination} onClick={closeMobileMenu}>Get started <ArrowRight size={15} /></Link>
                    </motion.nav>}
                </AnimatePresence>
            </header>

            <main>
                <section className="hero-section">
                    <motion.div className="hero-copy" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                        <div className="eyebrow"><span className="eyebrow-dot" /> Tasks, habits and focus—in one place</div>
                        <h1>A clearer plan<br /><span>for your day.</span></h1>
                        <p className="hero-subtitle">Keep your tasks, daily habits and focus timer together. Start with what needs doing now; change the plan when life does.</p>
                        <div className="hero-buttons"><Link className="button button-dark" to={destination}>Open your workspace <ArrowRight size={16} /></Link><a className="button button-text" href="#features"><span className="play-icon"><Play size={12} fill="currentColor" /></span> See what’s included</a></div>
                        <div className="hero-proof"><span>Your workspace stays in this browser.</span></div>
                    </motion.div>

                    <motion.div className="hero-preview-wrap" initial={{ x: 18 }} animate={{ x: 0 }} transition={{ duration: 0.65, delay: 0.12, ease: 'easeOut' }}>
                        <div className="dashboard-preview">
                            <div className="preview-sidebar"><div className="preview-mini-brand"><span className="brand-mark"><Check size={11} strokeWidth={3} /></span> donable</div><div className="preview-nav-active"><ListTodo size={13} /> Overview</div><div className="preview-nav"><Target size={13} /> Habits</div><div className="preview-nav"><Timer size={13} /> Focus</div><div className="preview-side-bottom"><div className="preview-user-dot">{user?.name?.slice(0, 1).toUpperCase() || 'Y'}</div><span>{user?.name ? `${user.name}'s workspace` : 'Your workspace'}</span></div></div>
                            <div className="preview-main">
                                <div className="preview-toolbar"><span>Your workspace&nbsp; / &nbsp;<b>Overview</b></span><span className="preview-date">TODAY</span></div>
                                <div className="preview-greeting"><div><span className="preview-overline">A QUICK LOOK</span><h3>Your day, in view</h3><p>{user?.name ? `Welcome back, ${user.name}.` : 'Pick one thing to move forward.'}</p></div></div>
                                <div className="preview-stats"><div><span>OPEN TASKS</span><b>{Math.max(tasks.length - done, 0).toString().padStart(2, '0')}</b><small>Across your task board</small></div><div><span>COMPLETED</span><b>{done.toString().padStart(2, '0')}</b><small>Tasks checked off</small></div><div><span>FOCUS SESSION</span><b>{focusMinutes} <i>min</i></b><small>Your current setting</small></div></div>
                                <div className="preview-lower">
                                    <div className="preview-task-box"><div className="preview-box-head"><b>Next on your list</b><span>{tasks.length} total</span></div>{tasks.slice(0, 3).map((task) => <div className="preview-task" key={task.id}>{task.status === 'DONE' ? <CheckCircle2 size={13} /> : <Circle size={13} />}<span>{task.title}</span><i className="preview-priority">{task.category || task.status.replace('_', ' ')}</i></div>)}</div>
                                    <div className="preview-focus-box"><span className="preview-box-label">FOCUS TIMER</span><div className="preview-timer"><div className="timer-ring"><span>{String(focusMinutes).padStart(2, '0')}<span>:00</span></span></div></div><span className="preview-focus-text"><Clock3 size={12} /> Work, then take a break</span><Link to={focusDestination}><Play size={11} fill="currentColor" /> Open timer</Link></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    <a className="hero-scroll" href="#features"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
                </section>

                <motion.section className="trust-strip" initial={{ y: 8 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3 }}><span>BUILT FOR THE WAY A DAY ACTUALLY GOES</span><div><span><Check size={13} /> Change plans anytime</span><span><Check size={13} /> See what’s next</span><span><Check size={13} /> Keep your own pace</span></div></motion.section>
                <section className="features-section" id="features">
                    <div className="section-intro"><div className="eyebrow"><span className="eyebrow-dot" /> Three useful things, together</div><h2>A task list, a routine,<br /><span>a little focus time.</span></h2><p>No complicated system to keep up with. Use the parts that help, and leave the rest.</p></div>
                    <div className="feature-grid grid gap-4 md:grid-cols-3">{features.map(({ icon: Icon, number, title, text }, index) => <motion.article className="feature-card" key={number} initial={{ y: 12 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, delay: index * 0.06 }}><div className="feature-card-top"><div className="feature-icon"><Icon size={19} /></div><span>{number}</span></div><h3>{title}</h3><p>{text}</p><ArrowUpRight className="feature-arrow" size={17} /></motion.article>)}</div>
                </section>
                <motion.section className="product-section" id="product" initial={{ y: 14 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.42 }}><div className="product-left"><div className="eyebrow"><span className="eyebrow-dot" /> A workspace that stays flexible</div><h2>Start with today.<br /><span>Adjust as you go.</span></h2><p>Move a task, update a habit, or take a break. Your workspace is yours to change when the day changes.</p><Link to={destination} className="text-link">Go to your workspace <ArrowRight size={15} /></Link></div><div className="product-card"><div className="product-card-heading"><div><span className="preview-overline">TASK BOARD</span><h3>Your progress, without the pressure.</h3></div><div className="product-ring"><span>{tasks.length ? Math.round(done / tasks.length * 100) : 0}%</span></div></div><div className="product-progress"><span style={{ width: `${tasks.length ? Math.round(done / tasks.length * 100) : 0}%` }} /></div><div className="product-card-foot"><span>{done} of {tasks.length} tasks complete</span><span>{tasks.length ? 'Based on your board' : 'No tasks yet'}</span></div><div className="product-card-quote"><Check size={15} /><span>Your tasks and habits are saved in this browser, not synced to a server.</span></div></div></motion.section>
                <section className="philosophy-section" id="philosophy"><div className="philosophy-mark"><Check size={20} /></div><p>A plan should help you,<br /><span>not become another task.</span></p><span className="philosophy-credit">Use Donable your way. There’s no perfect streak to protect.</span></section>
                <motion.section className="landing-cta" id="cta" initial={{ y: 12 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }}><div className="eyebrow"><span className="eyebrow-dot" /> Start small</div><h2>Pick one thing<br />for today.</h2><p>You can sort out the rest when you get there.</p><Link to={destination} className="button button-light">Open your workspace <ArrowRight size={16} /></Link><span className="cta-note"><Check size={13} /> Saved on this device · No setup required</span></motion.section>
            </main>
            <footer className="landing-footer"><Link className="brand" to="/"><span className="brand-mark"><Check size={15} strokeWidth={3} /></span><span>donable<span className="brand-period">.</span></span></Link><span>Make room for what matters.</span><div><a href="#features">Features</a><Link to="/login">Log in</Link><span>© {new Date().getFullYear()} Donable</span></div></footer>
        </div>
    )
}
