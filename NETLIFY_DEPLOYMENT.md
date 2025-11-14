# Netlify Deployment Guide

This guide will help you deploy your portfolio to Netlify.

## Prerequisites

- A GitHub, GitLab, or Bitbucket account
- A Netlify account (sign up at [netlify.com](https://www.netlify.com/))
- A Gemini API key (for the chat feature)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (you'll need this for Netlify environment variables)

### 3. Deploy to Netlify

#### Option A: Deploy via Netlify Dashboard

1. **Log in to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com/)
   - Sign in or create an account

2. **Import Your Project**
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Netlify to access your repositories
   - Select your portfolio repository

3. **Configure Build Settings**
   Netlify should auto-detect these settings from `netlify.toml`:
   - **Build command:** `pnpm build`
   - **Publish directory:** `.next`
   - **Node version:** `18` (from `.nvmrc`)

4. **Set Environment Variables**
   - Before deploying, click "Show advanced" → "New variable"
   - Add the following environment variables:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     NODE_ENV=production
     ```
   - Optional: Add `GEMINI_MODEL=gemini-2.5-flash` if you want to specify a model

5. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (usually 2-5 minutes)
   - Your site will be live at `https://your-site-name.netlify.app`

#### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   # Initialize (first time only)
   netlify init
   
   # Deploy
   netlify deploy --prod
   ```

4. **Set Environment Variables via CLI**
   ```bash
   netlify env:set GEMINI_API_KEY "your_api_key_here"
   netlify env:set NODE_ENV "production"
   ```

### 4. Configure Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your domain's DNS

### 5. Enable Continuous Deployment

Netlify automatically enables continuous deployment:
- Every push to your main branch triggers a new deployment
- You can configure branch-specific builds in Site settings → Build & deploy

## Troubleshooting

### Build Fails

1. **Check Build Logs**
   - Go to Deploys → Click on the failed deploy → View build log
   - Look for error messages

2. **Common Issues:**
   - **Missing Environment Variables:** Make sure `GEMINI_API_KEY` is set
   - **Node Version Mismatch:** Ensure Node 18 is used (check `.nvmrc`)
   - **Build Timeout:** Large builds might timeout; consider optimizing

### API Routes Not Working

- Netlify's Next.js Runtime automatically converts `/api/*` routes to serverless functions
- Make sure environment variables are set correctly
- Check function logs in Netlify dashboard

### PWA Not Working

- Service workers are generated during build
- Make sure `NODE_ENV=production` is set
- Check browser console for service worker errors

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Your Google Gemini API key |
| `GEMINI_MODEL` | No | Gemini model to use (default: `gemini-2.5-flash`) |
| `NODE_ENV` | Yes | Set to `production` for production builds |
| `SKIP_ENV_VALIDATION` | No | Set to `true` to skip env validation (not recommended) |

## Post-Deployment

1. **Test Your Site**
   - Visit your deployed site
   - Test the chat feature
   - Test the game
   - Check mobile responsiveness

2. **Monitor Performance**
   - Use Netlify Analytics (if enabled)
   - Check function logs for API errors
   - Monitor build times

3. **Update Content**
   - Make changes in your repository
   - Push to trigger automatic deployment
   - Changes go live in 2-5 minutes

## Support

If you encounter issues:
1. Check [Netlify's Next.js documentation](https://docs.netlify.com/integrations/frameworks/nextjs/)
2. Review build logs in Netlify dashboard
3. Check [Next.js deployment docs](https://nextjs.org/docs/deployment)

