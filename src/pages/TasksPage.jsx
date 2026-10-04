import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check, CheckCircle2, Circle, Clock3, Edit3, Filter, Plus, Search, Trash2, X } from 'lucide-react'
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../components/Modal'
import { addTask, deleteTask, moveTask, setTaskStatus, toggleSubtask, updateTask } from '../store/slices/tasksSlice'

const columns = [
    { id: 'TODO', title: 'To do', color: 'todo' },
    { id: 'IN_PROGRESS', title: 'In progress', color: 'progress' },
    { id: 'DONE', title: 'Done', color: 'done' },
]
const blankTask = { title: '', description: '', status: 'TODO', priority: 'MEDIUM', category: '', tags: '', dueDate: '', estimatedTime: '', reminder: '', recurring: 'none', subtasks: '' }
const today = new Date().toISOString().slice(0, 10)
const weekAgo = Date.now() - 7 * 86400000

export default function TasksPage() {
    const dispatch = useDispatch()
    const tasks = useSelector((state) => state.tasks.items)
    const [searchParams, setSearchParams] = useSearchParams()
    const [activeColumn, setActiveColumn] = useState('TODO')
    const [query, setQuery] = useState('')
    const [priorityFilter, setPriorityFilter] = useState('ALL')
    const [categoryFilter, setCategoryFilter] = useState('ALL')
    const [tagFilter, setTagFilter] = useState('ALL')
    const [dueFilter, setDueFilter] = useState('ALL')
    const [createdFilter, setCreatedFilter] = useState('ALL')
    const [sortBy, setSortBy] = useState('position')
    const [manualModalOpen, setManualModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(blankTask)
    const [formError, setFormError] = useState('')
    const [dragId, setDragId] = useState(null)

    const modalOpen = manualModalOpen || searchParams.get('new') === '1'
    const setModalOpen = (open) => {
        setManualModalOpen(open)
        if (!open && searchParams.has('new')) setSearchParams({}, { replace: true })
    }

    const categories = [...new Set(tasks.map((task) => task.category).filter(Boolean))]
    const tags = [...new Set(tasks.flatMap((task) => task.tags || []))]
    const filteredTasks = useMemo(() => tasks.filter((task) => {
        const matchesQuery = `${task.title} ${task.description} ${task.tags?.join(' ')}`.toLowerCase().includes(query.toLowerCase())
        const matchesDue = dueFilter === 'ALL' || (dueFilter === 'TODAY' && task.dueDate === today) || (dueFilter === 'OVERDUE' && task.dueDate && task.dueDate < today && task.status !== 'DONE') || (dueFilter === 'NO_DATE' && !task.dueDate)
        const createdThisWeek = new Date(task.createdAt).getTime() >= weekAgo
        return matchesQuery && matchesDue && (priorityFilter === 'ALL' || task.priority === priorityFilter) && (categoryFilter === 'ALL' || task.category === categoryFilter) && (tagFilter === 'ALL' || task.tags?.includes(tagFilter)) && (createdFilter === 'ALL' || createdThisWeek)
    }).sort((a, b) => {
        if (sortBy === 'priority') return ['URGENT', 'HIGH', 'MEDIUM', 'LOW'].indexOf(a.priority) - ['URGENT', 'HIGH', 'MEDIUM', 'LOW'].indexOf(b.priority)
        if (sortBy === 'dueDate') return (a.dueDate || '9999').localeCompare(b.dueDate || '9999')
        if (sortBy === 'newest') return b.createdAt.localeCompare(a.createdAt)
        if (sortBy === 'oldest') return a.createdAt.localeCompare(b.createdAt)
        return 0
    }), [tasks, query, priorityFilter, categoryFilter, tagFilter, dueFilter, createdFilter, sortBy])

    const openNew = () => { setEditing(null); setForm(blankTask); setFormError(''); setModalOpen(true) }
    const openEdit = (task) => {
        setEditing(task)
        setForm({ ...task, tags: (task.tags || []).join(', '), subtasks: (task.subtasks || []).join(', ') })
        setFormError('')
        setManualModalOpen(true)
    }
    const submit = (event) => {
        event.preventDefault()
        if (!form.title.trim()) { setFormError('Give your task a name before saving.'); return }
        const normalized = { ...form, title: form.title.trim(), tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean), subtasks: form.subtasks.split(',').map((item) => item.trim()).filter(Boolean), estimatedTime: Number(form.estimatedTime) || 0 }
        if (editing) dispatch(updateTask({ ...normalized, id: editing.id }))
        else dispatch(addTask(normalized))
        setModalOpen(false)
    }
    const removeTask = async (task) => {
        const result = await Swal.fire({ title: 'Delete this task?', text: 'This task will be removed from your workspace.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Delete task', cancelButtonText: 'Keep it', confirmButtonColor: '#b3473f', reverseButtons: true })
        if (result.isConfirmed) dispatch(deleteTask(task.id))
    }
    const filteredCount = filteredTasks.length

    return (
        <div className="page tasks-page">
            <div className="page-heading">
                <div><div className="eyebrow"><span className="eyebrow-dot" /> YOUR WORKSPACE</div><h1>My tasks<span className="heading-spark"> ✳</span></h1><p>A clear place for everything on your mind.</p></div>
                <button className="button button-dark" onClick={openNew}><Plus size={16} /> New task</button>
            </div>
            <div className="task-toolbar">
                <label className="task-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a task..." aria-label="Search tasks" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}</label>
                <div className="task-filters"><label><Filter size={14} /><select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} aria-label="Filter by priority"><option value="ALL">All priorities</option>{['URGENT', 'HIGH', 'MEDIUM', 'LOW'].map((priority) => <option key={priority}>{priority}</option>)}</select></label><label><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by category"><option value="ALL">All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label><select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} aria-label="Filter by tag"><option value="ALL">All tags</option>{tags.map((tag) => <option key={tag}>{tag}</option>)}</select></label><label><select value={dueFilter} onChange={(event) => setDueFilter(event.target.value)} aria-label="Filter by due date"><option value="ALL">Any due date</option><option value="TODAY">Due today</option><option value="OVERDUE">Overdue</option><option value="NO_DATE">No due date</option></select></label><label><select value={createdFilter} onChange={(event) => setCreatedFilter(event.target.value)} aria-label="Filter by creation date"><option value="ALL">Any time</option><option value="WEEK">Created this week</option></select></label><label><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort tasks"><option value="position">Default order</option><option value="priority">Priority</option><option value="dueDate">Due date</option><option value="newest">Newest</option><option value="oldest">Oldest</option></select></label></div>
            </div>
            <div className="mobile-column-tabs" role="tablist" aria-label="Task status">{columns.map((column) => <button role="tab" aria-selected={activeColumn === column.id} className={activeColumn === column.id ? 'active' : ''} key={column.id} onClick={() => setActiveColumn(column.id)}>{column.title}<span>{filteredTasks.filter((task) => task.status === column.id).length}</span></button>)}</div>
            <div className="task-board">{columns.map((column) => {
                const columnTasks = filteredTasks.filter((task) => task.status === column.id)
                return <section className={`task-column ${column.color}${activeColumn === column.id ? ' mobile-active' : ''}`} key={column.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (dragId) dispatch(moveTask({ taskId: dragId, status: column.id })); setDragId(null) }}>
                    <div className="column-heading"><div><span className={`column-status-dot ${column.color}`} /><h2>{column.title}</h2><span className="column-count">{columnTasks.length}</span></div><button className="icon-button small" aria-label={`Add task to ${column.title}`} onClick={() => { setForm({ ...blankTask, status: column.id }); setEditing(null); setManualModalOpen(true) }}><Plus size={16} /></button></div>
                    <div className="column-body">
                        {columnTasks.map((task) => <article key={task.id} className="task-card" draggable onDragStart={() => setDragId(task.id)} onDragEnd={() => setDragId(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); event.stopPropagation(); if (dragId && dragId !== task.id) dispatch(moveTask({ taskId: dragId, status: column.id, beforeId: task.id })); setDragId(null) }} onClick={() => openEdit(task)}>
                            <div className="task-card-head"><span className={`priority-pill priority-${task.priority.toLowerCase()}`}><i />{task.priority}</span><div className="task-card-actions"><button className="icon-button tiny" aria-label={`Edit ${task.title}`} onClick={(event) => { event.stopPropagation(); openEdit(task) }}><Edit3 size={14} /></button><button className="icon-button tiny" aria-label={`Delete ${task.title}`} onClick={(event) => { event.stopPropagation(); removeTask(task) }}><Trash2 size={14} /></button></div></div>
                            <button className="task-card-title" onClick={() => openEdit(task)}>{task.status === 'DONE' ? <Check className="task-done-check" size={15} /> : <Circle className="task-circle" size={15} />}<span>{task.title}</span></button>
                            {task.description && <p className="task-description">{task.description}</p>}
                            {task.tags?.length > 0 && <div className="task-tags">{task.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}</div>}
                            {task.subtasks?.length > 0 && <div className="task-subtasks">{task.subtasks.slice(0, 3).map((subtask, index) => { const isComplete = (task.completedSubtasks || []).includes(index); return <button key={`${task.id}-subtask-${index}`} className={isComplete ? 'subtask completed' : 'subtask'} onClick={(event) => { event.stopPropagation(); dispatch(toggleSubtask({ taskId: task.id, index })) }}><span>{isComplete ? <CheckCircle2 size={13} /> : <Circle size={13} />}</span>{subtask}</button> })}{task.subtasks.length > 3 && <span className="subtask-more">+{task.subtasks.length - 3} more</span>}</div>}
                            <div className="task-card-footer"><span>{task.dueDate ? <><Clock3 size={12} />{task.dueDate === new Date().toISOString().slice(0, 10) ? 'Today' : new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${task.dueDate}T12:00:00`))}</> : task.category || 'No date'}</span><select aria-label={`Change ${task.title} status`} value={task.status} onClick={(event) => event.stopPropagation()} onChange={(event) => dispatch(setTaskStatus({ id: task.id, status: event.target.value }))}><option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="DONE">Done</option></select></div>
                        </article>)}
                        {columnTasks.length === 0 && <div className="column-empty"><span className="empty-column-icon">{column.id === 'DONE' ? <Check size={15} /> : <Circle size={14} />}</span><span>{query || priorityFilter !== 'ALL' || categoryFilter !== 'ALL' ? 'No tasks match these filters.' : column.id === 'TODO' ? 'A little space for what’s next.' : column.id === 'IN_PROGRESS' ? 'Nothing in progress yet.' : 'Your wins will show up here.'}</span></div>}
                        {column.id === 'TODO' && <button className="add-task-inline" onClick={openNew}><Plus size={15} /> Add a task</button>}
                    </div>
                </section>
            })}</div>
            <div className="tasks-bottom-note"><span><Circle size={13} /> Drag cards between columns to move them.</span><span>{filteredCount} {filteredCount === 1 ? 'task' : 'tasks'} in view</span></div>

            <Modal title={editing ? 'A few details' : 'Add a task'} description={editing ? 'Make changes to keep this task up to date.' : 'Get it out of your head and into your day.'} open={modalOpen} onOpenChange={setModalOpen} wide>
                <form className="task-form" onSubmit={submit}>
                    <label className="form-full">Task name<input autoFocus value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="What needs to get done?" /></label>
                    <label className="form-full">A little context<textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Add a note to future you..." /></label>
                    <label>Priority<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>{['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((priority) => <option key={priority}>{priority}</option>)}</select></label>
                    <label>Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>{columns.map((column) => <option key={column.id} value={column.id}>{column.title}</option>)}</select></label>
                    <label>Category<input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="e.g. Personal" /></label>
                    <label>Due date<input type="date" value={form.dueDate || ''} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} /></label>
                    <label>Estimate (minutes)<input type="number" min="0" value={form.estimatedTime || ''} onChange={(event) => setForm({ ...form, estimatedTime: event.target.value })} placeholder="30" /></label>
                    <label>Reminder<input type="datetime-local" value={form.reminder || ''} onChange={(event) => setForm({ ...form, reminder: event.target.value })} /></label>
                    <label>Repeat<select value={form.recurring || 'none'} onChange={(event) => setForm({ ...form, recurring: event.target.value })}><option value="none">Does not repeat</option><option value="daily">Every day</option><option value="weekly">Every week</option><option value="monthly">Every month</option></select></label>
                    <label>Tags <small>(comma separated)</small><input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="work, important" /></label>
                    <label className="form-full">Subtasks <small>(comma separated)</small><input value={form.subtasks} onChange={(event) => setForm({ ...form, subtasks: event.target.value })} placeholder="First step, another small step" /></label>
                    {formError && <p className="form-error form-full" role="alert">{formError}</p>}
                    <div className="form-actions form-full">{editing && <button type="button" className="button button-danger-ghost" onClick={() => removeTask(editing)}><Trash2 size={15} /> Delete</button>}<button type="button" className="button button-quiet" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="button button-dark">{editing ? 'Save changes' : 'Create task'}</button></div>
                </form>
            </Modal>
        </div>
    )
}
