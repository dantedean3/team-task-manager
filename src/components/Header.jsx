import ThemeToggle from './ThemeToggle'

function Header({ session, profile, theme, setTheme }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl light:border-slate-200 light:bg-white/80 light:shadow-slate-200/60 sm:p-8">
      <div className="absolute -left-20 -top-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -bottom-20 right-0 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300 light:text-cyan-700 sm:text-sm">
            Portfolio Project
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white light:text-slate-950 sm:text-4xl md:text-5xl">
            Team Task Manager
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 light:text-slate-600 md:text-base">
            A polished task management app built with React, Supabase Auth, and
            Postgres, featuring filters, sorting, due dates, status tracking,
            analytics, and workflow management.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ThemeToggle theme={theme} setTheme={setTheme} />

          {session && (
            <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-sm text-slate-300 shadow-lg light:border-slate-200 light:bg-white light:text-slate-600">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Signed in as
              </p>
              <p className="mt-1 max-w-[220px] truncate font-semibold text-white light:text-slate-950">
                {profile?.full_name || session.user.email}
              </p>
              {profile?.full_name && (
                <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400 light:text-slate-500">
                  {session.user.email}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header