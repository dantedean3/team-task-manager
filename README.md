# Team Task Manager

A full-stack task management application built with React, Supabase Auth, and PostgreSQL.  
This app allows users to create, manage, and track tasks with real-time updates, filtering, and sorting.

---

## 🚀 Live Demo
👉 https://team-task-manager-nine-alpha.vercel.app/



---

## ⚙️ Features

- 🔐 User authentication (Sign up / Login / Logout)
- ✅ Full CRUD task management
- 📅 Due date + time tracking
- ⚠️ Overdue and “due soon” detection
- 📊 Dashboard statistics (total, completed, overdue, etc.)
- 🔍 Search functionality
- 🎯 Advanced filtering:
  - All
  - Pending
  - In Progress
  - Completed
  - High Priority
  - Overdue
- 🔃 Sorting options:
  - Newest / Oldest
  - Due soon
  - Priority
  - Alphabetical
- 🧠 Status workflow:
  - To Do → In Progress → Done
- 🎨 Modern UI with Tailwind CSS
- 🔔 Toast notifications for user actions
- ⚡ Real-time backend powered by Supabase

---

## 🧱 Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS

**Backend / Database**
- Supabase (PostgreSQL)
- Supabase Auth

**Deployment**
- Vercel

---

## 🏗️ Architecture

- React handles UI and state management
- Supabase provides:
  - Authentication
  - Database (Postgres)
  - Row-level security
- Tasks are tied to authenticated users via `created_by`
- Filtering, sorting, and search handled client-side for performance

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/dantedean3/team-task-manager.git
cd team-task-manager
