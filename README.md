# NEURAKEI - AI-Powered Content Recovery System

NEURAKEI is an advanced AI-powered meeting recovery system that transforms meeting transcripts, chat logs, social threads, and brainstorm sessions into actionable insights using an innovative cyberpunk-inspired interface.

## Features

- **TRI-CORE Processing System**: Three specialized analysis modes (Synthrax, Vantix, Lymnia)
- **Multi-Content Support**: Meetings, social threads, and brainstorm/notes processing
- **File Upload Support**: Text, DOCX, SRT, and PDF file processing
- **Firebase Authentication**: Google sign-in and email/password authentication
- **Memory Bank**: Tag and organize your insights with PostgreSQL storage
- **Credit System**: Usage tracking with license key redemption
- **Export Options**: Copy, download, and Notion integration
- **Cyberpunk Interface**: Evangelion MAGI-inspired design with responsive micro-interactions

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase Auth
- **AI Integration**: OpenRouter API with DeepSeek R1 model
- **Styling**: Tailwind CSS with Radix UI components
- **File Processing**: Multer + PDF.js

## Deployment Guide

### Prerequisites

Before deploying, ensure you have:

1. **PostgreSQL Database**: Set up a PostgreSQL instance (recommended: [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [PlanetScale](https://planetscale.com/))
2. **Firebase Project**: Create a Firebase project with Authentication enabled
3. **OpenRouter API Key**: Get your API key from [OpenRouter](https://openrouter.ai/)

### Environment Variables

Create the following environment variables for your deployment:

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# OpenRouter AI API
OPENROUTER_API_KEY="your-openrouter-api-key"

# Firebase Configuration (Client-side - prefix with VITE_)
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_PROJECT_ID="your-firebase-project-id"
VITE_FIREBASE_APP_ID="your-firebase-app-id"

# Production Environment
NODE_ENV="production"
```

### Deploy on Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Build Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   - Go to Project Settings > Environment Variables
   - Add all the environment variables listed above

5. **Configure vercel.json**:
   Create a `vercel.json` file in your project root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node",
         "config": {
           "includeFiles": ["dist/**"]
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/dist/public/$1"
       }
     ],
     "functions": {
       "server/index.ts": {
         "maxDuration": 30
       }
     }
   }
   ```

6. **Deploy**:
   ```bash
   vercel --prod
   ```

### Deploy on Netlify

1. **Install Netlify CLI** (optional):
   ```bash
   npm install -g netlify-cli
   ```

2. **Connect Repository**:
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Choose your repository

3. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`

4. **Add Environment Variables**:
   - Go to Site Settings > Environment Variables
   - Add all the environment variables listed above

5. **Configure Netlify Functions**:
   Create a `netlify.toml` file in your project root:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist/public"
     functions = "netlify/functions"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/server/:splat"
     status = 200

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

6. **Create Netlify Function**:
   Create `netlify/functions/server.js`:
   ```javascript
   const { createServer } = require('../../dist/server/index.js');

   exports.handler = async (event, context) => {
     const server = await createServer();
     
     return new Promise((resolve, reject) => {
       const req = {
         method: event.httpMethod,
         url: event.path,
         headers: event.headers,
         body: event.body
       };
       
       const res = {
         statusCode: 200,
         headers: {},
         body: '',
         setHeader: (name, value) => {
           res.headers[name] = value;
         },
         end: (data) => {
           res.body = data;
           resolve(res);
         }
       };
       
       server(req, res);
     });
   };
   ```

7. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Deploy on Railway

1. **Connect Repository**:
   - Go to [Railway Dashboard](https://railway.app/)
   - Click "New Project"
   - Choose "Deploy from GitHub repo"

2. **Configure Environment Variables**:
   - Add all environment variables in the Railway dashboard

3. **Configure Build**:
   Railway will automatically detect your Node.js app and build it.

4. **Custom Start Command** (if needed):
   ```bash
   npm run build && npm start
   ```

### Deploy on Render

1. **Connect Repository**:
   - Go to [Render Dashboard](https://render.com/)
   - Click "New" > "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. **Add Environment Variables**:
   - Add all environment variables in the Render dashboard

4. **Configure Health Check**:
   - Health Check Path: `/api/health` (you may need to add this endpoint)

### Database Setup

1. **Run Migrations**:
   After deployment, run database migrations:
   ```bash
   npm run db:push
   ```

2. **Seed Data** (optional):
   If you have seed data, run:
   ```bash
   npm run db:seed
   ```

### Firebase Configuration

1. **Enable Authentication**:
   - Go to Firebase Console
   - Enable Google Sign-in and Email/Password authentication
   - Add your deployment domain to authorized domains

2. **Update Firebase Config**:
   - Add your production domain to Firebase Authentication settings
   - Update CORS settings if needed

### Post-Deployment Checklist

- [ ] Database is accessible and migrations are run
- [ ] Firebase authentication is working
- [ ] OpenRouter API key is valid and working
- [ ] All environment variables are set correctly
- [ ] File upload functionality is working
- [ ] Export features are functioning
- [ ] Memory Bank is saving data correctly
- [ ] Credit system is operational

### Troubleshooting

**Common Issues:**

1. **Database Connection**: Ensure DATABASE_URL is correct and database is accessible
2. **Firebase Auth**: Check if domains are added to Firebase authorized domains
3. **API Timeout**: Increase function timeout limits on your platform
4. **File Upload**: Check file size limits on your deployment platform
5. **Environment Variables**: Ensure all variables are prefixed correctly (VITE_ for client-side)

### Performance Optimization

- Enable gzip compression
- Configure CDN for static assets
- Set up proper caching headers
- Monitor API response times
- Consider implementing rate limiting

### Security Considerations

- Use HTTPS in production
- Implement proper CORS settings
- Validate all user inputs
- Use environment variables for sensitive data
- Regularly update dependencies

## Local Development

To run locally:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd neurakei
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file with the required variables

4. **Run the application**:
   ```bash
   npm run dev
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For deployment issues or questions, please check the troubleshooting section above or create an issue in the repository.