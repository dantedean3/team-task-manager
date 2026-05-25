function ActivityFeed({ activityLogs }) {
  function formatDate(value) {
    if (!value) return ''

    return new Date(value).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-white">Activity Feed</h2>
        <p className="mt-1 text-sm text-slate-400">
          Recent changes made to your tasks.
        </p>
      </div>

      {activityLogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-8 text-center">
          <p className="text-sm text-slate-400">
            No activity yet. Create or update a task to see logs here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"
            >
              <p className="text-sm font-medium text-slate-200">{log.action}</p>
              <p className="mt-1 text-xs text-slate-500">
                {formatDate(log.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivityFeed