أيوه، كده نقدر نطلع **Donable** كـ product حقيقي، مش مجرد Todo UI. وأنا هتعامل معاه من البداية كأنه **Portfolio-grade SaaS product** قابل إنك تحوله لاحقًا لـ Full Stack بدون ما تهد الـ frontend architecture.

# Donable — Project Plan

> **Product concept:**
> **Donable** is a personal productivity platform that combines task management, habits, time management, focus sessions, notifications, analytics, and productivity history in one mobile-first experience.

---

# 1. Product Vision

الفكرة الأساسية:

```text
                    DONABLE
                       │
        ┌──────────────┼──────────────┐
        │              │              │
       Tasks         Habits         Time
        │              │              │
        └──────────────┼──────────────┘
                       │
                   Analytics
                       │
                  Productivity
```

بدل ما يكون:

> Todo App

يكون:

> **Personal Productivity Operating System**

المستخدم يدخل Donable ويقدر يعرف:

* إيه اللي عليه النهارده
* إيه اللي خلصه
* إيه اللي متأخر
* عاداته ماشية إزاي
* هو productive قد إيه
* قضى وقت قد إيه في الـ tasks
* إيه الـ streaks بتاعته
* إيه اللي محتاج يعمله دلوقتي
* تاريخه وإحصائياته

---

# 2. Technology Stack

## Core

```text
React
Vite
React Router
JavaScript / TypeScript
```

أنا أرشح **TypeScript** للمشروع.

خصوصًا إن المشروع فيه entities كثيرة:

```text
User
Task
Habit
Notification
Timer
Activity
Analytics
Settings
```

وده هيخلي الـ architecture أكثر أمانًا وقابلية للتوسع.

Vite مناسب جدًا كبداية React app، وReact Router يدعم أكثر من أسلوب routing، بما فيها declarative/data/framework modes. ([React Router][1])

---

# 3. UI Stack

أنت اخترت:

```text
Tailwind CSS
Material UI
Radix UI
Lucide React
Motion / Framer Motion
SweetAlert2
```

لكن لازم نحط **responsibilities واضحة**.

## Tailwind

استخدامه الأساسي:

```text
Layout
Spacing
Responsive design
Colors
Typography
Grid
Flex
Cards
Utilities
```

Tailwind حاليًا يوفر تكاملًا مباشرًا مع Vite عن طريق `@tailwindcss/vite`. ([Tailwind CSS][2])

---

## Radix UI

للـ primitives اللي محتاجة accessibility وسلوك معقد:

```text
Dialog
Dropdown
Popover
Tooltip
Tabs
Select
Checkbox
Switch
Scroll Area
Alert Dialog
```

Radix أساسًا عبارة عن accessible unstyled primitives، وده مناسب جدًا لو عايز Donable له design system خاص به. ([Radix UI][3])

---

## Material UI

استخدمه فقط عندما يكون component complex ومفيد out-of-the-box:

```text
Date Picker
Data-heavy UI
Progress
Some advanced controls
```

**مش هنعمل UI كامل بـ MUI.**

---

## Lucide

كل الـ icons:

```text
Plus
Check
Trash
Edit
Calendar
Clock
Bell
Settings
Search
Menu
Arrow
```

---

## Motion

Animations:

```text
Page transitions
Task movement
Card entrance
Modal transitions
Dashboard charts entrance
Micro interactions
Drag feedback
Mobile navigation
```

Motion يقدر يتكامل مع Radix primitives باستخدام `asChild` و`AnimatePresence`، وده مناسب جدًا للـ polished UI اللي عايزه. ([Motion][4])

---

## SweetAlert2

استخدمه فقط في:

```text
Delete confirmation
Dangerous actions
Success feedback
Important confirmations
```

مش كل notification.

---

# 4. State Management

استخدم:

```text
Redux Toolkit
```

والـ store يتقسم:

```text
store/
├── authSlice
├── taskSlice
├── habitSlice
├── notificationSlice
├── timerSlice
├── settingsSlice
└── uiSlice
```

لكن فيه قاعدة مهمة:

### Redux ≠ كل state في التطبيق

مثلاً:

```text
Redux
↓
Global application state
```

بينما:

```text
useState
↓
Local component state
```

مثال:

```text
isTaskModalOpen
```

مش محتاج Redux.

لكن:

```text
currentUser
tasks
habits
notifications
activeTimer
theme
```

ينفعوا في Redux.

---

# 5. Server State

رغم إن النسخة الأولى JSON-based، صمم abstraction من البداية:

```text
UI
 ↓
Service Layer
 ↓
Repository
 ↓
JSON
```

مستقبلاً:

```text
UI
 ↓
Service Layer
 ↓
Repository
 ↓
Axios
 ↓
Serverless Node.js
 ↓
MongoDB
```

وده قرار مهم جدًا.

يعني component ما يعملش:

```js
axios.get(...)
```

مباشرة.

بدلًا من ذلك:

```text
TaskPage
   ↓
taskService
   ↓
taskRepository
```

وبالتالي لما تنتقل للـ backend، التغيير الأساسي يحصل في الـ repository/service layer.

---

# 6. Axios

اعمل:

```text
src/services/api/
```

وبعدين:

```text
apiClient.ts
```

فيه:

```text
baseURL
interceptors
error handling
authentication preparation
```

حاليًا ممكن يكون:

```text
mock/json repository
```

مستقبلاً:

```text
axios repository
```

---

# 7. Data Architecture

## User

```ts
User {
  id
  name
  email
  avatar
  createdAt
  settings
}
```

---

# 8. Task Model

الـ Task لازم تكون rich من البداية:

```ts
Task {
  id
  userId

  title
  description

  status
  priority

  category
  tags

  dueDate
  startDate

  estimatedTime
  actualTime

  subtasks

  reminder

  recurring

  createdAt
  updatedAt
  completedAt

  position
}
```

Status:

```text
TODO
IN_PROGRESS
DONE
```

Priority:

```text
LOW
MEDIUM
HIGH
URGENT
```

---

# 9. Todo Board

الشكل الأساسي:

```text
┌─────────────┬─────────────┬─────────────┐
│    TODO     │ IN PROGRESS │    DONE     │
├─────────────┼─────────────┼─────────────┤
│             │             │             │
│   Task      │   Task      │   Task      │
│   Task      │   Task      │   Task      │
│   Task      │             │   Task      │
│             │             │             │
└─────────────┴─────────────┴─────────────┘
```

لكن **drag & drop يكون global**.

يعني:

```text
TODO → TODO
TODO → IN PROGRESS
TODO → DONE

IN PROGRESS → TODO
IN PROGRESS → IN PROGRESS
IN PROGRESS → DONE

DONE → TODO
DONE → IN PROGRESS
DONE → DONE
```

وكمان reorder داخل نفس الـ column.

---

# 10. Click Status Change

الـ Task نفسها يكون فيها quick action.

مثلاً:

```text
○ Todo

↓ click

◐ In Progress

↓ click

✓ Done
```

لكن لازم يكون فيه أيضًا:

```text
Task Menu
   ↓
Change Status
   ↓
Todo
In Progress
Done
```

وده مهم للـ accessibility والموبايل.

---

# 11. Mobile Todo UX

دي نقطة مهمة جدًا في Donable.

على Desktop:

```text
┌───────┬──────────────┬───────┐
│ Todo  │ In Progress  │ Done  │
└───────┴──────────────┴───────┘
```

على Mobile **ما تحاولش تصغر الـ 3 columns**.

نعمل:

```text
┌───────────────────────┐
│ Tasks                 │
│                       │
│ [Todo] [Progress] [Done]
│                       │
│ ┌───────────────────┐ │
│ │ Build Portfolio   │ │
│ │ High • Today      │ │
│ └───────────────────┘ │
│                       │
└───────────────────────┘
```

مع:

```text
horizontal status tabs
```

والـ task cards تكون touch-friendly.

---

# 12. Task Details

لما تضغط على task:

```text
Task Details
────────────────────

Build Portfolio

Description

Priority
HIGH

Status
IN PROGRESS

Due
Oct 5

Estimated
2h

Actual
1h 20m

Subtasks
☑ Navbar
☑ Hero
□ Projects
□ Contact

Tags
#portfolio #react
```

---

# 13. Dashboard

الـ Dashboard هي قلب Donable.

## Overview

```text
Good morning, Mohamed

Here's your productivity overview.
```

ثم:

```text
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Tasks    │ │ Completed│ │ Habits   │ │ Streak   │
│ 24       │ │ 18       │ │ 6        │ │ 12 days  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

---

# 14. Productivity Analytics

### Daily

```text
Tasks completed
Tasks created
Completion rate
Focus time
Habit completion
```

### Weekly

```text
Mon █████
Tue ███████
Wed ███
Thu ████████
Fri █████
Sat ██
Sun ██████
```

### Monthly

```text
Tasks
Habits
Focus
Completion
```

---

# 15. Productivity Score

اعمل score داخلي:

```text
Productivity Score
        87
       /100
```

لكن **ما تخليش الرقم عشوائي**.

مثلاً:

```text
Task Completion      40%
Habit Consistency    25%
Focus Time           20%
Deadline Discipline  15%
```

والـ algorithm يبقى documented.

---

# 16. History

صفحة:

```text
Activity History
```

مثلاً:

```text
Today

✓ Completed "Build Navbar"
  10:42 AM

↻ Moved "Study Algorithms"
  11:20 AM

✓ Completed "Read 20 pages"
  1:15 PM

⏱ Focus session
  45 minutes
```

وده يفتح الباب بعدين لـ:

```text
Timeline
Calendar Heatmap
Productivity Trends
```

---

# 17. Habits

Habit entity:

```ts
Habit {
  id
  userId

  name
  description

  frequency
  target

  category

  reminder

  currentStreak
  bestStreak

  createdAt
}
```

---

# 18. Habit UI

مثلاً:

```text
Daily Habits

