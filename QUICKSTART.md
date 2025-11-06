# Quick Start Guide

Get ArchTrack running in 5 minutes!

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/archtrack.git
cd archtrack

# 2. Install dependencies
npm install

# 3. Start the app
npm run dev
```

Open `http://localhost:5173` in your browser.

## First Time Setup

When you first open ArchTrack, you'll see a setup prompt:

1. **Click "Set Up ArchTrack"**

2. **Enter your database path**
   - Choose any folder on your computer where you want to store your data
   - Example: `/Users/yourname/Documents/ArchTrack-Data`
   - The folder will be created automatically if it doesn't exist

3. **Optional: Configure filters**
   - **Solution Area**: Filter the technology dropdown (e.g., "Power Platform", "Microsoft 365")
   - **Skillset**: Comma-separated list of technologies your team focuses on

4. **Click "Save Configuration"**

You're ready to go! 🎉

## Creating Your First Project

1. Click **"New Project"** button
2. Fill in the details:
   - Project Name (required)
   - Customer (select or create new)
   - Description
   - Due Date
   - Primary Technology
   - Status (Backlog, In Progress, Blocked, Delayed, Completed)
   - Estimated Usage
   - Intent and Buy-in checkboxes
3. Click **"Create Project"**

## Creating Your First Customer

1. Click **"Customers"** in the navigation
2. Click **"New Customer"**
3. Enter:
   - Customer Name (required)
   - Key Stakeholders (click Add Stakeholder)
   - Primary Tech Focus
4. Click **"Create Customer"**

## Understanding the Dashboard

The Dashboard shows:
- **Summary cards**: Total projects, in progress, blocked, completed
- **7/30/60 day view**: Projects due soon
- **Blocked projects**: Projects needing attention (shown in red)
- **Top customers**: Ranked by number of projects
- **Status breakdown**: Visual distribution of project statuses

## Switching Views

### Projects Page
- **List View**: See all projects in a table
- **Kanban View**: Drag and drop projects between status columns
  - Click the toggle in the top right to switch views

### Reports Page
- Filter by customer, technology, or status
- Download as Excel file

## Managing Technologies

1. Go to **Settings** → **Technology**
2. **Add Solution Areas**: Groups of related technologies
3. **Add Technologies**: Individual tech stack items
   - Mark as "Government" if applicable
4. These appear in dropdowns when creating/editing projects

## Demo Mode

Want to show ArchTrack without using real data?

1. Go to **Settings** → **Profile**
2. Toggle **"Demo Mode"** on
3. Sample data will be displayed
4. All changes are temporary
5. Toggle off to return to your real data

## Data Backup

Your data is stored as JSON files in the folder you configured. To backup:

```bash
# Copy your entire data folder
cp -r ~/ArchTrack-Data ~/ArchTrack-Data-Backup
```

Or just copy the folder in Finder/Explorer!

## Keyboard Shortcuts

- `Ctrl/Cmd + K` - Quick search (coming soon)
- `Esc` - Close modals
- Click anywhere outside a modal to close it

## Troubleshooting

### "Failed to fetch" errors
- Make sure the app is running with `npm run dev`
- The backend server must be running on port 3001

### Can't find my data
- Go to Settings → Profile
- Verify the database path is correct
- Make sure the folder exists and is readable

### Dashboard is empty
- Create your first customer and project
- Or enable Demo Mode to see sample data

## Next Steps

- Customize solution areas and technologies
- Import existing project data (if applicable)
- Set up skillset filtering for your team
- Generate reports for stakeholders

## Need Help?

- Check the full [README.md](./README.md)
- Review the [Deployment Guide](./DEPLOYMENT.md) for GitHub Pages
- Open an issue on GitHub

Happy tracking! 🚀
