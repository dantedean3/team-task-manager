function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:bg-white/15 light:border-slate-200 light:bg-white light:text-slate-900 light:hover:bg-slate-100"
    >
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}

export default ThemeToggle