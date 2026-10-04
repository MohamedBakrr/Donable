import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { MotionConfig } from 'framer-motion'
import { notificationService } from './services/notificationService'
import { audioService } from './services/audioService'
import { addFocusTime } from './store/slices/tasksSlice'
import { pushNotification } from './store/slices/notificationsSlice'
import { resetTimer, tickTimer } from './store/slices/timerSlice'
import AppShell from './components/AppShell'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const AuthPage = lazy(() => import('./pages/AuthPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const TasksPage = lazy(() => import('./pages/TasksPage'))
const HabitsPage = lazy(() => import('./pages/HabitsPage'))
const FocusPage = lazy(() => import('./pages/FocusPage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

function ProtectedRoute() {
    const user = useSelector((state) => state.auth.user)
    return user ? <AppShell /> : <Navigate to="/login" replace />
}

function ThemeController({ children }) {
    const theme = useSelector((state) => state.settings.theme)
    useEffect(() => {
        const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
        const applyTheme = () => {
            const dark = theme === 'dark' || (theme === 'system' && colorScheme.matches)
            document.documentElement.classList.toggle('theme-dark', dark)
            document.documentElement.classList.toggle('theme-light', !dark)
        }

        applyTheme()
        document.documentElement.classList.toggle('theme-system', theme === 'system')
        colorScheme.addEventListener('change', applyTheme)
        return () => colorScheme.removeEventListener('change', applyTheme)
    }, [theme])
    return children
}

function TimerController() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const timer = useSelector((state) => state.timer)
    const settings = useSelector((state) => state.settings)
    const totalSeconds = (timer.sessionType === 'break' ? settings.breakMinutes : settings.focusMinutes) * 60

    useEffect(() => {
        if (!user || timer.status !== 'running') return
        if (timer.remainingSeconds > 0) {
            const timeout = window.setTimeout(() => dispatch(tickTimer()), 1000)
            return () => window.clearTimeout(timeout)
        }

        if (timer.sessionType === 'focus') dispatch(addFocusTime({ taskId: timer.taskId, minutes: settings.focusMinutes }))
        const notification = notificationService.create('TIMER_COMPLETE', 'Focus session complete', timer.sessionType === 'focus' ? 'Take a moment to rest. You earned it.' : 'Your break is over. Ready when you are.')
        dispatch(pushNotification(notification))
        if (settings.browserNotificationsEnabled) notificationService.sendBrowserNotification(notification)
        if (settings.soundEnabled) {
            audioService.playCompletion().catch((error) => {
                console.error('Unable to play a Donable timer alert.', error)
                dispatch(pushNotification(notificationService.create('SYSTEM', 'Audio alert unavailable', `${error.message} The timer still completed successfully.`)))
            })
        }
        dispatch(resetTimer(totalSeconds))
    }, [dispatch, settings.browserNotificationsEnabled, settings.focusMinutes, settings.soundEnabled, timer.remainingSeconds, timer.sessionType, timer.status, timer.taskId, totalSeconds, user])

    return null
}

export default function App() {
    return (
        <BrowserRouter>
            <MotionConfig reducedMotion="user">
                <ThemeController>
                    <TimerController />
                    <Suspense fallback={<div className="route-loading grid min-h-screen place-items-center" role="status">Loading your workspace…</div>}>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/features" element={<LandingPage />} />
                            <Route path="/login" element={<AuthPage mode="login" />} />
                            <Route path="/signup" element={<AuthPage mode="signup" />} />
                            <Route path="/app" element={<ProtectedRoute />}>
                                <Route index element={<Navigate to="dashboard" replace />} />
                                <Route path="dashboard" element={<DashboardPage />} />
                                <Route path="tasks" element={<TasksPage />} />
                                <Route path="habits" element={<HabitsPage />} />
                                <Route path="focus" element={<FocusPage />} />
                                <Route path="notifications" element={<NotificationsPage />} />
                                <Route path="settings" element={<SettingsPage />} />
                            </Route>
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </ThemeController>
            </MotionConfig>
        </BrowserRouter>
    )
}
