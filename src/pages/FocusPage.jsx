import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Maximize2, Pause, Play, RotateCcw, Sparkles, Timer } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { pauseTimer, resetTimer, resumeTimer, startTimer } from '../store/slices/timerSlice'
import { updateSettings } from '../store/slices/settingsSlice'
import { audioService } from '../services/audioService'

const presets = [{ focus: 25, rest: 5, label: '25 / 5' }, { focus: 50, rest: 10, label: '50 / 10' }, { focus: 90, rest: 20, label: '90 / 20' }]
const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

export default function FocusPage() {
    const dispatch = useDispatch()
    const [audioError, setAudioError] = useState('')
    const timer = useSelector((state) => state.timer)
    const tasks = useSelector((state) => state.tasks.items).filter((task) => task.status !== 'DONE')
    const settings = useSelector((state) => state.settings)
    const totalSeconds = (timer.sessionType === 'break' ? settings.breakMinutes : settings.focusMinutes) * 60
    const displaySeconds = timer.status === 'idle' ? totalSeconds : timer.remainingSeconds
    const progress = totalSeconds ? 1 - displaySeconds / totalSeconds : 0

    const selectTask = (taskId) => {
        if (timer.status !== 'idle') dispatch(pauseTimer())
        dispatch(startTimer({ seconds: (timer.sessionType === 'break' ? settings.breakMinutes : settings.focusMinutes) * 60, sessionType: timer.sessionType, taskId }))
    }
    const toggleFocus = () => {
        if (timer.status === 'running') dispatch(pauseTimer())
        else if (timer.status === 'paused') {
            if (settings.soundEnabled) audioService.unlock().catch((error) => setAudioError(error.message))
            dispatch(resumeTimer())
        } else {
            if (settings.soundEnabled) audioService.unlock().catch((error) => setAudioError(error.message))
            dispatch(startTimer({ seconds: totalSeconds, sessionType: timer.sessionType, taskId: timer.taskId }))
        }
    }
    const chooseSession = (sessionType) => {
        const mins = sessionType === 'focus' ? settings.focusMinutes : settings.breakMinutes
        if (settings.soundEnabled) audioService.unlock().catch((error) => setAudioError(error.message))
        dispatch(startTimer({ seconds: mins * 60, sessionType, taskId: timer.taskId }))
        dispatch(pauseTimer())
    }
    const reset = () => dispatch(resetTimer(totalSeconds))
    const enterFullscreen = () => {
        if (document.fullscreenElement) document.exitFullscreen()
        else document.documentElement.requestFullscreen?.()
    }
    const activeTask = tasks.find((task) => task.id === timer.taskId)
    const focusStart = (focus, rest) => {
        if (settings.soundEnabled) audioService.unlock().catch((error) => setAudioError(error.message))
        dispatch(updateSettings({ focusMinutes: focus, breakMinutes: rest }))
        dispatch(startTimer({ seconds: focus * 60, sessionType: 'focus', taskId: timer.taskId }))
    }
    const currentPreset = presets.find((preset) => preset.focus === settings.focusMinutes && preset.rest === settings.breakMinutes)

    return (
        <div className="page focus-page">
            <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> ONE THING AT A TIME</div><h1>Find your focus<span className="heading-spark"> ✳</span></h1><p>A little protected time can change the shape of your day.</p></div><button className="button button-quiet fullscreen-button" onClick={enterFullscreen}><Maximize2 size={15} /> Full screen</button></div>
            <div className="focus-layout">
                <section className="focus-timer-card surface-card">
                    <div className="focus-card-top"><span className="focus-live-label"><i /> {timer.status === 'running' ? 'SESSION IN PROGRESS' : timer.status === 'paused' ? 'SESSION PAUSED' : 'YOUR TIME, YOUR PACE'}</span><span className="focus-session-type">{timer.sessionType === 'focus' ? 'FOCUS' : 'BREAK'} SESSION</span></div>
                    <div className="focus-segment-tabs"><button className={timer.sessionType === 'focus' ? 'active' : ''} onClick={() => chooseSession('focus')}>Focus</button><button className={timer.sessionType === 'break' ? 'active' : ''} onClick={() => chooseSession('break')}>Break</button></div>
                    <div className="focus-dial" style={{ '--progress': `${Math.min(100, Math.max(0, progress * 100))}%` }}><div className="focus-dial-inner"><span className="focus-time">{formatTime(displaySeconds)}</span><span className="focus-time-caption">{timer.status === 'running' ? 'take a breath' : timer.status === 'paused' ? 'paused for now' : 'ready when you are'}</span></div></div>
                    <div className="focus-controls"><button className="button button-dark focus-start" onClick={toggleFocus}>{timer.status === 'running' ? <><Pause size={16} fill="currentColor" /> Pause session</> : timer.status === 'paused' ? <><Play size={16} fill="currentColor" /> Resume focus</> : <><Play size={16} fill="currentColor" /> Start focusing</>}</button><button className="icon-button reset-button" onClick={reset} aria-label="Reset timer"><RotateCcw size={17} /></button></div>
                    {audioError && <p className="form-error audio-error" role="status">{audioError} The timer will continue without sound.</p>}
                    <div className="focus-divider" />
                    <div className="preset-row"><span>SESSION LENGTH</span>{presets.map((preset) => <button className={currentPreset?.label === preset.label ? 'selected' : ''} key={preset.label} onClick={() => focusStart(preset.focus, preset.rest)}>{preset.label}<small>min</small></button>)}</div>
                </section>
                <aside className="focus-side">
                    <section className="surface-card focus-task-card"><span className="card-kicker">WHAT ARE YOU WORKING ON?</span><h2>{activeTask?.title || 'Choose a task to focus on'}</h2><p>{activeTask?.description || 'Your session can be just for you, or connected to one of your tasks.'}</p><label className="focus-task-select"><span>Link a task</span><select value={timer.taskId} onChange={(event) => selectTask(event.target.value)}><option value="">No task selected</option>{tasks.map((task) => <option value={task.id} key={task.id}>{task.title}</option>)}</select></label><Link to="/app/tasks" className="subtle-link">Browse all tasks <ArrowLeft size={13} /></Link></section>
                    <section className="focus-encouragement"><div className="encourage-spark"><Sparkles size={17} /></div><span className="card-kicker">A GENTLE REMINDER</span><p>“Almost everything will work again if you unplug it for a few minutes, including you.”</p><small>— Anne Lamott</small></section>
                    <div className="focus-session-info"><span><Timer size={15} /> Sessions stay local to this device.</span><span><Check size={14} /> A small step still counts.</span></div>
                </aside>
            </div>
        </div>
    )
}
