# Deployment Guide for Himnario Adonai

This guide explains how to deploy the Himnario Adonai web application.

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Building for Production

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. The static files will be generated in the `out/` directory.

## Deployment Options

### Option 1: Vercel (Recommended)

The easiest way to deploy is using Vercel:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

Or connect your GitHub repository to Vercel for automatic deployments:
- Go to https://vercel.com
- Import your GitHub repository
- Vercel will automatically detect Next.js and configure the build

### Option 2: Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `out/` directory to Netlify:
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=out
   ```

### Option 3: GitHub Pages

#### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `out/` directory to GitHub Pages using your preferred method.

#### Automatic Deployment with GitHub Actions

A GitHub Actions workflow is included that automatically deploys to GitHub Pages on every push to the main branch.

To enable it:

1. Go to your repository settings on GitHub
2. Navigate to Pages section
3. Under "Build and deployment", select "GitHub Actions" as the source
4. Push to the main branch and the workflow will automatically deploy

The workflow file is located at `.github/workflows/deploy.yml`.

### Option 4: Static Hosting (S3, Cloudflare Pages, etc.)

The `out/` directory contains all static files. Simply upload the contents to any static hosting service.

## Development

To run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server (for non-static deployments)
- `npm run export` - Generate static export

## Environment Variables

No environment variables are required for basic deployment. The database is bundled with the application.

## Important Notes

- This is a static Next.js application that can be deployed anywhere
- The SQLite database is loaded in the browser using sql.js
- SQL.js WASM files are loaded from jsDelivr CDN (https://cdn.jsdelivr.net/npm/sql.js/)
- All fonts are included in the public directory
- The application is fully functional without a backend server

## Troubleshooting

If you encounter issues with the database loading:
- Ensure the CDN is accessible from your deployment environment
- Check browser console for any CORS or loading errors
- Verify that the `/database/himnario.db` file is being served correctly
