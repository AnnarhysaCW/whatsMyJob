# WhatsMyJob (The Bad Edition)

A fun web game where players try to guess or describe jobs as badly as possible! Each round presents a job title, and players can add, edit, and vote on the worst (or funniest) job descriptions. The game features a timer for each question, a leaderboard, and a modern, interactive UI.

## Features
- 20 unique, modern job titles
- Add, edit, and vote on job descriptions
- Timer for each question (editable, resets per question)
- Leaderboard at the end
- Built with React, TypeScript, Vite, TailwindCSS, and Radix UI

## Setup & Development

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd whatsMyJob
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```
- The app will be available at `http://localhost:5173` (or as shown in your terminal).

### 4. Build for production
```bash
npm run build
```

### 5. Preview the production build
```bash
npm run preview
```

## Customization
- To change the job list, edit `src/components/home.tsx` (`initialJobs` array).
- To reset local jobs data during development, use the "Reset Jobs (Dev Only)" button (remove before deploying to production).

## License
MIT (or your preferred license)
