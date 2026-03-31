function Toast({ toast, onClose }) {
  if (!toast) return null

  const styles = {
    success: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200',
    error: 'border-rose-500/30 bg-rose-500/15 text-rose-200',
    info: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-200',
  }

  return (
    <div className="fixed right-5 top-5 z-50">
      <div
        className={`min-w-[280px] rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur ${styles[toast.type] || styles.info}`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium">{toast.text}</p>
          <button
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wide opacity-80 hover:opacity-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast