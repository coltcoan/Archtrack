# ArchTrack

A modern project tracking application for architecture and solution teams. Built with React, TypeScript, and Vite.

## Features

- 📊 **Dashboard Analytics** - View projects due in 7, 30, and 60 days, blocked projects, and top customers
- 📋 **Kanban Board** - Drag-and-drop project management with status tracking
- 👥 **Customer Management** - Track customers, stakeholders, and their projects
- 🔧 **Technology Tracking** - Organize projects by solution areas and technologies
- 📈 **Reports** - Generate project reports by customer, technology, and status
- 💾 **Local Data Storage** - All data stored locally in JSON files for complete control

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/coltcoan/archtrack.git
   cd archtrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your local database**
   
   Create a folder anywhere on your system to store your project data. For example:
   ```bash
   mkdir ~/ArchTrack-Data
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   
   Navigate to `http://localhost:5173` in your browser.

4. **Configure your database location**
   
   On first launch, you'll be prompted to set up ArchTrack:
   - Click "Set Up ArchTrack"
   - Enter the path to your data folder (e.g., `/Users/yourname/ArchTrack-Data`)
   - Optionally configure solution area and skillset filters
   - Click "Save Configuration"

## Database Structure

ArchTrack stores all data as JSON files in your configured database location:

```
ArchTrack-Data/
├── settings.json          # App configuration
├── technology-settings.json  # Solution areas and technologies
├── customers/            # Customer records
│   ├── 1.json
│   └── 2.json
├── projects/             # Project records
│   ├── 1.json
│   └── 2.json
└── solution-areas/       # Legacy technology data (deprecated)
    └── areas.json
```

### Backup Your Data

Simply copy your ArchTrack-Data folder to back up all your projects and customers!

## Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run server` - Run backend server only
- `npm run init-db` - Initialize demo data (optional)
- `npm run migrate-tech` - Migrate default technology settings to your database
- `npm run deploy` - Deploy to GitHub Pages

## Deploying to GitHub Pages

ArchTrack can be hosted as a static demo on GitHub Pages. **Note**: Users will still need to run the app locally with the backend server to use it with their own data.

### Quick Deploy (Manual)

1. **Create a GitHub repository**
   ```bash
   git init
   git remote add origin https://github.com/coltcoan/archtrack.git
   ```

2. **Set the base path**
   
   Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your repo name:
   ```
   VITE_BASE_PATH=/archtrack/
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to Pages section
   - Select `gh-pages` branch as the source

### Automatic Deploy (GitHub Actions)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys on every push to `main`:

1. Update `VITE_BASE_PATH` in the workflow file to match your repository name
2. Enable GitHub Pages in your repository settings
3. Push to main branch - deployment happens automatically!

Your app will be available at `https://coltcoan.github.io/archtrack/`

### Using the GitHub Pages Demo

The GitHub Pages deployment serves as a demo/landing page. To actually use ArchTrack with your data:

1. Clone the repository
2. Follow the installation instructions above
3. Run locally with `npm run dev`
4. Configure your local database path

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: TanStack Query (React Query), Jotai
- **Routing**: React Router v6
- **Backend**: Express.js (local development only)
- **Icons**: Lucide React

## Configuration

### Solution Areas

Define custom solution areas and technologies in the Settings page:
- Navigate to Settings → Technology
- Add solution areas (e.g., "Microsoft 365", "Power Platform")
- Add technologies under each solution area
- Technologies can be tagged as Government-specific

### Skillset Filtering

Filter projects and data by your team's skillset:
- Navigate to Settings → Profile
- Enter skillset tags (comma-separated)
- Projects will be filtered based on primary technology

## Data Export

Generate reports and export data:
- Navigate to the Reports page
- Select filter criteria (customer, technology, status)
- Download as Excel file

## Demo Mode

For presentations or testing, enable Demo Mode in Settings:
- Switch to Settings → Profile
- Toggle "Demo Mode"
- Demo data will be used instead of your actual data
- All changes in demo mode are temporary

## Troubleshooting

### "Failed to fetch" errors

If you see connection errors:
1. Ensure the backend server is running (`npm run server`)
2. Check that port 3001 is not in use
3. Verify your database path is accessible

### Database not loading

1. Check that your database folder exists and is readable
2. Verify the path in Settings matches your actual folder
3. Try reconfiguring in Settings → Profile

### GitHub Pages deployment issues

1. Ensure `VITE_BASE_PATH` in `.env` matches your repository name
2. Verify GitHub Pages is enabled in repository settings
3. Check that the `gh-pages` branch was created successfully

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

---

Built with ❤️ for architecture and solution teams
