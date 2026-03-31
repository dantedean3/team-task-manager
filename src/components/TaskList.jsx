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
}) {
  if (filteredTasks.length === 0) {
    let title = 'No tasks found'
    let subtitle = 'Create a task to get started.'

    if (searchTerm.trim()) {
      title = 'No matching tasks'
      subtitle = `Nothing matched "${searchTerm}".`
    } else if (filter !== 'all') {
      title = 'Nothing in this view'
      subtitle = 'Try another filter or create a new task.'
    }

    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-10 text-center">
        <p className="text-lg font-medium text-slate-200">{title}</p>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
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
        />
      ))}
    </div>
  )
}

export default TaskList