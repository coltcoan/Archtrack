# GitHub Pages Deployment Guide

This guide walks you through deploying ArchTrack to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- The ArchTrack repository on your local machine

## Step-by-Step Deployment

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `archtrack`)
4. Choose "Public" (required for free GitHub Pages)
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 2. Connect Your Local Repository

If you haven't already initialized git:

```bash
git init
git add .
git commit -m "Initial commit"
```

Add your GitHub repository as remote:

```bash
git remote add origin https://github.com/YOUR_USERNAME/archtrack.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username and `archtrack` with your repository name.

### 3. Configure the Base Path

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and set the `VITE_BASE_PATH` to match your repository name:

```
VITE_BASE_PATH=/archtrack/
```

**Important**: The base path must start and end with a forward slash `/`

### 4. Deploy to GitHub Pages

Run the deployment command:

```bash
npm run deploy
```

This will:
1. Build your app for production
2. Create a `gh-pages` branch (if it doesn't exist)
3. Push the built files to the `gh-pages` branch

### 5. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click "Save"

### 6. Wait for Deployment

GitHub will build and deploy your site. This usually takes 1-3 minutes.

You'll see a message like: "Your site is published at https://yourusername.github.io/archtrack/"

## Updating Your Deployment

Whenever you make changes and want to update the GitHub Pages site:

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. Redeploy:
   ```bash
   npm run deploy
   ```

## Important Notes

### What's Deployed?

The GitHub Pages site is a **static demo only**. It shows the UI but:
- ❌ Cannot save data (no backend)
- ❌ Cannot load user data
- ✅ Shows the interface and navigation
- ✅ Demonstrates the app's capabilities

### How Users Should Use It

Users who want to actually use ArchTrack should:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/archtrack.git
   cd archtrack
   ```

2. **Install and run locally**:
   ```bash
   npm install
   npm run dev
   ```

3. **Configure their database path** in the app settings

This is clearly documented in the README.md.

## Custom Domain (Optional)

If you have a custom domain:

1. Add a `CNAME` file to the `public/` folder:
   ```
   yourdomain.com
   ```

2. Update your `.env`:
   ```
   VITE_BASE_PATH=/
   ```

3. Configure DNS with your domain provider:
   - Add a CNAME record pointing to `yourusername.github.io`

4. In GitHub repo Settings → Pages, enter your custom domain

## Troubleshooting

### Site shows 404 errors

- Check that `VITE_BASE_PATH` in `.env` matches your repo name
- Ensure the path starts and ends with `/`
- Try clearing your browser cache

### Assets not loading

- Verify the base path is correct
- Check browser console for 404 errors
- Make sure you ran `npm run deploy` after changing `.env`

### Changes not appearing

- Clear your browser cache
- Wait a few minutes for GitHub's CDN to update
- Check the Actions tab in GitHub for deployment status

### Site not found

- Verify GitHub Pages is enabled in Settings
- Ensure `gh-pages` branch exists
- Check that the repository is public

## Alternative: GitHub Actions Deployment

For automatic deployment on push, you can set up GitHub Actions:

1. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build
           run: npm run build
           env:
             VITE_BASE_PATH: /archtrack/
         
         - name: Deploy
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. Commit and push this file
3. Every push to `main` will automatically deploy!

## Questions?

If you run into issues:
1. Check the [README.md](./README.md) for setup instructions
2. Open an issue on GitHub
3. Review the GitHub Pages documentation

Happy deploying! 🚀
