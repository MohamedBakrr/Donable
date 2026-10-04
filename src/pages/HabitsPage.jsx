import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Flame, Plus, Target, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../components/Modal'
import { addHabit, deleteHabit, toggleHabitToday } from '../store/slices/habitsSlice'

const today = new Date().toISOString().slice(0, 10)
const initialHabit = { name: '', description: '', category: 'Wellbeing', frequency: 'Daily', target: '', reminder: '' }
const streakFor = (habit) => {
    const completed = new Set(habit.completedDates)
    const cursor = new Date()
    if (!completed.has(today)) cursor.setDate(cursor.getDate() - 1)
    let streak = 0
    while (completed.has(cursor.toISOString().slice(0, 10))) {
        streak += 1
        cursor.setDate(cursor.getDate() - 1)
    }
    return streak
}
const lastSeven = (habit) => Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const key = date.toISOString().slice(0, 10)
    return { key, label: new Intl.DateTimeFormat('en', { weekday: 'narrow' }).format(date), checked: habit.completedDates.includes(key) }
})

export default function HabitsPage() {
    const habits = useSelector((state) => state.habits.items)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState(initialHabit)
    const [error, setError] = useState('')
    const completed = habits.filter((habit) => habit.completedDates.includes(today)).length
    const saveHabit = (event) => {
        event.preventDefault()
        if (!form.name.trim()) { setError('Give your habit a name first.'); return }
        dispatch(addHabit({ ...form, name: form.name.trim() }))
        setForm(initialHabit)
        setOpen(false)
        setError('')
    }
    const remove = async (habit) => {
        const result = await Swal.fire({ title: 'Remove this habit?', text: 'Your saved habit history will be removed too.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Remove habit', cancelButtonText: 'Keep it', confirmButtonColor: '#b3473f', reverseButtons: true })
        if (result.isConfirmed) dispatch(deleteHabit(habit.id))
    }

    return (
        <div className="page habits-page">
            <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> BUILT ONE DAY AT A TIME</div><h1>Daily habits<span className="heading-spark"> ✳</span></h1><p>Consistency is a practice, not a finish line.</p></div><button className="button button-dark" onClick={() => { setForm(initialHabit); setOpen(true) }}><Plus size={16} /> New habit</button></div>
            <section className="habit-summary surface-card"><div className="habit-summary-copy"><span className="card-kicker">TODAY, AT YOUR PACE</span><h2>{completed === habits.length && habits.length ? 'You showed up for yourself.' : 'A little progress is still progress.'}</h2><p>{completed} of {habits.length} habits completed today</p><div className="habit-summary-progress"><i style={{ width: `${habits.length ? completed / habits.length * 100 : 0}%` }} /></div></div><div className="habit-summary-mark"><Target size={24} /><span>{habits.length ? Math.round(completed / habits.length * 100) : 0}<small>%</small></span></div></section>
            {habits.length === 0 ? <div className="surface-card habits-empty"><div className="empty-icon"><Target size={20} /></div><h2>Start small. Start anywhere.</h2><p>Add the first tiny practice you want to bring into your day.</p><button className="button button-dark" onClick={() => setOpen(true)}><Plus size={15} /> Create a habit</button></div> : <div className="habit-grid">{habits.map((habit, index) => {
                const streak = streakFor(habit)
                const isDone = habit.completedDates.includes(today)
                const history = lastSeven(habit)
                const elapsedDays = Math.max(1, Math.ceil((new Date(`${today}T00:00:00`).getTime() - new Date(`${habit.createdAt}T00:00:00`).getTime()) / 86400000) + 1)
                const rate = habit.completedDates.length ? Math.min(100, Math.round(habit.completedDates.length / elapsedDays * 100)) : 0
                return <motion.article className={`habit-card surface-card habit-tone-${index % 3}`} key={habit.id} layout initial={{ y: 9 }} animate={{ y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.22 }}>
                    <div className="habit-card-top"><div className={`habit-symbol habit-symbol-${index % 3}`}><Target size={18} /></div><button className="icon-button small" aria-label={`Remove ${habit.name}`} onClick={() => remove(habit)}><Trash2 size={15} /></button></div>
                    <span className="habit-category">{habit.category || 'Personal'} <i /> {habit.frequency || 'Daily'}</span>
                    <h2>{habit.name}</h2><p>{habit.description || 'A small step toward a more intentional day.'}</p>
                    <div className="habit-week">{history.map((day) => <div key={day.key} className="habit-day"><span>{day.label}</span><span className={`habit-day-dot${day.checked ? ' checked' : ''}${day.key === today ? ' current' : ''}`}>{day.checked && <Check size={11} />}</span></div>)}</div>
                    <div className="habit-card-stats"><span className="streak-stat"><Flame size={14} /> {streak} day streak</span><span>{rate}% consistency</span></div>
                    <button className={`habit-check-button${isDone ? ' completed' : ''}`} onClick={() => dispatch(toggleHabitToday(habit.id))}>{isDone ? <><Check size={15} /> Completed today</> : <>Mark today complete <Check size={15} /></>}</button>
                </motion.article>
            })}</div>}
            <div className="habit-footnote"><span>✳</span> Missed a day? You haven’t lost your progress. Begin again today.</div>
            <Modal title="Start a new habit" description="Make it small enough to show up for." open={open} onOpenChange={setOpen}>
                <form className="habit-form" onSubmit={saveHabit}>
                    <label>Habit name<input autoFocus value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Take a mindful walk" /></label>
                    <label>A little context<textarea rows="2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Why does this matter to you?" /></label>
                    <div className="form-row"><label>Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Wellbeing</option><option>Learning</option><option>Productivity</option><option>Personal</option></select></label><label>Frequency<select value={form.frequency} onChange={(event) => setForm({ ...form, frequency: event.target.value })}><option>Daily</option><option>Weekly</option></select></label></div>
                    <div className="form-row"><label>Your target<input value={form.target} onChange={(event) => setForm({ ...form, target: event.target.value })} placeholder="e.g. 20 minutes" /></label><label>Reminder<input type="time" value={form.reminder} onChange={(event) => setForm({ ...form, reminder: event.target.value })} /></label></div>
                    {error && <p className="form-error" role="alert">{error}</p>}
                    <div className="form-actions"><button type="button" className="button button-quiet" onClick={() => setOpen(false)}>Cancel</button><button className="button button-dark" type="submit">Create habit</button></div>
                </form>
            </Modal>
        </div>
    )
}
