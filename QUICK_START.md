# Quick Start: Deploy to Vercel

## 🚀 Quick Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Set Environment Variables

**In Vercel Dashboard** (Project → Settings → Environment Variables):

#### Backend Variables:
```
DB_URI=postgresql://user:pass@host:port/db
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
ELEVENLABS_API_KEY=your-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key
PUBLIC_BASE_URL=https://your-app.vercel.app
```

#### Frontend Variables:
```
VITE_API_BASE_URL=/api/v1
VITE_CHATBOT_BASE_URL=https://your-chatbot-service.com
```

### 4. Deploy

**First deployment (link project):**
```bash
vercel
```

**Production deployment:**
```bash
vercel --prod
```

## 📁 Project Structure

```
├── api/
│   ├── index.py          # FastAPI handler for Vercel
│   └── requirements.txt  # Python dependencies
├── soft-skills-back/     # FastAPI backend
├── soft-skills-front/    # React frontend
├── vercel.json          # Vercel configuration
└── .vercelignore        # Ignored files
```

## ✅ Test Your Deployment

1. **Test API**: `https://your-app.vercel.app/api/v1/`
2. **Test Frontend**: `https://your-app.vercel.app`
3. **Test Hello Endpoint**: `https://your-app.vercel.app/api/hello`

## 📚 Full Documentation

See `VERCEL_DEPLOYMENT.md` for complete guide.

