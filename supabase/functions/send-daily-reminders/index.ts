import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type Task = {
  id: number
  title: string
  description: string | null
  due_at: string | null
  priority: string | null
  status: string | null
  created_by: string
  reminder_sent_at: string | null
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

function formatStatus(status: string | null) {
  if (status === 'in_progress') return 'In Progress'
  if (status === 'done') return 'Done'
  return 'To Do'
}

function formatPriority(priority: string | null) {
  if (!priority) return 'Medium'
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

function formatDueDate(dueAt: string | null) {
  if (!dueAt) return 'No due date'

  return new Date(dueAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function buildTaskRows(tasks: Task[]) {
  return tasks
    .map((task) => {
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
            <strong>${task.title}</strong>
            <br />
            <span style="color: #64748b;">${task.description || 'No description'}</span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
            ${formatPriority(task.priority)}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
            ${formatStatus(task.status)}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
            ${formatDueDate(task.due_at)}
          </td>
        </tr>
      `
    })
    .join('')
}

function buildTextTasks(tasks: Task[]) {
  return tasks
    .map((task, index) => {
      return `${index + 1}. ${task.title}
Description: ${task.description || 'No description'}
Priority: ${formatPriority(task.priority)}
Status: ${formatStatus(task.status)}
Due: ${formatDueDate(task.due_at)}`
    })
    .join('\n\n')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
      return new Response(
        JSON.stringify({
          error: 'Missing SUPABASE_URL, SERVICE_ROLE_KEY, or RESEND_API_KEY',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const now = new Date()
    const dueWindowEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const reminderCooldown = new Date(now.getTime() - 23 * 60 * 60 * 1000)

    const { data: tasks, error: taskError } = await supabase
      .from('tasks')
      .select(
        'id, title, description, due_at, priority, status, created_by, reminder_sent_at'
      )
      .eq('reminder_enabled', true)
      .eq('is_complete', false)
      .not('due_at', 'is', null)
      .lte('due_at', dueWindowEnd.toISOString())
      .or(
        `reminder_sent_at.is.null,reminder_sent_at.lt.${reminderCooldown.toISOString()}`
      )
      .order('due_at', { ascending: true })

    if (taskError) {
      return new Response(JSON.stringify({ error: taskError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!tasks || tasks.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No reminders to send.',
          sent: 0,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const tasksByUser = new Map<string, Task[]>()

    for (const task of tasks as Task[]) {
      if (!tasksByUser.has(task.created_by)) {
        tasksByUser.set(task.created_by, [])
      }

      tasksByUser.get(task.created_by)?.push(task)
    }

    let sentCount = 0
    let skippedCount = 0
    const errors: unknown[] = []

    for (const [userId, userTasks] of tasksByUser.entries()) {
      const { data: userData, error: userError } =
        await supabase.auth.admin.getUserById(userId)

      if (userError || !userData?.user?.email) {
        skippedCount += userTasks.length
        errors.push({
          userId,
          error: userError?.message || 'No user email found',
        })
        continue
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .maybeSingle()

      const email = userData.user.email
      const fullName = profile?.full_name || 'there'

      const subject =
        userTasks.length === 1
          ? `Task Reminder: ${userTasks[0].title}`
          : `Task Reminder: ${userTasks.length} tasks due soon`

      const html = `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2 style="margin-bottom: 8px;">Daily Task Reminder</h2>
          <p>Hey ${fullName},</p>
          <p>You have ${userTasks.length} task${
            userTasks.length === 1 ? '' : 's'
          } due within the next 24 hours or already overdue.</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 16px; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="padding: 10px; text-align: left;">Task</th>
                <th style="padding: 10px; text-align: left;">Priority</th>
                <th style="padding: 10px; text-align: left;">Status</th>
                <th style="padding: 10px; text-align: left;">Due</th>
              </tr>
            </thead>
            <tbody>
              ${buildTaskRows(userTasks)}
            </tbody>
          </table>

          <p style="margin-top: 18px;">
            Open Team Task Manager to update, complete, or reschedule your tasks.
          </p>
        </div>
      `

      const text = `
Daily Task Reminder

Hey ${fullName},

You have ${userTasks.length} task${
        userTasks.length === 1 ? '' : 's'
      } due within the next 24 hours or already overdue.

${buildTextTasks(userTasks)}

Open Team Task Manager to update, complete, or reschedule your tasks.
`

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Team Task Manager <onboarding@resend.dev>',
          to: [email],
          subject,
          html,
          text,
        }),
      })

      const resendData = await resendResponse.json()

      if (!resendResponse.ok) {
        skippedCount += userTasks.length
        errors.push({
          userId,
          email,
          error: resendData,
        })
        continue
      }

      const taskIds = userTasks.map((task) => task.id)

      const { error: updateError } = await supabase
        .from('tasks')
        .update({
          reminder_sent_at: now.toISOString(),
        })
        .in('id', taskIds)

      if (updateError) {
        errors.push({
          userId,
          email,
          error: updateError.message,
        })
      }

      for (const taskId of taskIds) {
        await supabase.rpc('increment_task_reminder_count', {
          task_id_input: taskId,
        })
      }

      await supabase.from('activity_logs').insert([
        {
          user_id: userId,
          task_id: null,
          action: `Automatic reminder email sent for ${userTasks.length} task${
            userTasks.length === 1 ? '' : 's'
          }.`,
        },
      ])

      sentCount += userTasks.length
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        skipped: skippedCount,
        errors,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})