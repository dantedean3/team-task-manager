function AttachmentUploader({
  task,
  attachments,
  uploadAttachment,
  openAttachment,
  deleteAttachment,
}) {
  const taskAttachments = attachments.filter(
    (attachment) => String(attachment.task_id) === String(task.id)
  )

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-3 light:border-slate-200 light:bg-slate-50">
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 light:text-slate-500">
            Attachments
          </p>

          {taskAttachments.length === 0 ? (
            <p className="mt-1 text-xs text-slate-500">No files attached</p>
          ) : (
            <div className="mt-2 space-y-2">
              {taskAttachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 light:border-slate-200 light:bg-white"
                >
                  <button
                    onClick={() => openAttachment(attachment)}
                    className="min-w-0 flex-1 truncate text-left text-xs font-medium text-cyan-300 transition hover:text-cyan-200 light:text-cyan-700 light:hover:text-cyan-600"
                    title={attachment.file_name}
                  >
                    {attachment.file_name}
                  </button>

                  <button
                    onClick={() => deleteAttachment(task, attachment)}
                    className="shrink-0 rounded-md bg-rose-500 px-2 py-1 text-[11px] font-semibold text-white transition hover:bg-rose-400"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <label className="cursor-pointer rounded-lg bg-slate-800 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-slate-700 light:bg-slate-200 light:text-slate-800 light:hover:bg-slate-300">
          Upload File
          <input
            type="file"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) uploadAttachment(task, file)
              event.target.value = ''
            }}
          />
        </label>
      </div>
    </div>
  )
}

export default AttachmentUploader