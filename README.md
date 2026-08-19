# Jarvis Task Manager

![Jarvis Banner](https://via.placeholder.com/1200x300/080c12/6366f1?text=Jarvis+Task+Manager)

**Jarvis** is a premium, modern task management and daily planning web application built to help you organize your work with purpose and clarity. It combines a focused daily planner, calendar events, project-linked notes, and tasks into a beautifully designed, glassmorphic workspace.



## ✨ Key Features

### 🎯 Today Workspace
- **3-Task Focus System**: Pin up to three core priorities for the day to maintain focus.
- **Progress Tracking**: Live progress bars track your completion rate for the day's scheduled tasks and priorities.
- **Unified Daily View**: See today's tasks and scheduled calendar events in a single, color-coded dashboard.
- **Smart Inbox**: Capture unplanned work quickly and schedule or prioritize it on the fly.

### 🗓️ Calendar & Events
- **Week-by-Week Navigation**: Seamlessly navigate through your timeline with smart week pagination.
- **All-Events Panel**: A persistent right-side panel that displays all your events chronologically, ensuring nothing gets lost outside the current week view.
- **Smart Visuals**: Distinct visual badges for timed events versus task due dates.

### 🗂️ Project & Notes Management
- **Folders**: Organize tasks and notes into color-coded projects.
- **Contextual Notes**: Keep long-form notes attached to specific projects for richer context.

### 🎨 Premium UI/UX
- **Intelligent Theming**: Full support for both a deep charcoal-navy Dark Mode and a crisp, clean Light Mode.
- **Glassmorphism**: Beautiful frosted-glass panels, subtle glows, and ambient floating orbs in the background.
- **Polished Micro-interactions**: Hover reveals, gradient buttons with shimmer effects, pulse-ring animations, and staggered fade-up entrances.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Data Fetching & Caching**: [TanStack React Query](https://tanstack.com/query/latest)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Date Utilities**: [date-fns](https://date-fns.org/)

### Backend Integration
- REST API integration via Axios with interceptor-based authentication (Bearer Tokens).
- Dedicated endpoints for `/auth`, `/tasks`, `/events`, `/notes`, and `/profile`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm
- A running instance of the Jarvis backend API (defaulting to `http://localhost:5000`)

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd Task-Manager
   ```

2. **Navigate to the frontend directory**:
   ```bash
   cd Frontend/my-app
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Project Structure

```text
Frontend/my-app/
├── src/
│   ├── app/                 # Next.js App Router pages (login, register, calendar, dashboard)
│   ├── components/          # Reusable UI components
│   │   ├── dashboard/       # Complex workspace components (sidebar, header, today-workspace)
│   │   └── ui/              # shadcn base components (buttons, inputs, dialogs)
│   ├── hooks/               # Custom React Query hooks (use-events, use-create-task, etc.)
│   ├── lib/                 # Utilities (axios instance, error handlers)
│   ├── store/               # Redux configuration and slices
│   └── types/               # TypeScript interfaces (Task, Event, Folder, etc.)
└── package.json             # Project metadata and dependencies
```

---

## 💡 Recent Architectural Improvements

- **Authentication Lifecycle**: Integrated TanStack Query closely with Redux Persist. Queries for sensitive data (like events and notes) intelligently wait for the Redux store to rehydrate the JWT token before firing, preventing silent data failures.
- **Dynamic Theming Engine**: Refactored global CSS to utilize CSS variables bound to both `:root` (Light Mode) and `.dark` (Dark Mode). Hardcoded Tailwind opacity utilities (e.g., `bg-white/5`) were replaced with dynamic `foreground/background` references to ensure perfect contrast in both themes. 
- **Calendar Data Mapping**: Resolved calendar overflow issues by implementing comprehensive date-fns navigation logic alongside a global "All Events" chronological panel.

---

## 📜 License

This project is proprietary and confidential.
