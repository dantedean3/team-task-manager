import { DragDropContext } from '@hello-pangea/dnd'
import KanbanColumn from './KanbanColumn'

function KanbanBoard({
  tasks,
  changeTaskStatus,
  startEditingTask,
  deleteTask,
  getPriorityClasses,
  getStatusClasses,
  getDueDisplay,
}) {
  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      subtitle: 'Tasks not started yet',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      subtitle: 'Tasks currently being worked on',
    },
    {
      id: 'done',
      title: 'Done',
      subtitle: 'Completed tasks',
    },
  ]

  function handleDragEnd(result) {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const task = tasks.find((item) => String(item.id) === draggableId)

    if (!task) return

    const nextStatus = destination.droppableId

    if (task.status === nextStatus) return

    changeTaskStatus(task, nextStatus)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.id)

          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              startEditingTask={startEditingTask}
              deleteTask={deleteTask}
              getPriorityClasses={getPriorityClasses}
              getStatusClasses={getStatusClasses}
              getDueDisplay={getDueDisplay}
            />
          )
        })}
      </div>
    </DragDropContext>
  )
}

export default KanbanBoard