import AttachmentUploader from './AttachmentUploader'

function TaskCard({
  task,
  startEditingTask,
  changeTaskStatus,
  deleteTask,
  getPriorityClasses,
  getStatusClasses,
  getDueDisplay,
  attachments,
  uploadAttachment,
  openAttachment,
  deleteAttachment,
}) {
  const due = getDueDisplay(task.due_at, task.is_complete)

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 shadow-lg shadow-black/20 transition hover:border-white/20 light:border-slate-200 light:bg-white/80 light:shadow-slate-200/60">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                task.status
              )}`}
            >
              {task.status === 'in_progress'
                ? 'IN PROGRESS'
                : task.status === 'done'
                ? 'DONE'
                : 'TO DO'}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                task.priority || 'medium'
              )}`}
            >
              {(task.priority || 'medium').toUpperCase()}
            </span>

            {due.badge && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${due.badgeClass}`}
              >
                {due.badge}
              </span>
            )}
          </div>

          <h3
            className={`text-xl font-semibold ${
              task.is_complete
                ? 'text-slate-500 line-through'
                : 'text-white light:text-slate-950'
            }`}
          >
            {task.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-400 light:text-slate-600">
            {task.description || 'No description'}
          </p>

          <p className="mt-3 text-sm text-slate-400 light:text-slate-500">
            Due:{' '}
            <span className={`font-medium ${due.textClass}`}>
              {due.text}
            </span>
          </p>

          <AttachmentUploader
            task={task}
            attachments={attachments}
            uploadAttachment={uploadAttachment}
            openAttachment={openAttachment}
            deleteAttachment={deleteAttachment}
          />
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            onClick={() => startEditingTask(task)}
            className="rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 light:border-slate-200 light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200"
          >
            Edit
          </button>

          {task.status === 'todo' && (
            <button
              onClick={() => changeTaskStatus(task, 'in_progress')}
              className="rounded-xl bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
            >
              Start
            </button>
          )}

          {task.status === 'in_progress' && (
            <button
              onClick={() => changeTaskStatus(task, 'done')}
              className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
            >
              Mark Done
            </button>
          )}

          {task.status === 'done' && (
            <button
              onClick={() => changeTaskStatus(task, 'todo')}
              className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
            >
              Reopen
            </button>
          )}

          <button
            onClick={() => deleteTask(task.id)}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard