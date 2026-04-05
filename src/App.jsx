import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'
import Header from './components/Header'
import AuthForm from './components/AuthForm'
import StatsCards from './components/StatsCards'
import TaskForm from './components/TaskForm'
import TaskFilters from './components/TaskFilters'
import TaskList from './components/TaskList'
import Toast from './components/Toast'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [toast, setToast] = useState(null)
  const [tasks, setTasks] = useState([])

  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskDueAt, setTaskDueAt] = useState('')
  const [taskPriority, setTaskPriority] = useState('medium')
  const [taskStatus, setTaskStatus] = useState('todo')

  const [filter, setFilter] = useState('all')
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [loadingTasks, setLoadingTasks] = useState(false)

  useEffect(() => {
    async function loadSession() {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        showToast(error.message, 'error')
        return
      }
      setSession(data.session)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile(session.user.id)
      fetchTasks()
    } else {
      setTasks([])
      setProfile(null)
    }
  }, [session])

  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(timeout)
  }, [toast])

  function showToast(text, type = 'info') {
    setToast({ text, type })
  }

  async function ensureProfileExists(user) {
    if (!user) return false

    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (fetchError) {
      console.error(fetchError)
      showToast(fetchError.message, 'error')
      return false
    }

    if (existingProfile) return true

    const { error: insertError } = await supabase.from('profiles').insert([
      {
        id: user.id,
        full_name: user.user_metadata?.full_name || fullName || '',
        role: 'user',
      },
    ])

    if (insertError) {
      console.error(insertError)
      showToast(insertError.message, 'error')
      return false
    }

    return true
  }

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error(error)
      return
    }

    setProfile(data)
  }

  async function fetchTasks() {
    setLoadingTasks(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setTasks([])
      setLoadingTasks(false)
      return
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      showToast(error.message, 'error')
    } else {
      setTasks(data || [])
    }

    setLoadingTasks(false)
  }

  async function handleSignUp() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    })

    if (error) {
      showToast(error.message, 'error')
      return
    }

    if (data.user) {
      const ok = await ensureProfileExists(data.user)
      if (!ok) return
    }

    showToast('Account created successfully.', 'success')
    setIsLogin(true)
  }

  async function handleSignIn() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      showToast(error.message, 'error')
      return
    }

    if (data.user) {
      const ok = await ensureProfileExists(data.user)
      if (!ok) return
    }

    showToast('Logged in successfully.', 'success')
  }

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      showToast(error.message, 'error')
    } else {
      resetForm()
      setFilter('all')
      setSearchTerm('')
      setSortBy('newest')
      showToast('Logged out.', 'info')
    }
  }

  function resetForm() {
    setTaskTitle('')
    setTaskDescription('')
    setTaskDueAt('')
    setTaskPriority('medium')
    setTaskStatus('todo')
    setEditingTaskId(null)
  }

  function toDateTimeLocal(value) {
    if (!value) return ''
    const date = new Date(value)
    const tzOffset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16)
  }

  function startEditingTask(task) {
    setEditingTaskId(task.id)
    setTaskTitle(task.title || '')
    setTaskDescription(task.description || '')
    setTaskDueAt(toDateTimeLocal(task.due_at))
    setTaskPriority(task.priority || 'medium')
    setTaskStatus(task.status || 'todo')
    showToast('Editing task.', 'info')
  }

  async function createTask() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      showToast('No user found.', 'error')
      return
    }

    const ok = await ensureProfileExists(user)
    if (!ok) return

    if (!taskTitle.trim()) {
      showToast('Task title is required.', 'error')
      return
    }

    const { error } = await supabase.from('tasks').insert([
      {
        title: taskTitle,
        description: taskDescription,
        due_at: taskDueAt || null,
        priority: taskPriority,
        status: taskStatus,
        is_complete: taskStatus === 'done',
        created_by: user.id,
      },
    ])

    if (error) {
      console.error(error)
      showToast(error.message, 'error')
    } else {
      resetForm()
      fetchTasks()
      showToast('Task created.', 'success')
    }
  }

  async function updateTask() {
    if (!editingTaskId) {
      showToast('No task selected for editing.', 'error')
      return
    }

    if (!taskTitle.trim()) {
      showToast('Task title is required.', 'error')
      return
    }

    const { error } = await supabase
      .from('tasks')
      .update({
        title: taskTitle,
        description: taskDescription,
        due_at: taskDueAt || null,
        priority: taskPriority,
        status: taskStatus,
        is_complete: taskStatus === 'done',
      })
      .eq('id', editingTaskId)

    if (error) {
      console.error(error)
      showToast(error.message, 'error')
    } else {
      resetForm()
      fetchTasks()
      showToast('Task updated.', 'success')
    }
  }

  async function changeTaskStatus(task, nextStatus) {
    const { error } = await supabase
      .from('tasks')
      .update({
        status: nextStatus,
        is_complete: nextStatus === 'done',
      })
      .eq('id', task.id)

    if (error) {
      console.error(error)
      showToast(error.message, 'error')
    } else {
      fetchTasks()
      showToast('Task status updated.', 'success')
    }
  }

  async function deleteTask(taskId) {
    const confirmed = window.confirm('Are you sure you want to delete this task?')
    if (!confirmed) return

    const { error } = await supabase.from('tasks').delete().eq('id', taskId)

    if (error) {
      console.error(error)
      showToast(error.message, 'error')
    } else {
      if (editingTaskId === taskId) resetForm()
      fetchTasks()
      showToast('Task deleted.', 'success')
    }
  }

  async function clearCompletedTasks() {
    const completedIds = tasks.filter((task) => task.is_complete).map((task) => task.id)

    if (completedIds.length === 0) {
      showToast('No completed tasks to clear.', 'info')
      return
    }

    const confirmed = window.confirm('Delete all completed tasks?')
    if (!confirmed) return

    const { error } = await supabase.from('tasks').delete().in('id', completedIds)

    if (error) {
      console.error(error)
      showToast(error.message, 'error')
    } else {
      if (
        editingTaskId &&
        tasks.some((task) => task.id === editingTaskId && task.is_complete)
      ) {
        resetForm()
      }
      fetchTasks()
      showToast('Completed tasks cleared.', 'success')
    }
  }

  function getPriorityClasses(priority) {
    if (priority === 'high') return 'bg-rose-500/15 text-rose-300'
    if (priority === 'low') return 'bg-sky-500/15 text-sky-300'
    return 'bg-violet-500/15 text-violet-300'
  }

  function getStatusClasses(status) {
    if (status === 'done') return 'bg-emerald-500/15 text-emerald-300'
    if (status === 'in_progress') return 'bg-amber-500/15 text-amber-200'
    return 'bg-cyan-500/15 text-cyan-300'
  }

  function getDueDisplay(dueAt, isComplete) {
    if (!dueAt) {
      return {
        text: 'No due date',
        textClass: 'text-slate-300',
        badge: null,
        badgeClass: '',
      }
    }

    const now = new Date()
    const due = new Date(dueAt)
    const diff = due.getTime() - now.getTime()
    const hours = diff / (1000 * 60 * 60)

    const formatted = due.toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    })

    if (isComplete) {
      return {
        text: formatted,
        textClass: 'text-slate-300',
        badge: null,
        badgeClass: '',
      }
    }

    if (hours < 0) {
      return {
        text: formatted,
        textClass: 'text-rose-300',
        badge: 'Overdue',
        badgeClass: 'bg-rose-500/15 text-rose-300',
      }
    }

    if (hours <= 24) {
      return {
        text: formatted,
        textClass: 'text-amber-200',
        badge: 'Due Soon',
        badgeClass: 'bg-amber-500/15 text-amber-200',
      }
    }

    return {
      text: formatted,
      textClass: 'text-slate-300',
      badge: null,
      badgeClass: '',
    }
  }

  const totalCount = tasks.length
  const completedCount = tasks.filter((task) => task.is_complete).length
  const inProgressCount = tasks.filter((task) => task.status === 'in_progress').length
  const highPriorityCount = tasks.filter((task) => task.priority === 'high').length

  const overdueCount = useMemo(() => {
    const now = new Date()
    return tasks.filter(
      (task) => task.due_at && new Date(task.due_at) < now && !task.is_complete
    ).length
  }, [tasks])

  const completionRate =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  const counts = {
    all: totalCount,
    pending: tasks.filter((task) => task.status === 'todo').length,
    in_progress: inProgressCount,
    completed: completedCount,
    high: highPriorityCount,
    overdue: overdueCount,
  }

  const filteredTasks = useMemo(() => {
    let result = [...tasks]
    const now = new Date()

    if (filter === 'pending') {
      result = result.filter((task) => task.status === 'todo')
    } else if (filter === 'in_progress') {
      result = result.filter((task) => task.status === 'in_progress')
    } else if (filter === 'completed') {
      result = result.filter((task) => task.status === 'done')
    } else if (filter === 'high') {
      result = result.filter((task) => task.priority === 'high')
    } else if (filter === 'overdue') {
      result = result.filter(
        (task) => task.due_at && new Date(task.due_at) < now && !task.is_complete
      )
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (task) =>
          task.title?.toLowerCase().includes(term) ||
          task.description?.toLowerCase().includes(term)
      )
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at)
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at)

      if (sortBy === 'dueSoon') {
        if (!a.due_at && !b.due_at) return 0
        if (!a.due_at) return 1
        if (!b.due_at) return -1
        return new Date(a.due_at) - new Date(b.due_at)
      }

      if (sortBy === 'priority') {
        const priorityRank = { high: 3, medium: 2, low: 1 }
        return (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0)
      }

      if (sortBy === 'alphabetical') {
        return (a.title || '').localeCompare(b.title || '')
      }

      return 0
    })

    return result
  }, [tasks, filter, searchTerm, sortBy])

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617]" />
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.06),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <Header session={session} profile={profile} />
        <Toast toast={toast} onClose={() => setToast(null)} />

        {!session ? (
          <div className="mt-8">
            <AuthForm
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              handleSignUp={handleSignUp}
              handleSignIn={handleSignIn}
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_1.6fr]">
            <div className="space-y-6">
              <StatsCards
                totalCount={totalCount}
                completedCount={completedCount}
                inProgressCount={inProgressCount}
                highPriorityCount={highPriorityCount}
                overdueCount={overdueCount}
                completionRate={completionRate}
              />

              <TaskForm
                editingTaskId={editingTaskId}
                taskTitle={taskTitle}
                setTaskTitle={setTaskTitle}
                taskDescription={taskDescription}
                setTaskDescription={setTaskDescription}
                taskDueAt={taskDueAt}
                setTaskDueAt={setTaskDueAt}
                taskPriority={taskPriority}
                setTaskPriority={setTaskPriority}
                taskStatus={taskStatus}
                setTaskStatus={setTaskStatus}
                createTask={createTask}
                updateTask={updateTask}
                resetForm={resetForm}
                handleSignOut={handleSignOut}
                profile={profile}
              />
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="mb-6 space-y-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Your Tasks</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Search, filter, sort, and manage your workflow.
                    </p>
                  </div>

                  <TaskFilters filter={filter} setFilter={setFilter} counts={counts} />
                </div>

                <div className="grid gap-3 xl:grid-cols-[1.2fr_0.9fr_auto_auto]">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  />

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  >
                    <option value="newest">Sort: Newest</option>
                    <option value="oldest">Sort: Oldest</option>
                    <option value="dueSoon">Sort: Due Soon</option>
                    <option value="priority">Sort: Priority</option>
                    <option value="alphabetical">Sort: A-Z</option>
                  </select>

                  <button
                    onClick={fetchTasks}
                    className="rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Refresh
                  </button>

                  <button
                    onClick={clearCompletedTasks}
                    className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                  >
                    Clear Completed
                  </button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  <span>
                    Showing <span className="font-semibold text-white">{filteredTasks.length}</span>{' '}
                    task{filteredTasks.length === 1 ? '' : 's'}
                  </span>
                  <span>
                    Search: <span className="font-semibold text-white">{searchTerm || 'None'}</span>
                  </span>
                  <span>
                    Sort: <span className="font-semibold text-white">{sortBy}</span>
                  </span>
                </div>
              </div>

              {loadingTasks ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-10 text-center">
                  <p className="text-lg font-medium text-slate-200">Loading tasks...</p>
                </div>
              ) : (
                <TaskList
                  filteredTasks={filteredTasks}
                  startEditingTask={startEditingTask}
                  changeTaskStatus={changeTaskStatus}
                  deleteTask={deleteTask}
                  getPriorityClasses={getPriorityClasses}
                  getStatusClasses={getStatusClasses}
                  getDueDisplay={getDueDisplay}
                  filter={filter}
                  searchTerm={searchTerm}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App