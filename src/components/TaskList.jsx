import TaskCard from './TaskCard'

function TaskList({
  filteredTasks,
  startEditingTask,
  changeTaskStatus,
  deleteTask,
  getPriorityClasses,
  getStatusClasses,
  getDueDisplay,
  filter,
  searchTerm,
  attachments,
  uploadAttachment,
  openAttachment,
  deleteAttachment,
}) {
  if (filteredTasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-10 text-center light:border-slate-200 light:bg-slate-50">
        <h3 className="text-lg font-semibold text-slate-200 light:text-slate-800">
          No tasks found
        </h3>

        <p className="mt-2 text-sm text-slate-400 light:text-slate-500">
          {searchTerm
            ? `No tasks match "${searchTerm}".`
            : filter === 'all'
            ? 'Create your first task to get started.'
            : 'No tasks match this filter.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          startEditingTask={startEditingTask}
          changeTaskStatus={changeTaskStatus}
          deleteTask={deleteTask}
          getPriorityClasses={getPriorityClasses}
          getStatusClasses={getStatusClasses}
          getDueDisplay={getDueDisplay}
          attachments={attachments}
          uploadAttachment={uploadAttachment}
          openAttachment={openAttachment}
          deleteAttachment={deleteAttachment}
        />
      ))}
    </div>
  )
}

export default TaskList