function TaskFilters({ filter, setFilter, counts }) {
  const buttons = [
    { key: 'all', label: 'All', count: counts.all, active: 'bg-cyan-400 text-slate-950' },
    { key: 'pending', label: 'Pending', count: counts.pending, active: 'bg-amber-300 text-slate-950' },
    { key: 'in_progress', label: 'In Progress', count: counts.in_progress, active: 'bg-orange-300 text-slate-950' },
    { key: 'completed', label: 'Completed', count: counts.completed, active: 'bg-emerald-300 text-slate-950' },
    { key: 'high', label: 'High Priority', count: counts.high, active: 'bg-rose-300 text-slate-950' },
    { key: 'overdue', label: 'Overdue', count: counts.overdue, active: 'bg-red-300 text-slate-950' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {buttons.map((button) => (
        <button
          key={button.key}
          onClick={() => setFilter(button.key)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            filter === button.key
              ? button.active
              : 'border border-white/10 bg-slate-800/80 text-white hover:bg-slate-700'
          }`}
        >
          {button.label} ({button.count})
        </button>
      ))}
    </div>
  )
}

export default TaskFilters