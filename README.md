# Project Management Application

A comprehensive project management platform built with Next.js, featuring task management, team collaboration, and project tracking.

## Features

- **Project Management**: Create and manage projects with detailed information.
- **Task Management**: Organize tasks within projects with status tracking.
- **Team Collaboration**: Assign tasks to team members and track progress.
- **Multiple Views**: View projects in Board, List, Timeline, and Table formats.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.
- **Dark Mode**: Support for both light and dark themes.
- **Toast Notifications**: Real-time feedback for user actions.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit, RTK Query
- **UI Components**: Radix UI, Lucide React
- **Notifications**: goey-toast

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd project_management
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Configuration

Ensure you have a `.env.local` file in the `frontend` directory with the following variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

- Navigate to the dashboard to view existing projects.
- Click "New Project" to create a new project.
- Use the tabs (Board, List, Timeline, Table) to switch between different project views.
- Filter and search tasks to manage your workload efficiently.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
