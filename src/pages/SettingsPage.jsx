import { useState } from 'react'
import { Bell, Check, Download, Moon, Monitor, Sun, Timer, UserRound, Volume2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../store/slices/authSlice'
import { updateSettings } from '../store/slices/settingsSlice'
import { audioService } from '../services/audioService'
import { notificationService } from '../services/notificationService'

export default function SettingsPage() {
    const user = useSelector((state) => state.auth.user)
    const settings = useSelector((state) => state.settings)
    const tasks = useSelector((state) => state.tasks.items)
    const habits = useSelector((state) => state.habits.items)
    const notifications = useSelector((state) => state.notifications.items)
    const dispatch = useDispatch()
    const [saved, setSaved] = useState(false)
    const [browserPermission, setBrowserPermission] = useState(() => notificationService.permission())
    const [alertMessage, setAlertMessage] = useState('')

    const saveProfile = (event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const name = formData.get('name')
        const email = formData.get('email')
        if (!name.trim() || !email.trim()) return
        dispatch(updateProfile({ name: name.trim(), email: email.trim() }))
        setSaved(true)
        window.setTimeout(() => setSaved(false), 2200)
    }
    const exportData = () => {
        const blob = new Blob([JSON.stringify({ user, tasks, habits, notifications, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = `donable-workspace-${new Date().toISOString().slice(0, 10)}.json`
        anchor.click()
        URL.revokeObjectURL(url)
    }
    const setTheme = (theme) => dispatch(updateSettings({ theme }))
    const previewSound = async () => {
        try {
            await audioService.unlock()
            await audioService.playCompletion()
            setAlertMessage('Sound preview played.')
        } catch (error) {
            setAlertMessage(error.message)
        }
    }
    const toggleBrowserNotifications = async () => {
        if (settings.browserNotificationsEnabled) {
            dispatch(updateSettings({ browserNotificationsEnabled: false }))
            setAlertMessage('Browser notifications are turned off.')
            return
        }
        try {
            const permission = await notificationService.requestPermission()
            setBrowserPermission(permission)
            if (permission === 'granted') {
                dispatch(updateSettings({ browserNotificationsEnabled: true }))
                setAlertMessage('Browser notifications are enabled.')
            } else if (permission === 'denied') {
                setAlertMessage('Permission was denied. Allow notifications for Donable in your browser settings to enable them.')
            } else {
                setAlertMessage('This browser does not support notifications.')
            }
        } catch (error) {
            setAlertMessage(`Could not enable browser notifications: ${error.message}`)
        }
    }

    return (
        <div className="page settings-page">
            <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> MAKE IT YOURS</div><h1>Settings<span className="heading-spark"> ✳</span></h1><p>A few thoughtful details for your workspace.</p></div></div>
            <div className="settings-layout">
                <nav className="settings-nav" aria-label="Settings sections"><a className="active" href="#profile"><UserRound size={16} /> Profile</a><a href="#appearance"><Sun size={16} /> Appearance</a><a href="#productivity"><Timer size={16} /> Productivity</a><a href="#notifications"><Bell size={16} /> Notifications</a><a href="#data"><Download size={16} /> Your data</a></nav>
                <div className="settings-sections">
                    <section className="settings-section surface-card" id="profile"><div className="settings-section-heading"><div className="settings-section-icon"><UserRound size={17} /></div><div><h2>Your profile</h2><p>The basics of your personal space.</p></div></div><form className="settings-profile-form" onSubmit={saveProfile}><div className="profile-avatar-large">{(user?.name || 'M').slice(0, 1).toUpperCase()}</div><div className="profile-fields"><label>Your name<input name="name" defaultValue={user?.name || ''} required /></label><label>Email address<input name="email" type="email" defaultValue={user?.email || ''} required /></label><button className="button button-dark" type="submit">{saved ? <><Check size={15} /> Saved</> : 'Save profile'}</button></div></form></section>
                    <section className="settings-section surface-card" id="appearance"><div className="settings-section-heading"><div className="settings-section-icon"><Sun size={17} /></div><div><h2>Appearance</h2><p>Choose the feel that works for you.</p></div></div><div className="theme-options">{[{ id: 'light', label: 'Light', icon: Sun }, { id: 'dark', label: 'Dark', icon: Moon }, { id: 'system', label: 'System', icon: Monitor }].map(({ id, label, icon: Icon }) => <button className={`theme-option${settings.theme === id ? ' selected' : ''}`} onClick={() => setTheme(id)} key={id}><span className={`theme-swatch theme-${id}`}><Icon size={18} /></span><span>{label}</span>{settings.theme === id && <Check size={15} />}</button>)}</div></section>
                    <section className="settings-section surface-card" id="productivity"><div className="settings-section-heading"><div className="settings-section-icon"><Timer size={17} /></div><div><h2>Focus timer</h2><p>Set a pace you can come back to.</p></div></div><div className="timer-settings"><label>Focus duration<span><input type="number" min="1" max="180" value={settings.focusMinutes} onChange={(event) => dispatch(updateSettings({ focusMinutes: Number(event.target.value) || 1 }))} /> min</span></label><label>Break duration<span><input type="number" min="1" max="60" value={settings.breakMinutes} onChange={(event) => dispatch(updateSettings({ breakMinutes: Number(event.target.value) || 1 }))} /> min</span></label></div></section>
                    <section className="settings-section surface-card" id="notifications"><div className="settings-section-heading"><div className="settings-section-icon"><Bell size={17} /></div><div><h2>Alerts & notifications</h2><p>Choose how Donable gets your attention.</p></div><span className="settings-status"><i /> In-app active</span></div><div className="alert-setting-row"><div className="alert-setting-icon"><Volume2 size={15} /></div><div className="alert-setting-copy"><b>Sound alerts</b><span>Play a gentle chime when a focus or break timer ends.</span></div><label className="switch-control"><input type="checkbox" checked={Boolean(settings.soundEnabled)} onChange={(event) => dispatch(updateSettings({ soundEnabled: event.target.checked }))} aria-label="Enable sound alerts" /><span /></label><button className="button button-quiet alert-test-button" onClick={previewSound}>Test sound</button></div><div className="alert-setting-row browser-alert-row"><div className="alert-setting-icon"><Bell size={15} /></div><div className="alert-setting-copy"><b>Browser notifications</b><span>Show system alerts for completed tasks, habits, and focus sessions.</span><small>Permission: {browserPermission}</small></div><button className="button button-quiet browser-alert-button" onClick={toggleBrowserNotifications}>{settings.browserNotificationsEnabled ? 'Turn off' : browserPermission === 'granted' ? 'Enable' : 'Allow notifications'}</button></div>{alertMessage && <p className="alert-feedback" role="status">{alertMessage}</p>}</section>
                    <section className="settings-section surface-card" id="data"><div className="settings-section-heading"><div className="settings-section-icon"><Download size={17} /></div><div><h2>Your data</h2><p>Your workspace belongs to you.</p></div></div><div className="data-export"><div><b>Export your workspace</b><span>Download a copy of your tasks, habits, and notifications.</span></div><button className="button button-quiet" onClick={exportData}><Download size={15} /> Export JSON</button></div><p className="settings-note">This demo stores information in your browser on this device. Clearing browser data removes your local workspace.</p></section>
                </div>
            </div>
        </div>
    )
}
