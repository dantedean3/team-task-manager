function ReminderPanel({ tasks }) {
  const now = new Date()

  const activeTasks = tasks.filter((task) => !task.is_complete && task.due_at)

  const overdueTasks = activeTasks.filter((task) => {
    return new Date(task.due_at) < now
  })

  const dueSoonTasks = activeTasks.filter((task) => {
    const dueDate = new Date(task.due_at)
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    return diffHours >= 0 && diffHours <= 24
  })

  const remindedTasks = tasks.filter((task) => task.reminder_sent_at)

  function formatDate(value) {
    if (!value) return 'No date'

    return new Date(value).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  function renderTask(task, type) {
    return (
      <div
        key={task.id}
        className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 light:border-slate-200 light:bg-slate-50"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white light:text-slate-950">
              {task.title}
            </p>

            <p className="mt-1 text-xs text-slate-400 light:text-slate-500">
              Due: {formatDate(task.due_at)}
            </p>

            {task.reminder_sent_at && (
              <p className="mt-1 text-xs text-cyan-300 light:text-cyan-700">
                Last reminder sent: {formatDate(task.reminder_sent_at)}
              </p>
            )}
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
              type === 'overdue'
                ? 'bg-rose-500/15 text-rose-300'
                : 'bg-amber-500/15 text-amber-200'
            }`}
          >
            {type === 'overdue' ? 'Overdue' : 'Due Soon'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl light:border-slate-200 light:bg-white/85 light:shadow-slate-200/70">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-white light:text-slate-950">
          Reminders
        </h2>

        <p className="mt-1 text-sm text-slate-400 light:text-slate-500">
          Tasks that need attention based on due dates and reminder activity.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 light:border-slate-200 light:bg-slate-50">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Overdue
          </p>
          <p className="mt-2 text-3xl font-bold text-rose-300 light:text-rose-700">
            {overdueTasks.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 light:border-slate-200 light:bg-slate-50">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Due Soon
          </p>
          <p className="mt-2 text-3xl font-bold text-amber-200 light:text-amber-700">
            {dueSoonTasks.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 light:border-slate-200 light:bg-slate-50">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Reminded
          </p>
          <p className="mt-2 text-3xl font-bold text-cyan-300 light:text-cyan-700">
            {remindedTasks.length}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {overdueTasks.length === 0 && dueSoonTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-8 text-center light:border-slate-200 light:bg-slate-50">
            <p className="text-sm font-medium text-slate-300 light:text-slate-700">
              No urgent reminders right now.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Tasks due soon or overdue will appear here.
            </p>
          </div>
        ) : (
          <>
            {overdueTasks.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-rose-300 light:text-rose-700">
                  Overdue
                </h3>

                <div className="space-y-2">
                  {overdueTasks.map((task) => renderTask(task, 'overdue'))}
                </div>
              </div>
            )}

            {dueSoonTasks.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-200 light:text-amber-700">
                  Due Soon
                </h3>

                <div className="space-y-2">
                  {dueSoonTasks.map((task) => renderTask(task, 'dueSoon'))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ReminderPanel