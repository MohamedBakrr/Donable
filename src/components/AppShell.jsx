import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Check, ChevronDown, Command, LayoutDashboard, LogOut, Moon, Plus, Search, Settings, Sun, Target, Timer, X, ListTodo, CheckCircle2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { signedOut } from '../store/slices/authSlice'
import { updateSettings } from '../store/slices/settingsSlice'
import { authService } from '../services/authService'

const navigation = [
    { to: '/app/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/app/tasks', label: 'My tasks', icon: ListTodo },
    { to: '/app/habits', label: 'Habits', icon: Target },
    { to: '/app/focus', label: 'Focus', icon: Timer },
    { to: '/app/notifications', label: 'Notifications', icon: Bell },
]
const titles = { dashboard: 'Overview', tasks: 'My tasks', habits: 'Habits', focus: 'Focus mode', notifications: 'Notifications', settings: 'Settings' }

export default function AppShell() {
    const user = useSelector((state) => state.auth.user)
    const tasks = useSelector((state) => state.tasks.items)
    const unread = useSelector((state) => state.notifications.items.filter((item) => !item.read).length)
    const latestNotification = useSelector((state) => state.notifications.items[0])
    const theme = useSelector((state) => state.settings.theme)
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [searchOpen, setSearchOpen] = useState(false)
    const [query, setQuery] = useState('')
    const [profileOpen, setProfileOpen] = useState(false)
    const [toast, setToast] = useState(null)
    const lastNotificationId = useRef(latestNotification?.id)
    const segment = location.pathname.split('/').pop()
    const results = useMemo(() => tasks.filter((task) => task.title.toLowerCase().includes(query.toLowerCase())).slice(0, 6), [query, tasks])

    useEffect(() => {
        const onKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault()
                setSearchOpen(true)
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    useEffect(() => {
        if (!latestNotification || latestNotification.id === lastNotificationId.current) return
        lastNotificationId.current = latestNotification.id
        const timeout = window.setTimeout(() => setToast(latestNotification), 0)
        return () => window.clearTimeout(timeout)
    }, [latestNotification])

    useEffect(() => {
        if (!toast) return
        const timeout = window.setTimeout(() => setToast(null), 5000)
        return () => window.clearTimeout(timeout)
    }, [toast])

    const logout = () => {
        authService.logout()
        dispatch(signedOut())
        navigate('/')
    }
    const toggleTheme = () => dispatch(updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' }))

    return (
        <div className="app-frame min-h-screen">
            <aside className="sidebar">
                <Link className="brand" to="/app/dashboard"><span className="brand-mark"><Check size={17} strokeWidth={3} /></span><span>donable<span className="brand-period">.</span></span></Link>
                <div className="workspace-label">WORKSPACE</div>
                <div className="workspace-switch"><span className="workspace-avatar">M</span><span className="workspace-text"><b>{user?.name || 'My workspace'}</b><small>Personal space</small></span><ChevronDown size={15} /></div>
                <div className="nav-caption">MENU</div>
                <nav className="side-nav" aria-label="Main navigation">
                    {navigation.map(({ to, label, icon: Icon }) => (
                        <NavLink className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} to={to} key={to}>
                            <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
                            {label === 'Notifications' && unread > 0 && <span className="nav-count">{unread}</span>}
                        </NavLink>
                    ))}
                </nav>
                <div className="sidebar-spacer" />
                <div className="sidebar-focus-card">
                    <div className="focus-card-icon"><Timer size={17} /></div>
                    <b>Make room to focus</b>
                    <p>One thing at a time. You’ve got this.</p>
                    <Link to="/app/focus">Start a session <span>→</span></Link>
                </div>
                <NavLink className={({ isActive }) => `nav-item settings-link${isActive ? ' active' : ''}`} to="/app/settings"><Settings size={17} /><span>Settings</span></NavLink>
                <div className="sidebar-user">
                    <div className="avatar">{(user?.name || 'M').slice(0, 1).toUpperCase()}</div>
                    <div className="user-meta"><b>{user?.name || 'My account'}</b><span>{user?.email || 'Local workspace'}</span></div>
                    <button className="icon-button small" aria-label="Sign out" onClick={logout}><LogOut size={16} /></button>
                </div>
            </aside>

            <div className="workspace min-h-screen">
                <header className="topbar">
                    <div className="mobile-brand"><Link className="brand" to="/app/dashboard"><span className="brand-mark"><Check size={16} strokeWidth={3} /></span><span>donable<span className="brand-period">.</span></span></Link></div>
                    <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-slash">/</span><b>{titles[segment] || 'Overview'}</b></div>
                    <div className="topbar-actions">
                        <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search Donable"><Search size={15} /><span>Search anything...</span><kbd><Command size={11} /> K</kbd></button>
                        <button className="icon-button theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>
                        <button className="icon-button notification-trigger" aria-label="Open notifications" onClick={() => navigate('/app/notifications')}><Bell size={18} />{unread > 0 && <i />}</button>
                        <button className="topbar-avatar" aria-label="Open profile" onClick={() => setProfileOpen(!profileOpen)}>{(user?.name || 'M').slice(0, 1).toUpperCase()}</button>
                        {profileOpen && <div className="profile-popover"><b>{user?.name}</b><span>{user?.email}</span><Link to="/app/settings" onClick={() => setProfileOpen(false)}>Profile & settings</Link><button onClick={logout}>Sign out</button></div>}
                    </div>
                </header>
                <main className="main-content mx-auto w-full" key={location.pathname}>
                    <AnimatePresence mode="wait">
                        <motion.div initial={{ y: 7 }} animate={{ y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
                <nav className="bottom-nav" aria-label="Mobile navigation">
                    {navigation.filter((item) => ['Overview', 'My tasks', 'Habits', 'Focus'].includes(item.label)).map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}><Icon size={19} /><span>{label === 'Overview' ? 'Home' : label === 'My tasks' ? 'Tasks' : label}</span></NavLink>)}
                </nav>
            </div>

            <AnimatePresence>
                {toast && <motion.div className="app-toast" role="status" initial={{ y: -8 }} animate={{ y: 0 }} exit={{ opacity: 0, y: -5 }}>
                    <span className="toast-icon"><CheckCircle2 size={17} /></span><span className="toast-copy"><b>{toast.title}</b><small>{toast.message}</small></span><button className="toast-close" aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={15} /></button><button className="toast-link" onClick={() => { setToast(null); navigate('/app/notifications') }}>View</button>
                </motion.div>}
            </AnimatePresence>

            <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="dialog-overlay search-overlay" />
                    <Dialog.Content className="search-dialog">
                        <Dialog.Title className="sr-only">Search Donable</Dialog.Title>
                        <div className="search-input-wrap"><Search size={19} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks..." /><kbd>ESC</kbd><Dialog.Close className="search-close" aria-label="Close search"><X size={18} /></Dialog.Close></div>
                        <div className="search-results">
                            <p className="search-label">{query ? 'TASKS' : 'QUICK LINKS'}</p>
                            {query ? results.map((task) => <button className="search-result" key={task.id} onClick={() => { setSearchOpen(false); navigate('/app/tasks') }}><ListTodo size={16} /><span>{task.title}</span><small>{task.status.replace('_', ' ').toLowerCase()}</small></button>) : navigation.slice(0, 4).map(({ to, label, icon: Icon }) => <button className="search-result" key={to} onClick={() => { setSearchOpen(false); navigate(to) }}><Icon size={16} /><span>{label}</span><small>Open page</small></button>)}
                            {query && results.length === 0 && <p className="search-empty">No matching tasks found.</p>}
                        </div>
                        <div className="search-footer"><span><kbd>↵</kbd> to select</span><span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span><span><kbd>ESC</kbd> to close</span></div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            <button className="quick-add-fab" aria-label="Create a new task" onClick={() => navigate('/app/tasks?new=1')}><Plus size={23} /></button>
        </div>
    )
}
