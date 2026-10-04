import { Bell, Check, CheckCheck, Clock3, Flame, ListTodo, Sparkles, Timer, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { clearNotifications, markAllNotificationsRead, markNotificationRead } from '../store/slices/notificationsSlice'

const iconFor = (type) => {
    if (type.includes('HABIT')) return Flame
    if (type.includes('TIMER') || type.includes('FOCUS')) return Timer
    if (type.includes('TASK')) return ListTodo
    if (type === 'SYSTEM') return Sparkles
    return Bell
}
const relativeTime = (value) => {
    const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000))
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
}

export default function NotificationsPage() {
    const items = useSelector((state) => state.notifications.items)
    const dispatch = useDispatch()
    const unreadCount = items.filter((item) => !item.read).length
    const clearAll = async () => {
        const result = await Swal.fire({ title: 'Clear all notifications?', text: 'This will remove your notification history from this device.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Clear all', cancelButtonText: 'Keep them', confirmButtonColor: '#b3473f', reverseButtons: true })
        if (result.isConfirmed) dispatch(clearNotifications())
    }

    return (
        <div className="page notifications-page">
            <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> A LITTLE NUDGE, WHEN IT HELPS</div><h1>Notifications<span className="heading-spark"> ✳</span></h1><p>Keep up with the moments that matter.</p></div><div className="notification-actions">{unreadCount > 0 && <button className="button button-quiet" onClick={() => dispatch(markAllNotificationsRead())}><CheckCheck size={15} /> Mark all read</button>}{items.length > 0 && <button className="button button-danger-ghost" onClick={clearAll}><Trash2 size={15} /> Clear all</button>}</div></div>
            <div className="notification-summary surface-card"><div className="notification-summary-icon"><Bell size={19} /></div><div><b>{unreadCount ? `${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}` : 'You’re all caught up'}</b><span>{items.length} updates in your notification history</span></div><span className="notification-summary-mark"><Check size={15} /></span></div>
            {items.length ? <section className="notification-list surface-card" aria-label="Notification history">{items.map((item) => { const Icon = iconFor(item.type); return <article className={`notification-item${item.read ? '' : ' unread'}`} key={item.id}><div className={`notification-type-icon type-${item.type.toLowerCase()}`}><Icon size={17} /></div><div className="notification-copy"><div className="notification-title-row"><h2>{item.title}</h2>{!item.read && <span className="unread-dot" />}</div><p>{item.message}</p><span className="notification-time"><Clock3 size={12} /> {relativeTime(item.createdAt)}</span></div><button className="notification-read-button" onClick={() => dispatch(markNotificationRead(item.id))} aria-label={item.read ? 'Already read' : `Mark ${item.title} as read`} disabled={item.read}>{item.read ? <Check size={16} /> : <span />}</button></article> })}</section> : <div className="surface-card notifications-empty"><div className="empty-icon"><Bell size={19} /></div><h2>A little quiet, for now.</h2><p>When something needs your attention, you’ll find it here.</p></div>}
            <p className="notification-footnote"><Sparkles size={14} /> Notifications are stored locally on this device.</p>
        </div>
    )
}
