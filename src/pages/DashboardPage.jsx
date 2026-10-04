import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, Circle, Clock3, Flame, ListTodo, Plus, Sparkles, Target, Timer } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setTaskStatus } from '../store/slices/tasksSlice'
import { toggleHabitToday } from '../store/slices/habitsSlice'

const today = new Date().toISOString().slice(0, 10)
const dayLabel = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())
const greeting = () => {
    const hour = new Date().getHours()
    return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
}
const currentStreak = (habit) => {
    const dates = new Set(habit.completedDates)
    let count = 0
    const date = new Date()
    if (!dates.has(today)) date.setDate(date.getDate() - 1)
    while (dates.has(date.toISOString().slice(0, 10))) {
        count += 1
        date.setDate(date.getDate() - 1)
    }
    return count
}
const bestStreak = (habit) => {
    let current = 0
    let best = 0
    let previous = null
    for (const date of [...new Set(habit.completedDates)].sort()) {
        const timestamp = new Date(`${date}T00:00:00`).getTime()
        current = previous !== null && timestamp - previous === 86400000 ? current + 1 : 1
        best = Math.max(best, current)
        previous = timestamp
    }
    return best
}

export default function DashboardPage() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const tasks = useSelector((state) => state.tasks.items)
    const habits = useSelector((state) => state.habits.items)
    const activities = useSelector((state) => state.tasks.activity)
    const completedTasks = useMemo(() => tasks.filter((task) => task.status === 'DONE'), [tasks])
    const todayTasks = tasks.filter((task) => task.dueDate === today && task.status !== 'DONE')
    const todayHabits = habits.filter((habit) => habit.completedDates.includes(today)).length
    const focusMinutes = activities.filter((item) => item.type === 'FOCUS_COMPLETED' && item.createdAt.slice(0, 10) === today).reduce((sum, item) => sum + (item.minutes || 0), 0)
    const completionRate = tasks.length ? Math.round(completedTasks.length / tasks.length * 100) : 0
    const consistency = habits.length ? Math.round(todayHabits / habits.length * 100) : 0
    const focusScore = Math.min(100, Math.round(focusMinutes / 120 * 100))
    const deadlineEligibleTasks = completedTasks.filter((task) => task.dueDate)
    const deadlineTasks = deadlineEligibleTasks.filter((task) => task.completedAt && task.completedAt.slice(0, 10) <= task.dueDate)
    const deadlineScore = deadlineEligibleTasks.length ? Math.round(deadlineTasks.length / deadlineEligibleTasks.length * 100) : 100
    const score = Math.round(completionRate * 0.4 + consistency * 0.25 + focusScore * 0.2 + deadlineScore * 0.15)
    const weekly = useMemo(() => Array.from({ length: 7 }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - index))
        const iso = date.toISOString().slice(0, 10)
        return { label: new Intl.DateTimeFormat('en', { weekday: 'short' }).format(date), count: tasks.filter((task) => task.status === 'DONE' && task.completedAt?.slice(0, 10) === iso).length }
    }), [tasks])
    const maxWeek = Math.max(...weekly.map((day) => day.count), 1)
    const displayName = user?.name?.split(' ')[0] || 'there'

    return (
        <div className="page dashboard-page">
            <div className="page-heading dashboard-heading">
                <div><div className="eyebrow"><span className="eyebrow-dot" /> {dayLabel}</div><h1>{greeting()}, {displayName}<span className="heading-spark"> ✳</span></h1><p>Here’s your space to make today count.</p></div>
                <Link className="button button-dark" to="/app/tasks"><Plus size={16} /> Add a task</Link>
            </div>

            <section className="stats-grid" aria-label="Productivity overview">
                <StatCard icon={ListTodo} label="Total tasks" value={tasks.length} detail={`${tasks.length - completedTasks.length} still open`} tone="blue" />
                <StatCard icon={CheckCircle2} label="Completed" value={completedTasks.length} detail={`${completionRate}% of all tasks`} tone="green" />
                <StatCard icon={Target} label="Habits today" value={`${todayHabits}/${habits.length}`} detail="Small steps add up" tone="peach" />
                <StatCard icon={Timer} label="Focus today" value={focusMinutes < 60 ? `${focusMinutes}m` : `${Math.floor(focusMinutes / 60)}h${focusMinutes % 60 ? ` ${focusMinutes % 60}m` : ''}`} detail="From completed sessions" tone="purple" />
                <StatCard icon={Flame} label="Best streak" value={`${Math.max(0, ...habits.map(bestStreak))} days`} detail="Keep your rhythm" tone="purple" />
            </section>

            <section className="dashboard-main-grid">
                <div className="surface-card today-card">
                    <div className="card-heading"><div><span className="card-kicker">YOUR DAY</span><h2>Today’s focus</h2></div><Link to="/app/tasks" className="subtle-link">All tasks <ArrowRight size={14} /></Link></div>
                    {todayTasks.length ? <div className="today-task-list">{todayTasks.slice(0, 4).map((task) => <div className="today-task-row" key={task.id}><button className="round-check" onClick={() => dispatch(setTaskStatus({ id: task.id, status: 'DONE' }))} aria-label={`Complete ${task.title}`}><Circle size={17} /></button><div className="today-task-text"><b>{task.title}</b><span>{task.category || 'Uncategorized'} <i /> {task.dueDate === today ? 'Due today' : task.dueDate}</span></div><span className={`priority-pill priority-${task.priority.toLowerCase()}`}>{task.priority}</span></div>)}</div> : <div className="empty-state compact-empty"><div className="empty-icon"><Check size={19} /></div><b>Nothing due today.</b><span>Make space for something new or enjoy the breathing room.</span><Link to="/app/tasks">Plan a task <ArrowRight size={13} /></Link></div>}
                    <Link className="today-card-bottom" to="/app/tasks"><span><Clock3 size={14} /> {todayTasks.length} tasks need your attention today</span><ArrowUpRight size={15} /></Link>
                </div>

                <div className="surface-card score-card">
                    <div className="card-heading"><div><span className="card-kicker">A LITTLE PERSPECTIVE</span><h2>Productivity score</h2></div><div className="score-spark"><Sparkles size={15} /></div></div>
                    <div className="score-content"><div className="score-dial" style={{ '--score': `${score}%` }}><div><b>{score}</b><span>out of 100</span></div></div><div className="score-breakdown"><ScoreRow label="Tasks completed" value={completionRate} color="blue" /><ScoreRow label="Habit consistency" value={consistency} color="green" /><ScoreRow label="Focus time" value={focusScore} color="peach" /><ScoreRow label="Deadline discipline" value={deadlineScore} color="purple" /></div></div>
                    <div className="score-note"><Sparkles size={14} /><span>Task completion 40% · Habits 25% · Focus (2h target) 20% · Deadlines 15%.</span></div>
                </div>

                <div className="surface-card weekly-card">
                    <div className="card-heading"><div><span className="card-kicker">STEADY PROGRESS</span><h2>This week</h2></div><span className="chart-caption">Tasks completed</span></div>
                    <div className="weekly-chart" role="img" aria-label={`Tasks completed this week: ${weekly.map((day) => `${day.label} ${day.count}`).join(', ')}`}>{weekly.map((day, index) => <div className="chart-day" key={day.label}><span className="chart-value">{day.count || ''}</span><div className={`chart-track${index === 6 ? ' today' : ''}`}><i style={{ height: `${Math.max(day.count ? (day.count / maxWeek) * 100 : 6, 6)}%` }} /></div><span className="chart-label">{day.label}</span></div>)}</div>
                    <div className="chart-footer"><span><span className="chart-legend" />Completed tasks</span><span>{weekly.reduce((sum, day) => sum + day.count, 0)} this week</span></div>
                </div>

                <div className="surface-card habits-card">
                    <div className="card-heading"><div><span className="card-kicker">SHOW UP FOR YOURSELF</span><h2>Daily habits</h2></div><Link to="/app/habits" className="subtle-link">See all <ArrowRight size={14} /></Link></div>
                    {habits.length ? <div className="habit-mini-list">{habits.slice(0, 3).map((habit) => { const done = habit.completedDates.includes(today); return <button className={`habit-mini-row${done ? ' done' : ''}`} onClick={() => dispatch(toggleHabitToday(habit.id))} key={habit.id}><span className="habit-mini-check">{done && <Check size={13} />}</span><span className="habit-mini-copy"><b>{habit.name}</b><small>{habit.target || habit.category}</small></span><span className="habit-mini-streak"><Flame size={13} /> {currentStreak(habit)}</span></button> })}</div> : <div className="empty-state compact-empty"><div className="empty-icon"><Target size={18} /></div><b>Start with one small habit.</b><Link to="/app/habits">Add a habit <ArrowRight size={13} /></Link></div>}
                    <Link className="habits-footer" to="/app/habits"><span>{todayHabits} of {habits.length} completed today</span><span className="tiny-progress"><i style={{ width: `${habits.length ? todayHabits / habits.length * 100 : 0}%` }} /></span></Link>
                </div>
            </section>

            <section className="activity-section">
                <div className="section-heading-inline"><div><span className="card-kicker">KEEP THE MOMENTUM</span><h2>Recent activity</h2></div><Link to="/app/notifications" className="subtle-link">Notifications <ArrowRight size={14} /></Link></div>
                <div className="activity-list">{activities.slice(0, 3).map((item) => <div className="activity-row" key={item.id}><span className={`activity-icon ${item.type.toLowerCase()}`}>{item.type.includes('COMPLETED') ? <Check size={14} /> : item.type.includes('FOCUS') ? <Timer size={14} /> : <ListTodo size={14} />}</span><span className="activity-message">{item.message}</span><time>{new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date(item.createdAt))}</time></div>)}{!activities.length && <p className="muted-text">Your activity will show up here as you go.</p>}</div>
            </section>
        </div>
    )
}

function StatCard({ icon: Icon, label, value, detail, tone }) {
    return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={17} /></div><span className="stat-label">{label}</span><b className="stat-value">{value}</b><span className="stat-detail">{detail}</span></div>
}

function ScoreRow({ label, value, color }) {
    return <div className="score-row"><span>{label}</span><div className="score-bar"><i className={color} style={{ width: `${value}%` }} /></div><b>{value}</b></div>
}
