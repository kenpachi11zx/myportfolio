# 🖥️ Personal Portfolio

A sleek, modern, and responsive portfolio bootstrapped with [create-t3-app](https://create.t3.gg/).

[🔗 Link to portfolio](https://devxfolio.netlify.app/)

This is the portfolio website of **Sahil Islam**, a Full Stack Developer based in Guwahati. The portfolio showcases 8 featured projects including enterprise applications, AI-powered solutions, and full-stack web applications built with .NET Core, React, Python, AWS, and more.

## About

I am a Full Stack developer focused on creating interactive digital experiences on the web, working with technologies such as .NET Core, React, Python, AWS, SQL Server, and Entity Framework amongst others. Currently pursuing Bachelor of Technology in Computer Science & Engineering at The Assam Kaziranga University (2022-2026).

**Work Experience:** Software Development Intern at Indian Oil Corporation Limited (IOCL) - June 2025 to July 2025. Developed secure enterprise portal using ASP.NET Core MVC, implemented multi-level approval system with RBAC for 8 user roles.

## 🎉 Features
- **Responsive Design**: The portfolio is designed to be fully responsive, providing an optimal viewing experience across a wide range of devices from desktops to mobile phones.
- **Easy Customization**: The portfolio structure is straightforward and well organized, making it easy to customize and showcase your unique set of skills and projects.
- **Stunning UI/UX Design**: The portfolio boasts a sleek and modern design, using smooth animations to capture the attention of potential employers or clients.
- **Interactive UI**: Utilizing modern web development techniques, the portfolio offers an interactive user interface that enhances user experience, such as `locomotive-scroll` and `framer-motion`.

## 🚀 Getting Started

### Prerequisites
To get started with this portfolio, ensure that you have the following installed on your system:
- Node.js
- npm
- git

## 🛠️ Installation
Follow the steps below to clone and run this project on your local system:

```bash
# Clone the repository
$ git clone https://github.com/sahilislam619/developer-portfolio.git

# Navigate to the project directory
$ cd developer-portfolio

# Remove current origin repository (if needed)
$ git remote remove origin
```

<br />

Then install the required dependencies:
```bash
# Install dependencies
$ npm install

# Start the development server:
$ npm run dev
```
Now, open your browser and navigate to `http://localhost:3000` to view your portfolio live.


## 🚀 Deployment

### Deploy to Netlify

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect to Netlify:**
   - Go to [Netlify](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

3. **Configure Build Settings:**
   - Build command: `pnpm build`
   - Publish directory: `.next` (auto-detected by Netlify)
   - Node version: `18` (specified in `.nvmrc`)

4. **Set Environment Variables:**
   In Netlify dashboard, go to Site settings → Environment variables and add:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash (optional)
   NODE_ENV=production
   SKIP_ENV_VALIDATION=false (set to true only if you want to skip validation)
   ```

5. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site
   - Your site will be available at `https://your-site-name.netlify.app`

### Environment Variables

Create a `.env.local` file in the root directory for local development:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
NODE_ENV=development
```

**Note:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### Other Deployment Options

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
