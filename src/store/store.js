import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import habitsReducer from './slices/habitsSlice'
import notificationsReducer from './slices/notificationsSlice'
import settingsReducer from './slices/settingsSlice'
import tasksReducer from './slices/tasksSlice'
import timerReducer from './slices/timerSlice'
import { listenerMiddleware } from './listeners'
import { activityRepository, habitRepository, notificationRepository, settingsRepository, taskRepository, timerRepository, userRepository } from '../services/repositories'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    habits: habitsReducer,
    notifications: notificationsReducer,
    settings: settingsReducer,
    timer: timerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  preloadedState: {
    auth: { user: userRepository.get() },
    tasks: { items: taskRepository.getAll(), activity: activityRepository.getAll() },
    habits: { items: habitRepository.getAll() },
    notifications: { items: notificationRepository.getAll() },
    settings: settingsRepository.get(),
    timer: timerRepository.get(),
  },
})

store.subscribe(() => {
  const state = store.getState()
  taskRepository.saveAll(state.tasks.items)
  activityRepository.saveAll(state.tasks.activity)
  habitRepository.saveAll(state.habits.items)
  notificationRepository.saveAll(state.notifications.items)
  settingsRepository.save(state.settings)
  timerRepository.save(state.timer)
  if (state.auth.user) userRepository.save(state.auth.user)
})
