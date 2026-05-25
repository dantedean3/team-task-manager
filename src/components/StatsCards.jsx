function StatsCards({
  totalCount,
  completedCount,
  inProgressCount,
  highPriorityCount,
  overdueCount,
  completionRate,
}) {
  const cards = [
    { label: 'Total Tasks', value: totalCount, color: 'text-white light:text-slate-950' },
    { label: 'Completed', value: completedCount, color: 'text-emerald-400 light:text-emerald-700' },
    { label: 'In Progress', value: inProgressCount, color: 'text-amber-300 light:text-amber-700' },
    { label: 'High Priority', value: highPriorityCount, color: 'text-rose-400 light:text-rose-700' },
    { label: 'Overdue', value: overdueCount, color: 'text-orange-400 light:text-orange-700' },
    { label: 'Completion Rate', value: `${completionRate}%`, color: 'text-cyan-400 light:text-cyan-700' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/10 bg-slate-900/75 p-5 shadow-lg shadow-black/20 backdrop-blur light:border-slate-200 light:bg-white/85 light:shadow-slate-200/70"
        >
          <p className="text-sm text-slate-400 light:text-slate-500">{card.label}</p>
          <p className={`mt-2 text-3xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}

export default StatsCards