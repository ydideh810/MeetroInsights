# NEURAKEI Deployment Troubleshooting Guide

## Analysis Hanging Issue

If your deployed app hangs during analysis without providing output, follow these debugging steps:

### 1. Check Health Endpoint

First, verify your deployment health:

```bash
curl https://your-deployed-app.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-16T...",
  "environment": "production",
  "hasApiKey": true,
  "hasDbUrl": true,
  "version": "1.0.0"
}
```

**If `hasApiKey` is false**: Your OpenRouter API key is not set correctly.
**If `hasDbUrl` is false**: Your database connection string is not configured.

### 2. Common Causes & Solutions

#### A. Missing or Invalid API Key

**Symptoms**: Analysis starts but never completes, no error messages.

**Solutions**:
1. Verify your OpenRouter API key:
   - Go to [OpenRouter](https://openrouter.ai/)
   - Check your API key in the dashboard
   - Ensure it has sufficient credits

2. Set the environment variable correctly:
   ```bash
   OPENROUTER_API_KEY="your-actual-api-key-here"
   ```

3. For different platforms:
   - **Vercel**: Project Settings > Environment Variables
   - **Netlify**: Site Settings > Environment Variables
   - **Railway**: Variables tab in project dashboard
   - **Render**: Environment tab in service dashboard

#### B. Database Connection Issues

**Symptoms**: App loads but user authentication fails or credits don't work.

**Solutions**:
1. Check your database connection string format:
   ```bash
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

2. Ensure your database is accessible from your deployment platform
3. Run database migrations after deployment:
   ```bash
   npm run db:push
   ```

#### C. Firebase Authentication Issues

**Symptoms**: Login works locally but not in production.

**Solutions**:
1. Add your deployment domain to Firebase authorized domains:
   - Go to Firebase Console > Authentication > Settings
   - Add your domain (e.g., `your-app.vercel.app`) to authorized domains

2. Verify Firebase environment variables:
   ```bash
   VITE_FIREBASE_API_KEY="your-firebase-api-key"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   ```

#### D. Request Timeout Issues

**Symptoms**: Analysis hangs for exactly 30-60 seconds then fails.

**Solutions**:
1. Increase function timeout limits:
   - **Vercel**: Max 30 seconds (hobby plan), 60 seconds (pro plan)
   - **Netlify**: Max 10 seconds (functions), 26 seconds (background functions)
   - **Railway**: Configurable timeout
   - **Render**: Max 30 seconds (free), configurable (paid)

2. Use shorter transcripts or break them into smaller chunks

3. Check OpenRouter model availability:
   - The app uses `deepseek/deepseek-r1-0528:free`
   - Try switching to a different model if this one is unavailable

#### E. CORS Issues

**Symptoms**: Network errors in browser console.

**Solutions**:
1. Update the HTTP-Referer header in `server/services/openai.ts`:
   ```typescript
   "HTTP-Referer": "https://your-actual-domain.com",
   ```

2. Ensure proper CORS configuration in your deployment

### 3. Debugging Steps

#### Step 1: Check Server Logs

Monitor your deployment logs during analysis:

**Vercel**: `vercel logs your-project-name`
**Netlify**: Function logs in dashboard
**Railway**: Logs tab in project
**Render**: Logs tab in service

Look for:
- `[OpenAI] Starting analysis` - Analysis initiated
- `[OpenAI] Making API request` - Request sent to OpenRouter
- `[OpenAI] Response status: 200` - Successful response
- `[OpenAI] Analysis completed` - Analysis finished

#### Step 2: Test API Directly

Test the analysis endpoint directly:

```bash
curl -X POST "https://your-app.com/api/analyze" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "transcript": "Test meeting content",
    "topic": "Test",
    "attendees": "John, Jane",
    "knownInfo": "Test context",
    "mode": "synthrax",
    "contentMode": "meetings"
  }'
```

#### Step 3: Check OpenRouter API Status

Verify OpenRouter service status:
1. Go to [OpenRouter Status](https://status.openrouter.ai/)
2. Check if the specific model is available
3. Test with a different model if needed

#### Step 4: Validate Environment Variables

Create a test endpoint to check environment variables (remove after testing):

```javascript
app.get('/api/debug', (req, res) => {
  res.json({
    hasApiKey: !!process.env.OPENROUTER_API_KEY,
    hasDbUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    // Never expose actual API keys!
    apiKeyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 10) + '...'
  });
});
```

### 4. Model Alternative Options

If DeepSeek R1 is unavailable, update the model in `server/services/openai.ts`:

```typescript
// Alternative models to try:
const OPENROUTER_MODEL = "anthropic/claude-3-haiku";
const OPENROUTER_MODEL = "openai/gpt-3.5-turbo";
const OPENROUTER_MODEL = "meta-llama/llama-3.1-8b-instruct:free";
```

### 5. Performance Optimization

For production deployments:

1. **Enable request caching** for repeated analyses
2. **Implement retry logic** for transient failures
3. **Add request queuing** for high-traffic scenarios
4. **Monitor API usage** and costs

### 6. Quick Fixes

If analysis is hanging, try these immediate fixes:

1. **Restart your deployment**
2. **Clear any cached environment variables**
3. **Check for any recent changes to OpenRouter API**
4. **Verify your API key hasn't expired**
5. **Test with a minimal transcript first**

### 7. Getting Help

If none of these solutions work:

1. **Check the browser console** for JavaScript errors
2. **Review deployment platform logs** for server errors
3. **Test the health endpoint** to verify basic functionality
4. **Try the emergency recovery mode** by setting `mode: "emergency"`

### 8. Monitoring Setup

Set up monitoring for production:

1. **Health checks**: Regular pings to `/api/health`
2. **Error tracking**: Log all analysis failures
3. **Performance monitoring**: Track analysis response times
4. **Usage monitoring**: Track API costs and usage patterns

Remember: The most common cause is missing or incorrect environment variables. Always verify your API key and database connection first.

## SOLUTION FOUND: Model Name Issue

**Root Cause**: The OpenRouter API was hanging because the model name was incorrect. The original model `deepseek/deepseek-r1-0528:free` should be `deepseek/deepseek-r1-0528` (without the `:free` suffix).

**Fix Applied**:
1. Changed model in `server/services/openai.ts` from `deepseek/deepseek-r1-0528:free` to `deepseek/deepseek-r1-0528`
2. Added comprehensive error handling and logging to identify the issue
3. Added timeout protection (60 seconds) to prevent indefinite hanging

**Test Results**: Basic OpenRouter API connection now works correctly. Full analysis should work in both preview and deployment.

**To verify the fix**:
1. Check `/api/health` endpoint shows `hasApiKey: true`
2. Test analysis with a simple meeting transcript
3. Check server logs for `[OpenAI] Analysis completed successfully`