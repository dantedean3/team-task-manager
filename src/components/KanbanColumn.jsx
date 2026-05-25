import { Droppable } from '@hello-pangea/dnd'
import KanbanTaskCard from './KanbanTaskCard'

function KanbanColumn({
  column,
  tasks = [],
  attachments = [],
  startEditingTask,
  deleteTask,
  getPriorityClasses,
  getStatusClasses,
  getDueDisplay,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 light:border-slate-200 light:bg-slate-50">
      <div className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-white light:text-slate-950">
            {column.title}
          </h3>

          <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 light:bg-white light:text-slate-600">
            {tasks.length}
          </span>
        </div>

        <p className="mt-1 text-xs text-slate-500">{column.subtitle}</p>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[240px] space-y-3 rounded-2xl border border-dashed p-3 transition ${
              snapshot.isDraggingOver
                ? 'border-cyan-400 bg-cyan-500/10'
                : 'border-white/10 bg-slate-950/40 light:border-slate-200 light:bg-white/70'
            }`}
          >
            {tasks.length === 0 && (
              <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-white/10 text-center text-sm text-slate-500 light:border-slate-200">
                Drop tasks here
              </div>
            )}

            {tasks.map((task, index) => (
              <KanbanTaskCard
                key={task.id}
                task={task}
                index={index}
                attachments={attachments}
                startEditingTask={startEditingTask}
                deleteTask={deleteTask}
                getPriorityClasses={getPriorityClasses}
                getStatusClasses={getStatusClasses}
                getDueDisplay={getDueDisplay}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default KanbanColumn