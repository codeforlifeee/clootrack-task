# 🚀 Deployment Guide - Cloud Hosting

This guide will help you deploy your Support Ticket System to the cloud so it runs 24/7, even when your computer is off.

---

## Option 1: Railway (Recommended - Easiest) ⭐

Railway offers $5 free credit (no credit card required initially).

### Step 1: Prepare Your Code

1. **Push to GitHub** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/codeforlifeee/clootrack-task.git
git push -u origin main
```

### Step 2: Deploy to Railway

1. **Go to**: https://railway.app/
2. **Click "Start a New Project"**
3. **Login with GitHub**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository**: `codeforlifeee/clootrack-task`

### Step 3: Configure Services

Railway will detect your Docker Compose file. Configure each service:

#### Database (PostgreSQL):
- Auto-detected from docker-compose.yml
- No configuration needed

#### Backend:
1. Click on the backend service
2. Go to **Variables** tab
3. Add these environment variables:
   ```
   DJANGO_SECRET_KEY=your-secret-key-here-generate-random
   DEBUG=False
   LLM_PROVIDER=openai
   LLM_API_KEY=sk-your-api-key-here
   ALLOWED_HOSTS=.railway.app
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   PORT=8000
   ```
4. Go to **Settings** → **Networking** → **Generate Domain**

#### Frontend:
1. Click on the frontend service
2. Go to **Variables** tab
3. Add:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```
4. Go to **Settings** → **Networking** → **Generate Domain**

### Step 4: Get Your Live URL

After deployment completes (5-10 minutes):
- Frontend URL: `https://your-app.railway.app`
- Share this URL with anyone!

**Benefits:**
- ✅ Free $5 credit (lasts ~1 month for small apps)
- ✅ Automatic SSL (HTTPS)
- ✅ Auto-deploy on git push
- ✅ Easy to scale

---

## Option 2: Render (100% Free Forever)

Render offers a completely free tier (with some limitations).

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy to Render

1. **Go to**: https://render.com/
2. **Sign up with GitHub**
3. **Click "New +"** → **Web Service**
4. **Connect your repository**: `codeforlifeee/clootrack-task`

### Step 3: Configure Services

#### Create PostgreSQL Database:
1. Click **"New +"** → **PostgreSQL**
2. Name: `ticketdb`
3. Plan: **Free**
4. Click **"Create Database"**
5. Copy the **Internal Database URL**

#### Create Backend Service:
1. Click **"New +"** → **Web Service**
2. Connect repository → Select `backend` folder
3. Settings:
   - **Name**: `ticket-backend`
   - **Environment**: `Docker`
   - **Plan**: `Free`
   - **Docker Command**: (leave default)
4. **Environment Variables**:
   ```
   DATABASE_URL=<paste-internal-database-url>
   DJANGO_SECRET_KEY=your-random-secret-key
   DEBUG=False
   LLM_PROVIDER=openai
   LLM_API_KEY=sk-your-api-key
   ALLOWED_HOSTS=.onrender.com
   ```
5. Click **"Create Web Service"**
6. Wait for deployment (~10 minutes)
7. Copy your backend URL: `https://ticket-backend.onrender.com`

#### Create Frontend Service:
1. Click **"New +"** → **Static Site**
2. Connect repository → Select `frontend` folder
3. Settings:
   - **Name**: `ticket-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://ticket-backend.onrender.com/api
   ```
5. Click **"Create Static Site"**

### Step 4: Get Your Live URL

Your frontend URL: `https://ticket-frontend.onrender.com`

**Benefits:**
- ✅ 100% Free forever
- ✅ Automatic SSL
- ✅ Auto-deploy on git push
- ⚠️ Free tier sleeps after 15min inactivity (30sec wake-up time)

---

## Option 3: Vercel (Frontend) + Railway (Backend)

Best performance option - separate hosting optimized for each tier.

### Frontend on Vercel:
1. Go to https://vercel.com
2. Import your GitHub repo
3. Set Root Directory: `frontend`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```
5. Deploy

### Backend on Railway:
Follow Railway steps above for backend + database only.

**Benefits:**
- ✅ Blazing fast frontend (CDN)
- ✅ Generous free tier
- ✅ Best for production

---

## Option 4: Fly.io (Advanced)

Good for Docker Compose apps with more control.

### Quick Setup:
```bash
# Install Fly CLI
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Login
fly auth login

# Create app
fly launch

# Deploy
fly deploy
```

**Benefits:**
- ✅ Good free tier
- ✅ Global deployment
- ✅ Great Docker support

---

## 🎯 Recommended Choice

**For You: Railway** - Best balance of ease and features

### Quick Start (5 minutes):

1. **Push your code to GitHub**
2. **Go to Railway.app** and sign up
3. **Deploy from GitHub repo**
4. **Add environment variables** (copy from your .env)
5. **Generate public URLs**
6. **Done!** 🎉

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Code is committed to Git
- [ ] You have your LLM API key
- [ ] Environment variables are ready
- [ ] `.gitignore` includes `.env` file
- [ ] `ALLOWED_HOSTS` configured in settings.py

---

## 🔒 Security Notes

For production deployment:

1. **Change SECRET_KEY**: Generate a new random key
   ```bash
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

2. **Set DEBUG=False** in production

3. **Configure ALLOWED_HOSTS** properly:
   ```python
   ALLOWED_HOSTS = ['.railway.app', '.onrender.com', 'yourdomain.com']
   ```

4. **Use environment variables** for all secrets

---

## 📞 Need Help?

If you get stuck during deployment:
1. Check the service logs in the dashboard
2. Verify all environment variables are set
3. Ensure database connection string is correct
4. Check that ports are configured correctly

---

**Ready to deploy? Let's start with Railway!** 🚀