┌──────────────────────────┐
│ Read                      │
│ 30 minutes                │
│                           │
│ M T W T F S S             │
│ ✓ ✓ ✓ ✓ ✓ ○ ○             │
│                           │
│ 🔥 12 day streak          │
└──────────────────────────┘
```

---

# 19. Habit Analytics

لكل habit:

```text
Current streak
Best streak
Completion rate
Weekly consistency
Monthly consistency
Missed days
Total completions
```

---

# 20. Calendar

أنا أوصي إن Calendar يكون جزء أساسي.

يعرض:

```text
Tasks
Habits
Deadlines
Reminders
Focus sessions
```

مثلاً:

```text
October 2026

Mo Tu We Th Fr Sa Su
       1  2  3  4
 5  6  7  8  9 10 11
12 13 14 15 16 17 18
```

ويظهر activity indicators.

---

# 21. Time Management

Donable هيبقى فيه:

## Pomodoro

```text
25:00

FOCUS

[ Pause ]

Task:
Build Donable
```

Presets:

```text
25 / 5
50 / 10
90 / 20
Custom
```

---

# 22. Time Tracking

الـ user يقدر يعمل:

```text
Start Focus
     ↓
Task
     ↓
Timer
     ↓
Stop
     ↓
actualTime
```

وبالتالي:

```text
Estimated: 60 min
Actual:    82 min
```

والـ dashboard تستخدم البيانات دي.

---

# 23. Focus Mode

ميزة مهمة جدًا.

```text
Focus Mode
```

تخفي كل الـ distractions:

```text
DONABLE

25:00

Build React Dashboard

        [ Pause ]

        [ Exit Focus ]
```

بدون sidebar مزدحم.

---

# 24. Notifications

Notification Center:

```text
🔔

Notifications

Today

⏰ Task due in 30 minutes
Build Dashboard

🔥 Habit streak
12 days

✓ Task completed

Focus session finished
```

أنواع notifications:

```text
TASK_REMINDER
TASK_DUE
HABIT_REMINDER
HABIT_STREAK
TIMER_COMPLETE
SYSTEM
```

---

# 25. Browser Notifications

مستقبلاً:

```text
Browser Notification
```

لكن اعمل abstraction:

```text
notificationService
```

بحيث تقدر بعدين تضيف:

```text
Browser
Email
Push
```

بدون تغيير الـ UI.

---

# 26. Search

Global search:

```text
⌘ K
```

أو:

```text
Ctrl + K
```

يفتح:

```text
Search Donable

Tasks
Habits
Pages
Actions
```

مثلاً:

```text
> build
```

النتيجة:

```text
Task
Build Portfolio

Task
Build Dashboard
```

---

# 27. Filters

في Tasks:

```text
Status
Priority
Category
Tag
Due date
Created date
```

Sort:

```text
Newest
Oldest
Priority
Due date
Recently updated
```

---

# 28. Goals

أضف:

```text
Daily Goals
Weekly Goals
```

مثلاً:

```text
Today's Goals

✓ Complete 3 tasks
✓ 30 min reading
○ 2 focus sessions

Progress
████████░░ 80%
```

---

# 29. Daily Review

في نهاية اليوم:

```text
Daily Review

Tasks completed       7
Focus time            2h 40m
Habits completed      5/6

What went well?
What should improve?

Tomorrow's priorities
```

دي من features اللي تميز Donable عن Todo app عادي.

---

# 30. Landing Page

التصميم:

**Vercel-inspired وليس clone.**

Visual language:

```text
Black / White
Grid
Huge typography
Thin borders
Subtle gradients
Glow
Minimal cards
High contrast
Lots of whitespace
```

---

## Landing structure

```text
Navbar
│
├── Logo
├── Features
├── Product
├── Pricing
├── About
├── Login
└── Get Started
```

Hero:

```text
YOUR DAY.
YOUR TASKS.
YOUR MOMENTUM.

Everything you need
to get things done.

[ Get Started ]
[ Explore Donable ]
```

ثم:

```text
Product Preview
```

---

# 31. Landing Sections

```text
Hero
↓
Product Preview
↓
Tasks
↓
Habits
↓
Time Management
↓
Analytics
↓
Focus Mode
↓
Testimonials
↓
CTA
↓
Footer
```

لكن ما نعملش sections تقليدية جدًا.

نستخدم:

```text
scroll animations
sticky sections
large typography
interactive cards
subtle motion
```

---

# 32. Dark / Light

الـ design tokens لازم تكون centralized.

مثلاً:

```text
Background
Foreground
Muted
Border
Primary
Danger
Success
Warning
Card
Surface
```

ثم:

```text
Dark Theme
Light Theme
```

بدون hardcoded colors في كل component.

---

# 33. Design System

اعمل:

```text
components/ui
```

وفيه:

```text
Button
Input
Textarea
Badge
Card
Avatar
Modal
Dropdown
Tooltip
Tabs
Progress
Skeleton
EmptyState
Spinner
```

ثم components خاصة بـ Donable:

```text
TaskCard
HabitCard
TimerCard
StatCard
NotificationItem
ActivityItem
```

---

# 34. Project Architecture

أرشح architecture feature-based:

```text
src/
│
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers/
│
├── assets/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── features/
│   ├── auth/
│   ├── tasks/
│   ├── habits/
│   ├── dashboard/
│   ├── timer/
│   ├── notifications/
│   ├── calendar/
│   ├── search/
│   └── settings/
│
├── pages/
│   ├── landing/
│   ├── auth/
│   └── app/
│
├── store/
│   ├── store.ts
│   └── slices/
│
├── services/
│   ├── api/
│   ├── repositories/
│   └── notifications/
│
├── data/
│   ├── mock/
│   └── seed/
│
├── hooks/
│
├── utils/
│
├── types/
│
├── constants/
│
├── lib/
│
└── styles/
```

---

# 35. Routes

```text
/
├── /
├── /features
├── /login
├── /signup
│
└── /app
    ├── /dashboard
    ├── /tasks
    ├── /habits
    ├── /calendar
    ├── /focus
    ├── /notifications
    ├── /history
    └── /settings
```

Profile:

```text
/app/profile
```

---

# 36. Application Layout

Desktop:

```text
┌─────────────────────────────────────────────┐
│ Topbar                                      │
├────────────┬────────────────────────────────┤
│            │                                │
│ Sidebar    │            Content             │
│            │                                │
│ Dashboard  │                                │
│ Tasks      │                                │
│ Habits     │                                │
│ Calendar   │                                │
│ Focus      │                                │
│ History    │                                │
│            │                                │
│ Settings   │                                │
└────────────┴────────────────────────────────┘
```

Mobile:

```text
┌─────────────────────┐
│ Header              │
├─────────────────────┤
│                     │
│ Content             │
│                     │
│                     │
├─────────────────────┤
│ Dashboard Tasks     │
│ Habits    Focus     │
└─────────────────────┘
```

**Mobile navigation يكون Bottom Navigation.**

وده هيخلي التطبيق أقرب لتجربة native app.

---

# 37. Mobile-first Rule

أي component يتصمم:

```text
Mobile
↓
Tablet
↓
Desktop
```

وليس العكس.

Mobile لازم يكون:

* touch-friendly
* bottom navigation
* swipe gestures حيث مفيدة
* sheets بدل modals الثقيلة
* large tap targets
* compact cards
* sticky actions
* smooth transitions

---

# 38. Drag & Drop Architecture

ما تربطش الـ drag/drop مباشرة بالـ Redux.

اعمل:

```text
DragStart
   ↓
DragOver
   ↓
Drop
   ↓
validate destination
   ↓
calculate new position
   ↓
dispatch(moveTask)
   ↓
persist
```

وللموبايل:

```text
tap
long press
swipe
```

بحيث الـ functionality لا تعتمد على mouse فقط.

---

# 39. JSON Data

في البداية:

```text
src/data/mock/
```

مثلاً:

```text
users.json
tasks.json
habits.json
notifications.json
activities.json
```

لكن **ما تخليش components تقرأ JSON مباشرة**.

بدل:

```js
import tasks from "./tasks.json";
```

داخل component.

اعمل:

```text
taskRepository.getAll()
```

---

# 40. Repository Layer

```text
repositories/
├── taskRepository.ts
├── habitRepository.ts
├── userRepository.ts
├── notificationRepository.ts
└── activityRepository.ts
```

النسخة الأولى:

```text
JsonTaskRepository
```

مستقبلاً:

```text
MongoTaskRepository
```

والـ UI مش هيفرق معاه.

---

# 41. Future Backend

بعد كده:

```text
React
   ↓
Axios
   ↓
Serverless Node.js
   ↓
API
   ↓
MongoDB
```

مثلاً:

```text
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id

GET    /api/habits
POST   /api/habits

