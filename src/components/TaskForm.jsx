function TaskForm({
  editingTaskId,
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  taskDueAt,
  setTaskDueAt,
  taskPriority,
  setTaskPriority,
  taskStatus,
  setTaskStatus,
  createTask,
  updateTask,
  resetForm,
  handleSignOut,
  profile,
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/25 backdrop-blur">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {editingTaskId ? 'Edit Task' : 'Create Task'}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {editingTaskId
              ? 'Update the selected task.'
              : `Add a new task to your workflow${profile?.full_name ? `, ${profile.full_name}` : ''}.`}
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Sign Out
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Task Title
          </label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Task Description
          </label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="min-h-[120px] w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={taskDueAt}
              onChange={(e) => setTaskDueAt(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Priority
            </label>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Status
            </label>
            <select
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={editingTaskId ? updateTask : createTask}
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            {editingTaskId ? 'Save Changes' : 'Create Task'}
          </button>

          {editingTaskId && (
            <button
              onClick={resetForm}
              className="rounded-xl border border-white/10 bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskForm