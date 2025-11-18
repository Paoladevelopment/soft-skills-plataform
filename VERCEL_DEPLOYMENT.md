# Vercel Deployment Guide

This guide explains how to deploy your React + FastAPI application to Vercel.

## Project Structure

```
soft-skills-plataform/
├── api/                    # Vercel serverless functions
│   ├── index.py           # FastAPI handler
│   └── requirements.txt    # Python dependencies
├── soft-skills-back/       # FastAPI backend
│   ├── main.py
│   ├── router/
│   └── ...
├── soft-skills-front/      # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── vercel.json            # Vercel configuration
└── .vercelignore          # Files to ignore
```

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally
   ```bash
   npm install -g vercel
   ```
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Environment Variables

### Setting Environment Variables in Vercel

1. **Via Vercel Dashboard**:
   - Go to your project → Settings → Environment Variables
   - Add each variable for Production, Preview, and Development

2. **Via Vercel CLI**:
   ```bash
   vercel env add VARIABLE_NAME
   ```

### Required Environment Variables

#### Backend (FastAPI)

```bash
# Database
DB_URI=postgresql://user:password@host:port/database
# OR individual components:
DB_HOST=your-db-host
DB_NAME=your-db-name
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# Authentication
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# External Services
ELEVENLABS_API_KEY=your-elevenlabs-key
VOICE_SPK1_FEMALE=voice-id
VOICE_SPK2_MALE=voice-id
VOICE_DEFAULT_SINGLE=voice-id
ELEVENLABS_DEFAULT_MODEL=eleven_multilingual_v2

# Supabase (if using)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_BUCKET=challenges-audio

# Public URL (your Vercel deployment URL)
PUBLIC_BASE_URL=https://your-app.vercel.app
```

#### Frontend (React)

```bash
# API Base URL (use relative path for same domain)
VITE_API_BASE_URL=/api/v1

# Chatbot (if separate service)
VITE_CHATBOT_BASE_URL=https://your-chatbot-service.com

# Debug mode (optional)
VITE_DEBUG_MODE=false
```

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will auto-detect the configuration

2. **Configure Project**:
   - **Framework Preset**: Other (or Vite if available)
   - **Root Directory**: `./` (root of repository)
   - **Build Command**: `cd soft-skills-front && npm install && npm run build`
   - **Output Directory**: `soft-skills-front/dist`
   - **Install Command**: `cd soft-skills-front && npm install`

3. **Add Environment Variables**:
   - Add all required variables from the list above
   - Set them for Production, Preview, and Development

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete

### Option 2: Deploy via Vercel CLI

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Link Project** (first time):
   ```bash
   vercel
   ```
   - Follow prompts to link your project
   - Choose default settings

3. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

4. **Deploy to Preview**:
   ```bash
   vercel
   ```

## Build Configuration

### Frontend Build

The frontend is configured to build with Vite:
- **Build command**: `npm run build` (runs `vite build`)
- **Output directory**: `soft-skills-front/dist`
- **Base path**: `/` (root)

### Backend Build

The backend runs as Vercel Serverless Functions:
- **Handler**: `api/index.py`
- **Runtime**: Python 3.11
- **Routes**: All `/api/*` requests are routed to the FastAPI app

## API Routing

### How It Works

1. **API Routes** (`/api/*`):
   - Handled by `api/index.py`
   - Uses Mangum to adapt FastAPI (ASGI) to Vercel's serverless format
   - All FastAPI routes are accessible at `/api/v1/*`

2. **Frontend Routes** (`/*`):
   - Served from `soft-skills-front/dist`
   - React Router handles client-side routing

### Example API Calls

From the frontend, API calls should use relative paths:

```typescript
// ✅ Correct (uses VITE_API_BASE_URL=/api/v1)
fetch('/api/v1/auth/login', { ... })

// ❌ Incorrect (hardcoded URL)
fetch('https://api.example.com/api/v1/auth/login', { ... })
```

## Testing the Deployment

### 1. Test API Endpoints

```bash
# Test health endpoint (if you have one)
curl https://your-app.vercel.app/api/v1/

# Test authentication
curl -X POST https://your-app.vercel.app/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test@example.com&password=test123"
```

### 2. Test Frontend

1. Visit your deployment URL: `https://your-app.vercel.app`
2. Check browser console for errors
3. Test API calls from the frontend
4. Verify authentication flow

### 3. Check Logs

```bash
# View deployment logs
vercel logs

# View logs for specific deployment
vercel logs [deployment-url]
```

## Troubleshooting

### Common Issues

#### 1. **API Routes Return 404**

**Problem**: FastAPI routes not accessible

**Solutions**:
- Check `vercel.json` routing configuration
- Verify `api/index.py` is correctly importing the FastAPI app
- Ensure `PYTHONPATH` is set correctly in `vercel.json`

#### 2. **Module Not Found Errors**

**Problem**: Python imports failing

**Solutions**:
- Verify `api/requirements.txt` includes all dependencies
- Check `PYTHONPATH` in `vercel.json` points to `soft-skills-back`
- Ensure all backend dependencies are in `api/requirements.txt`

#### 3. **Frontend Can't Connect to API**

**Problem**: CORS or connection errors

**Solutions**:
- Set `VITE_API_BASE_URL=/api/v1` (relative path)
- Check CORS configuration in `soft-skills-back/main.py`
- Verify environment variables are set correctly

#### 4. **Build Fails**

**Problem**: Frontend or backend build errors

**Solutions**:
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json` and `requirements.txt`
- Ensure Node.js and Python versions are compatible

#### 5. **Environment Variables Not Loading**

**Problem**: Variables undefined in runtime

**Solutions**:
- Verify variables are set in Vercel dashboard
- Check variable names match exactly (case-sensitive)
- Redeploy after adding new variables

### Debugging Tips

1. **Check Function Logs**:
   ```bash
   vercel logs [function-name]
   ```

2. **Test Locally with Vercel**:
   ```bash
   vercel dev
   ```
   This runs a local server that mimics Vercel's environment

3. **Inspect Build Output**:
   - Check Vercel dashboard → Deployments → Build Logs
   - Look for errors in build process

## Local Development with Vercel

You can test the Vercel configuration locally:

```bash
# Install Vercel CLI
npm install -g vercel

# Run local development server
vercel dev
```

This will:
- Start a local server at `http://localhost:3000`
- Simulate Vercel's routing and serverless functions
- Use environment variables from `.env.local`

## Continuous Deployment

Vercel automatically deploys when you push to your Git repository:

- **Production**: Deploys from `main` or `master` branch (configurable)
- **Preview**: Deploys from other branches and pull requests

### ¿Necesito hacer merge a master antes de desplegar?

**No necesariamente.** Tienes varias opciones:

#### Opción 1: Desplegar desde tu rama actual (Recomendado para testing)
```bash
# Desde cualquier rama
vercel

# Esto crea un "Preview Deployment" con una URL única
# Útil para probar antes de hacer merge
```

#### Opción 2: Desplegar a producción desde master/main
```bash
# Primero hacer merge a master
git checkout master
git merge tu-rama
git push origin master

# Luego desplegar (o Vercel lo hace automáticamente)
vercel --prod
```

#### Opción 3: Desplegar directamente a producción desde cualquier rama
```bash
# Desde cualquier rama, forzar producción
vercel --prod
```

**Recomendación:**
1. **Primero**: Despliega desde tu rama actual (`vercel`) para probar
2. **Luego**: Si todo funciona, haz merge a master y despliega a producción
3. **O**: Configura Vercel para que solo despliegue a producción desde master

### Configurar qué rama despliega a producción

En el dashboard de Vercel:
1. Ve a **Settings** → **Git**
2. En **Production Branch**, selecciona `master` o `main`
3. Ahora solo los pushes a esa rama desplegarán a producción automáticamente

O en `vercel.json`:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "master": true,
      "develop": false
    }
  }
}
```

## Performance Optimization

### Frontend

- Vite automatically optimizes builds
- Assets are automatically cached by Vercel CDN
- Consider code splitting for large bundles

### Backend

- Serverless functions have cold start times
- Consider:
  - Keeping functions warm (Vercel Pro)
  - Optimizing imports
  - Using connection pooling for databases

## Security Considerations

1. **Never commit `.env` files**
2. **Use Vercel's environment variables** for secrets
3. **Enable HTTPS** (automatic on Vercel)
4. **Set proper CORS** origins in production
5. **Use strong SECRET_KEY** for JWT tokens

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI on Vercel](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Mangum Documentation](https://mangum.io/)

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review this guide's troubleshooting section
3. Check Vercel's status page
4. Contact Vercel support or check their community forums

