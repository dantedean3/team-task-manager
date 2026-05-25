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
  pendingAttachment,
  setPendingAttachment,
  createTask,
  updateTask,
  resetForm,
  handleSignOut,
  profile,
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl light:border-slate-200 light:bg-white/85 light:shadow-slate-200/70">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white light:text-slate-950">
            {editingTaskId ? 'Edit Task' : 'Create Task'}
          </h2>

          <p className="mt-1 text-sm text-slate-400 light:text-slate-500">
            {editingTaskId
              ? 'Update task details and save your changes.'
              : 'Add a task with status, priority, due date, and an optional file.'}
          </p>

          {profile?.full_name && (
            <p className="mt-2 text-xs text-slate-500">
              Managing tasks as {profile.full_name}
            </p>
          )}
        </div>

        <button
          onClick={handleSignOut}
          className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 light:border-slate-200 light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200"
        >
          Sign Out
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300 light:text-slate-700">
            Task Title
          </label>

          <input
            type="text"
            placeholder="Example: Finish portfolio update"
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 light:border-slate-200 light:bg-white light:text-slate-900"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300 light:text-slate-700">
            Description
          </label>

          <textarea
            placeholder="Add details about this task..."
            value={taskDescription}
            onChange={(event) => setTaskDescription(event.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 light:border-slate-200 light:bg-white light:text-slate-900"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300 light:text-slate-700">
              Due Date & Time
            </label>

            <input
              type="datetime-local"
              value={taskDueAt}
              onChange={(event) => setTaskDueAt(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 light:border-slate-200 light:bg-white light:text-slate-900"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300 light:text-slate-700">
              Priority
            </label>

            <select
              value={taskPriority}
              onChange={(event) => setTaskPriority(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 light:border-slate-200 light:bg-white light:text-slate-900"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300 light:text-slate-700">
            Status
          </label>

          <select
            value={taskStatus}
            onChange={(event) => setTaskStatus(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 light:border-slate-200 light:bg-white light:text-slate-900"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {!editingTaskId && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300 light:text-slate-700">
              Optional Attachment
            </label>

            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 light:border-slate-200 light:bg-slate-50">
              <label className="block cursor-pointer rounded-lg bg-slate-800 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-700 light:bg-slate-200 light:text-slate-800 light:hover:bg-slate-300">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    setPendingAttachment(file || null)
                  }}
                />
              </label>

              {pendingAttachment ? (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 light:border-slate-200 light:bg-white">
                  <p
                    className="min-w-0 truncate text-xs font-medium text-slate-300 light:text-slate-700"
                    title={pendingAttachment.name}
                  >
                    {pendingAttachment.name}
                  </p>

                  <button
                    type="button"
                    onClick={() => setPendingAttachment(null)}
                    className="shrink-0 rounded-md bg-rose-500 px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-rose-400"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-500">
                  Add a file when creating this task.
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          {editingTaskId ? (
            <button
              onClick={updateTask}
              className="flex-1 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={createTask}
              className="flex-1 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Create Task
            </button>
          )}

          <button
            onClick={resetForm}
            className="rounded-xl border border-white/10 bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 light:border-slate-200 light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskForm