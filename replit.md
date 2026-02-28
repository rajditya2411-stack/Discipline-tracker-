# Discipline Tracker

A React-based habit and time block tracking application.

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
  App.jsx              - Main app component with routing
  main.jsx             - Entry point
  index.css            - Global styles
  components/          - Reusable UI components
    dashboard/         - Dashboard-specific components
    layout/            - Layout components
    modals/            - Modal components
    pages/             - Page-level components
  context/             - React context providers
    HabitsContext.jsx  - Habits state management
    TimeBlocksContext.jsx - Time blocks state management
    UserContext.jsx    - User state management
  pages/
    Dashboard.jsx      - Main dashboard page
  utils/
    categories.js      - Category utilities
```

## Development

- Run `npm run dev` to start the development server on port 5000
- Run `npm run build` to build for production (output in `dist/`)

## Deployment

Configured as a static site deployment:
- Build command: `npm run build`
- Public directory: `dist`
