import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function AnalyticsDashboard({ tasks }) {
  const statusData = [
    {
      name: 'To Do',
      value: tasks.filter((task) => task.status === 'todo').length,
    },
    {
      name: 'In Progress',
      value: tasks.filter((task) => task.status === 'in_progress').length,
    },
    {
      name: 'Done',
      value: tasks.filter((task) => task.status === 'done').length,
    },
  ]

  const priorityData = [
    {
      name: 'Low',
      value: tasks.filter((task) => task.priority === 'low').length,
    },
    {
      name: 'Medium',
      value: tasks.filter((task) => task.priority === 'medium').length,
    },
    {
      name: 'High',
      value: tasks.filter((task) => task.priority === 'high').length,
    },
  ]

  const chartColors = ['#22d3ee', '#fbbf24', '#34d399']

  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold text-white">Analytics</h2>
        <p className="mt-1 text-sm text-slate-400">
          Visual breakdown of task progress and priority.
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-8 text-center">
          <p className="text-sm text-slate-400">
            Create tasks to see analytics.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <h3 className="mb-4 text-sm font-semibold text-slate-300">
              Tasks by Status
            </h3>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: '#020617',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#e2e8f0',
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={entry.name} fill={chartColors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <h3 className="mb-4 text-sm font-semibold text-slate-300">
              Priority Mix
            </h3>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={['#38bdf8', '#a78bfa', '#fb7185'][index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#020617',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#e2e8f0',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalyticsDashboard