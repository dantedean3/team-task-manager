import { createPortal } from 'react-dom'
import { Draggable } from '@hello-pangea/dnd'

function KanbanTaskCard({
  task,
  index,
  attachments = [],
  startEditingTask,
  deleteTask,
  getPriorityClasses,
  getStatusClasses,
  getDueDisplay,
}) {
  const due = getDueDisplay(task.due_at, task.is_complete)

  const attachmentCount = attachments.filter(
    (attachment) => String(attachment.task_id) === String(task.id)
  ).length

  function CardContent({ provided, snapshot }) {
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-lg shadow-black/20 transition light:border-slate-200 light:bg-white ${
          snapshot.isDragging
            ? 'border-cyan-400 shadow-2xl shadow-cyan-500/20'
            : ''
        }`}
        style={{
          ...provided.draggableProps.style,
          cursor: snapshot.isDragging ? 'grabbing' : 'grab',
        }}
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClasses(
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
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getPriorityClasses(
              task.priority || 'medium'
            )}`}
          >
            {(task.priority || 'medium').toUpperCase()}
          </span>

          {attachmentCount > 0 && (
            <span className="rounded-full bg-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-200 light:bg-slate-100 light:text-slate-700">
              {attachmentCount} file{attachmentCount === 1 ? '' : 's'}
            </span>
          )}

          {due.badge && (
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${due.badgeClass}`}
            >
              {due.badge}
            </span>
          )}
        </div>

        <h4 className="text-sm font-semibold text-white light:text-slate-950">
          {task.title}
        </h4>

        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400 light:text-slate-600">
          {task.description || 'No description'}
        </p>

        <p className="mt-3 text-xs text-slate-500">
          Due:{' '}
          <span className={`font-medium ${due.textClass}`}>{due.text}</span>
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation()
              startEditingTask(task)
            }}
            className="rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 light:border-slate-200 light:bg-slate-100 light:text-slate-700 light:hover:bg-slate-200"
          >
            Edit
          </button>

          <button
            onClick={(event) => {
              event.stopPropagation()
              deleteTask(task.id)
            }}
            className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-400"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => {
        const card = <CardContent provided={provided} snapshot={snapshot} />

        if (snapshot.isDragging) {
          return createPortal(card, document.body)
        }

        return card
      }}
    </Draggable>
  )
}

export default KanbanTaskCard