GET    /api/notifications
PATCH  /api/notifications/:id/read
```

React Router نفسه يمكن استخدامه كتطبيق SPA أو مع بيئات full-stack، لذلك الـ frontend architecture دي لا تقف في طريق الانتقال لاحقًا. ([React Router][5])

---

# 42. Authentication Future

النسخة الأولى:

```text
Mock Auth
```

لكن interface:

```text
authService.login()
authService.logout()
authService.getCurrentUser()
```

مستقبلاً:

```text
POST /auth/login
POST /auth/register
POST /auth/logout
GET  /auth/me
```

---

# 43. Settings

```text
Profile
Appearance
Notifications
Productivity
Timer
Privacy
Data
```

Appearance:

```text
Theme
├── Light
├── Dark
└── System
```

Timer:

```text
Focus duration
Short break
Long break
Auto-start
Sound
```

Notifications:

```text
Task reminders
Habit reminders
Timer notifications
Browser notifications
```

---

# 44. Accessibility

مهم جدًا:

```text
Keyboard navigation
Focus states
ARIA
Screen reader support
Reduced motion
Color contrast
Touch targets
```

Radix مناسب جدًا للجزء ده لأنه مبني كـ accessible primitives. ([Radix UI][3])

---

# 45. Performance

من البداية:

```text
Lazy loaded routes
Code splitting
Memoization where needed
Virtualization if history becomes large
Optimized images
No unnecessary Redux state
Debounced search
Efficient drag/drop updates
```

React Router framework/data capabilities تتضمن code-splitting في framework mode، لكن بما إنك بدأت بـ Vite SPA، نستخدم route-level lazy loading بشكل واضح بدل إدخال framework mode بدون احتياج. ([React Router][6])

---

# 46. UX Principles

Donable لازم يمشي على 5 قواعد:

### 1. Fast

المستخدم يعمل action بأقل clicks.

### 2. Clear

كل action نتيجته واضحة.

### 3. Calm

مفيش 100 لون و100 animation.

### 4. Mobile-first

الموبايل مش نسخة مصغرة من desktop.

### 5. Data-driven

كل activity مفيدة للـ analytics.

---

# 47. Animation Rules

Animation مش لمجرد animation.

استخدم:

```text
Page enter
Card enter
Hover
Press
Drag
Modal
Toast
Progress
Success
```

وتجنب:

```text
constant floating
excessive parallax
long transitions
animation everywhere
```

Radix نفسه يسمح بإضافة CSS أو JavaScript animation، وMotion يوفر تكاملًا مناسبًا مع Radix للـ mount/unmount والـ layout animations. ([Radix UI][7])

---

# 48. Development Phases

## Phase 0 — Foundation

```text
Vite
React
TypeScript
Tailwind
Router
Redux Toolkit
MUI
Radix
Lucide
Motion
Axios
SweetAlert2
```

ثم:

```text
ESLint
Prettier
aliases
environment variables
folder architecture
theme system
```

---

# 49. Phase 1 — Design System

ابني:

```text
Button
Input
Card
Badge
Dialog
Dropdown
Tabs
Tooltip
Avatar
Skeleton
Empty State
```

ثم:

```text
AppShell
Sidebar
Topbar
BottomNavigation
```

**ما تبدأش بالـ dashboard قبل ما الـ design system يثبت.**

---

# 50. Phase 2 — Landing

ابني:

```text
Navbar
Hero
Product Preview
Features
Tasks
Habits
Analytics
Focus
CTA
Footer
```

مع:

```text
responsive
dark/light
Motion
Vercel-inspired visual language
```

---

# 51. Phase 3 — Auth

```text
Login
Signup
Profile
Settings
Mock authentication
Protected routes
```

---

# 52. Phase 4 — Todo Core

أهم phase.

```text
Task CRUD
Status
Priority
Tags
Categories
Due dates
Subtasks
Search
Filter
Sort
```

ثم:

```text
Drag & Drop
Reordering
Quick status change
Task details
```

---

# 53. Phase 5 — Dashboard

```text
Overview
Stats
Charts
Completion rate
Productivity score
Activity
Weekly analytics
Monthly analytics
```

---

# 54. Phase 6 — Habits

```text
Habit CRUD
Frequency
Target
Streak
Calendar
History
Analytics
Reminders
```

---

# 55. Phase 7 — Time Management

```text
Pomodoro
Custom timer
Focus mode
Task tracking
Actual time
Focus history
```

---

# 56. Phase 8 — Notifications

```text
Notification center
Task reminders
Habit reminders
Timer notifications
Read/unread
Browser notifications
```

---

# 57. Phase 9 — Calendar + History

```text
Calendar
Activity timeline
Task history
Habit history
Focus history
```

---

# 58. Phase 10 — Productivity System

```text
Daily goals
Weekly goals
Daily review
Weekly review
Streaks
Productivity score
Insights
```

---

# 59. Phase 11 — Polish

هنا Donable يتحول من:

```text
Functional App
```

إلى:

```text
Product
```

نعمل:

```text
Loading states
Skeletons
Empty states
Error states
Animations
Micro interactions
Responsive polish
Accessibility
Performance
Keyboard shortcuts
```

---

# 60. Phase 12 — Backend Migration

بدل:

```text
JSON
```

نبدأ:

```text
Node.js
Serverless Functions
MongoDB
Axios
Authentication
```

مع الحفاظ على:

```text
Repository interfaces
Service layer
Redux
UI
Components
Pages
```

يعني مش هنعيد كتابة المشروع.

---

# 61. Phase 13 — Multi-user

مستقبلاً:

```text
User
  ↓
Workspace
  ↓
Projects
  ↓
Tasks
```

ثم:

```text
Task sharing
Collaborators
Comments
Mentions
Permissions
Team dashboard
```

---

# 62. Future AI

دي نخليها **Phase لاحقة**.

Donable AI ممكن يعمل:

```text
"Plan my day"
```

ويطلع:

```text
09:00 → Study Algorithms
10:00 → Build Donable
12:00 → Break
01:00 → C++ preparation
```

وكمان:

```text
Break task into subtasks
Estimate task duration
Prioritize tasks
Detect overdue tasks
Generate daily plan
Weekly productivity summary
```

لكن **مش في الـ MVP**.

---

# 63. MVP الحقيقي

لو عايز تبدأ بدون ما المشروع ينفجر في الحجم:

```text
MVP
│
├── Landing
├── Auth
├── Tasks
├── Drag & Drop
├── Dashboard
├── Habits
├── Timer
├── Notifications
├── Dark/Light
└── Responsive Mobile UI
```

بعدها:

```text
V2
│
├── Calendar
├── History
├── Goals
├── Daily Review
└── Advanced Analytics
```

ثم:

```text
V3
│
├── Backend
├── MongoDB
├── Real Auth
├── Multi-user
├── Sharing
└── AI
```

---

# 64. Definition of Done

Feature ما تعتبرش خلصت لمجرد إنها بتشتغل.

كل feature لازم يكون فيها:

```text
✓ Functional
✓ Responsive
✓ Loading state
✓ Empty state
✓ Error state
✓ Accessible
✓ Dark mode
✓ Light mode
✓ Animation where useful
✓ Mobile UX
✓ Redux integration if needed
✓ Persistence
✓ Clean architecture
```

---

# 65. أهم Architectural Rule

دي أهم حاجة في المشروع كله:

```text
Components
    ↓
Features
    ↓
Services
    ↓
Repositories
    ↓
Data Source
```

مش:

```text
Component
   ↓
axios
   ↓
MongoDB
```

لأنك عايز المشروع يتحول من:

```text
JSON
```

إلى:

```text
MongoDB
```

من غير ما تعمل rewrite.

---

# 66. Donable Folder Structure النهائي

```text
donable/
│
├── public/
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── tasks/
│   │   ├── habits/
│   │   ├── dashboard/
│   │   ├── timer/
│   │   ├── notifications/
│   │   ├── calendar/
│   │   ├── history/
│   │   ├── search/
│   │   └── settings/
│   │
│   ├── pages/
│   │   ├── landing/
│   │   ├── auth/
│   │   └── app/
│   │
│   ├── store/
│   │   ├── store.ts
│   │   └── slices/
│   │
│   ├── services/
│   │   ├── api/
│   │   ├── repositories/
│   │   └── notifications/
│   │
│   ├── data/
│   │   ├── mock/
│   │   └── seed/
│   │
│   ├── hooks/
│   ├── lib/
│   ├── utils/
│   ├── constants/
│   ├── types/
│   └── styles/
│
├── .env.example
├── eslint.config.js
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

# 67. AI Master Prompt

وده أهم جزء لو هتستخدم Cursor / Claude Code / ChatGPT coding agent.

# Donable — AI Development Master Prompt

You are the lead frontend architect and senior React engineer responsible for building a production-quality productivity application called **Donable**.

## Product

Donable is a personal productivity platform that combines:

* Task management
* Kanban-style task workflow
* Habits
* Time tracking
* Pomodoro/focus sessions
* Notifications
* Calendar
* Productivity analytics
* Activity history
* Daily and weekly goals
* User profile and settings

The initial version is frontend-first and uses local JSON/mock persistence.

However, the architecture MUST be designed so the application can later migrate to:

React → Axios → Serverless Node.js → MongoDB

without rewriting the UI or feature architecture.

---

# Technology Stack

Use:

* React
* Vite
* TypeScript
* React Router
* Redux Toolkit
* Axios
* Tailwind CSS
* Material UI
* Radix UI
* Lucide React
* Motion / Framer Motion
* SweetAlert2

Do not introduce additional major libraries unless there is a clear architectural reason.

---

# Architecture Rules

Use a feature-based architecture.

Preferred structure:

src/

* app/
* assets/
* components/
* features/
* pages/
* store/
* services/
* data/
* hooks/
* lib/
* utils/
* constants/
* types/
* styles/

Separate:

UI
→ Features
→ Services
→ Repositories
→ Data source

Components must NOT directly access JSON files or Axios.

Use repository abstractions.

The first implementation should use JSON/mock repositories.

Future implementations should be able to replace the repositories with API repositories.

---

# State Management

Use Redux Toolkit for global application state.

Recommended slices:

* auth
* tasks
* habits
* notifications
* timer
* settings
* UI

Do not put temporary local component state into Redux.

---

# Styling Strategy

Tailwind CSS is the primary styling system.

Use Material UI only where its complex components provide meaningful value.

Use Radix UI for accessible unstyled primitives such as:

* Dialog
* Dropdown Menu
* Popover
* Tooltip
* Tabs
* Select
* Checkbox
* Switch
* Alert Dialog

Use Lucide React for icons.

Use Motion for meaningful UI animation.

Do not overuse animations.

---

# Design Direction

The visual identity should be inspired by the design language of Vercel without cloning Vercel.

Design characteristics:

* Minimal
* Premium
* Modern
* High contrast
* Large typography
* Thin borders
* Grid backgrounds
* Subtle gradients
* Controlled glow
* Generous whitespace
* Clean cards
* Excellent typography

Support:

* Dark mode
* Light mode
* System mode

The UI must feel like a modern productivity SaaS product.

---

# Responsive Design

Use a mobile-first approach.

Mobile is NOT a reduced desktop version.

The mobile experience should feel like a native productivity application.

Use:

* Bottom navigation
* Touch-friendly controls
* Compact cards
* Bottom sheets where appropriate
* Horizontal tabs
* Sticky actions
* Swipe gestures where useful
* Large tap targets

Desktop can use:

* Sidebar
* Top navigation
* Multi-column layouts

---

# Routes

Public:

/
/features
/login
/signup

Application:

/app/dashboard
/app/tasks
/app/habits
/app/calendar
/app/focus
/app/notifications
/app/history
/app/profile
/app/settings

Use protected routes for authenticated application pages.

---

# Landing Page

Create a premium Vercel-inspired landing page.

Sections:

1. Navbar
2. Hero
3. Product preview
4. Tasks
5. Habits
6. Time management
7. Analytics
8. Focus mode
9. Testimonials
10. CTA
11. Footer

Use subtle Motion animations.

Avoid excessive animation.

---

# Tasks

Implement a full task management system.

Task fields:

* id
* userId
* title
* description
* status
* priority
* category
* tags
* dueDate
* startDate
* estimatedTime
* actualTime
* subtasks
* reminder
* recurring
* createdAt
* updatedAt
* completedAt
* position

Statuses:

TODO
IN_PROGRESS
DONE

Priorities:

LOW
MEDIUM
HIGH
URGENT

---

# Todo Board

Desktop:

TODO | IN PROGRESS | DONE

Tasks must support:

* Create
* Read
* Update
* Delete
* Reorder
* Search
* Filter
* Sort
* Status change
* Priority
* Tags
* Categories
* Subtasks

Drag and drop must support:

* Any column → any column
* Reordering within the same column

Clicking a task should provide a quick status change mechanism.

The implementation must not depend exclusively on mouse interaction.

Provide mobile-friendly alternatives.

---

# Dashboard

Create a productivity dashboard containing:

* Total tasks
* Completed tasks
* Active tasks
* Habit completion
* Current streak
* Productivity score
* Focus time
* Completion rate
* Daily productivity
* Weekly productivity
* Monthly productivity
* Recent activity
* Upcoming tasks

Include meaningful visualizations.

Do not create fake analytics.

Analytics must be calculated from actual application data.

---

# Productivity Score

Create a transparent productivity score.

Example weighting:

* Task completion: 40%
* Habit consistency: 25%
* Focus time: 20%
* Deadline discipline: 15%

Document the calculation.

Avoid random scores.

---

# Habits

Habit fields:

* id
* userId
* name
* description
* frequency
* target
* category
* reminder
* currentStreak
* bestStreak
* createdAt

Support:

* Daily habits
* Weekly habits
* Custom frequency
* Targets
* Streaks
* Best streak
* Completion rate
* Calendar history
* Reminders

---

# Timer

Implement:

* Pomodoro
* Custom timer
* Focus sessions
* Short break
* Long break

Suggested presets:

25/5
50/10
90/20
Custom

Timer sessions should optionally be linked to tasks.

Track:

* Start time
* End time
* Duration
* Task
* Session type

---

# Focus Mode

Create a distraction-free focus mode.

It should minimize unnecessary navigation and emphasize:

* Timer
* Current task
* Session status
* Pause
* Resume
* Exit

---

# Notifications

Implement a notification center.

Notification types:

* Task reminder
* Task due
* Habit reminder
* Habit streak
* Timer complete
* System

Support:

* Read/unread
* Mark as read
* Clear
* Notification history

Create a notification service abstraction so browser notifications can be added later.

---

# Calendar

Create a calendar that can display:

* Tasks
* Deadlines
* Habits
* Reminders
* Focus sessions

---

# History

Create an activity timeline.

Examples:

* Task created
* Task completed
* Task moved
* Habit completed
* Focus session completed
* Reminder triggered

Each activity should include:

* Type
* Timestamp
* Related entity
* Human-readable message

---

# Goals

Implement:

* Daily goals
* Weekly goals

Examples:

* Complete 3 tasks
* Complete 5 habits
* Spend 2 hours focusing

Show progress visually.

---

# Daily Review

Create a daily review page/modal containing:

* Tasks completed
* Focus time
* Habit completion
* Goals completed
* Reflection
* Tomorrow's priorities

---

# Search

Implement global search.

Shortcut:

Ctrl + K
or
Cmd + K

Search across:

* Tasks
* Habits
* Pages
* Actions

---

# Filters

Tasks must support:

* Status
* Priority
* Category
* Tags
* Due date
* Created date

Sorting:

* Newest
* Oldest
* Priority
* Due date
* Recently updated

---

# Profile

Support:

* Name
* Email
* Avatar
* Basic profile information

---

# Settings

Sections:

* Profile
* Appearance
* Notifications
* Productivity
* Timer
* Privacy
* Data

Appearance:

* Light
* Dark
* System

---

# Authentication

Initial implementation may use mock authentication.

Create an abstraction:

authService.login()
authService.logout()
authService.getCurrentUser()

Future API implementation should support:

POST /auth/login
POST /auth/register
POST /auth/logout
GET /auth/me

---

# Data Persistence

The first version should use local JSON/mock data.

Do not tightly couple UI components to JSON files.

Create repository interfaces such as:

taskRepository
habitRepository
userRepository
notificationRepository
activityRepository

Future MongoDB/API repositories should implement the same responsibilities.

---

# API Layer

Prepare Axios infrastructure:

* API client
* Base URL
* Interceptors
* Error handling
* Authentication preparation

Do not call Axios directly from UI components.

---

# Accessibility

Every feature should consider:

* Keyboard navigation
* Focus management
* ARIA
* Screen readers
* Color contrast
* Reduced motion
* Touch accessibility

---

# Loading / Error / Empty States

Every major feature must have:

* Loading state
* Skeleton state
* Empty state
* Error state
* Success feedback

Never leave blank screens.

---

# UX Rules

Donable should feel:

Fast
Clear
Calm
Focused
Premium

Avoid:

* Excessive colors
* Excessive animations
* unnecessary modals
* excessive borders
* visual clutter
* complicated navigation

Every user action should have clear feedback.

---

# Performance

Use:

* Lazy-loaded routes
* Code splitting
* Memoization where justified
* Debounced search
* Efficient Redux updates
* Efficient drag/drop updates
* Optimized assets

Do not prematurely optimize.

---

# Development Process

Do NOT build the entire application in one pass.

Build incrementally.

Phase 1:
Project foundation

Phase 2:
Design system

Phase 3:
Landing page

Phase 4:
Authentication

Phase 5:
Tasks

Phase 6:
Dashboard

Phase 7:
Habits

Phase 8:
Timer

Phase 9:
Notifications

Phase 10:
Calendar and history

Phase 11:
Goals and reviews

Phase 12:
Polish

Phase 13:
Backend migration

Do not move to the next phase until the current phase is stable.

---

# Code Quality

Follow:

* Clean architecture
* Single responsibility
* Reusable components
* Strong TypeScript types
* Meaningful names
* Small components
* Avoid unnecessary abstraction
* Avoid duplicated logic
* No magic numbers
* No hardcoded repeated strings
* No direct data access from UI
* No fake data presented as real analytics

---

# Important Rule

Before implementing a feature:

1. Understand the existing architecture.
2. Identify the correct feature folder.
3. Reuse existing components.
4. Reuse existing services.
5. Reuse existing design tokens.
6. Avoid creating duplicate components.
7. Keep the implementation consistent with the existing architecture.

Do not rewrite unrelated parts of the application.

---

# Final Goal

The final product should feel like a polished productivity SaaS application rather than a tutorial Todo app.

The application should be:

* Portfolio-grade
* Production-oriented
* Mobile-first
* Accessible
* Responsive
* Maintainable
* Scalable
* Ready for backend migration
* Ready for future multi-user support
* Ready for future AI features

Future features such as:

* Team collaboration
* Shared workspaces
* AI task planning
* AI prioritization
* AI task breakdown
* AI productivity insights

must be considered in architectural decisions, but should NOT be implemented prematurely.

---

## 68. ترتيب التنفيذ اللي أنصحك تمشي عليه

لو أنا مكانك، **ما تبدأش بكل الـ features دي مرة واحدة**.

ابدأ بالترتيب:

```text
Foundation
    ↓
Design System
    ↓
Landing
    ↓
App Shell
    ↓
Tasks
    ↓
Drag & Drop
    ↓
Dashboard
    ↓
Habits
    ↓
Timer
    ↓
Notifications
    ↓
Calendar
    ↓
History
    ↓
Goals
    ↓
Daily Review
    ↓
Polish
    ↓
Backend
    ↓
Multi-user
    ↓
AI
```

وده هيخلي Donable يتطور تدريجيًا بدل ما يتحول إلى مشروع ضخم مليان أجزاء غير مكتملة.

**ملاحظة تقنية مهمة:** بما إنك ناوي تستخدم Tailwind + MUI + Radix معًا، أهم قرار هنا هو عدم السماح للثلاثة إنهم يبقوا ثلاثة design systems متنافسة. خليك على **Tailwind كطبقة styling الأساسية، Radix كـ accessible primitives، وMUI فقط للمكونات المعقدة التي توفر قيمة حقيقية**. ده هيحافظ على هوية Donable بدل ما كل جزء من التطبيق شكله مختلف. ([Tailwind CSS][8])

### المصادر الرسمية

* [React Router Documentation](https://reactrouter.com/start/modes?utm_source=chatgpt.com)
* [Vite + Tailwind CSS Integration](https://tailwindcss.com/docs/installation/using-vite?source=post_page---------------------------&utm_source=chatgpt.com)
* [Tailwind CSS Framework Guides](https://tailwindcss.com/docs/installation/framework-guides?utm_source=chatgpt.com)
* [Radix UI Primitives](https://www.radix-ui.com/primitives?utm_source=chatgpt.com)
* [Radix + Motion Animation Guide](https://motion.dev/docs/radix?utm_source=chatgpt.com)

[1]: https://reactrouter.com/start/declarative/installation?utm_source=chatgpt.com "Installation | React Router"
[2]: https://tailwindcss.com/docs/installation/using-vite?source=post_page---------------------------&utm_source=chatgpt.com "Installing Tailwind CSS with Vite - Tailwind CSS"
[3]: https://www.radix-ui.com/primitives?utm_source=chatgpt.com "Radix Primitives"
[4]: https://motion.dev/docs/radix?utm_source=chatgpt.com "Radix: How to Add Animations to Radix | Motion for React"
[5]: https://reactrouter.com/tutorials/quickstart?utm_source=chatgpt.com "Quick Start | React Router"
[6]: https://reactrouter.com/start/modes?utm_source=chatgpt.com "Picking a Mode | React Router"
[7]: https://www.radix-ui.com/primitives/docs/guides/animation?utm_source=chatgpt.com "Animation – Radix Primitives"
[8]: https://tailwindcss.com/docs/installation/framework-guides/react-router?utm_source=chatgpt.com "Install Tailwind CSS with React Router - Tailwind CSS"
