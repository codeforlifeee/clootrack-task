# 🐳 Quick Deploy with Docker Images

This guide shows how anyone can run the Support Ticket System using pre-built Docker images from Docker Hub.

---

## 📦 Available Docker Images

The application is available as pre-built Docker images on Docker Hub:

- **Backend**: `codeforlifeee/clootrack-backend:latest`
- **Frontend**: `codeforlifeee/clootrack-frontend:latest`
- **Database**: `postgres:15-alpine` (official)

---

## 🚀 Quick Start (1 Minute Setup)

Anyone can run this application with just 3 commands!

### Prerequisites
- Docker Desktop installed and running
- An OpenAI or Anthropic API key

### Step 1: Download the deployment file

```bash
# Download docker-compose file
curl -O https://raw.githubusercontent.com/codeforlifeee/clootrack-task/main/docker-compose.public.yml
```

### Step 2: Set your API key

Edit `docker-compose.public.yml` and replace:
```yaml
LLM_API_KEY=your-api-key-here
```

With your actual API key:
```yaml
LLM_API_KEY=sk-your-actual-openai-key
```

### Step 3: Run the application

```bash
docker-compose -f docker-compose.public.yml up -d
```

**That's it!** 🎉 

Open your browser: **http://localhost:3000**

---

## 📋 Complete Installation Guide

### For Windows:

```powershell
# 1. Create a project directory
mkdir clootrack-support-system
cd clootrack-support-system

# 2. Download deployment file
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/codeforlifeee/clootrack-task/main/docker-compose.public.yml" -OutFile "docker-compose.public.yml"

# 3. Edit and add your API key
notepad docker-compose.public.yml

# 4. Start the application
docker-compose -f docker-compose.public.yml up -d

# 5. Check if running
docker ps

# 6. View logs
docker-compose -f docker-compose.public.yml logs -f
```

### For Mac/Linux:

```bash
# 1. Create a project directory
mkdir clootrack-support-system
cd clootrack-support-system

# 2. Download deployment file
curl -O https://raw.githubusercontent.com/codeforlifeee/clootrack-task/main/docker-compose.public.yml

# 3. Edit and add your API key
nano docker-compose.public.yml

# 4. Start the application
docker-compose -f docker-compose.public.yml up -d

# 5. Check if running
docker ps

# 6. View logs
docker-compose -f docker-compose.public.yml logs -f
```

---

## 🔧 Configuration

### Required Environment Variables

Before running, configure these in `docker-compose.public.yml`:

```yaml
environment:
  # LLM Configuration - REQUIRED
  - LLM_API_KEY=sk-your-openai-key-here
  - LLM_PROVIDER=openai
  
  # Optional: Change secret key for production
  - DJANGO_SECRET_KEY=your-secret-key
  
  # Optional: Use Anthropic instead
  # - LLM_PROVIDER=anthropic
  # - LLM_API_KEY=sk-ant-your-key
```

### Get an API Key

**OpenAI (Recommended):**
- Visit: https://platform.openai.com/api-keys
- Create new secret key
- Copy and paste into the config

**Anthropic (Alternative):**
- Visit: https://console.anthropic.com/
- Create API key
- Set `LLM_PROVIDER=anthropic`

---

## 🌐 Access the Application

After starting the containers:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

---

## 📊 Verify Everything Works

### 1. Check Container Status
```bash
docker ps
```

You should see 3 containers running:
- `clootrack_frontend`
- `clootrack_backend`
- `clootrack_db`

### 2. Test Backend API
```bash
curl http://localhost:8000/api/tickets/
```

Should return: `[]` (empty array initially)

### 3. Test Frontend
Open http://localhost:3000 in your browser

---

## 🛠️ Management Commands

### Stop the application
```bash
docker-compose -f docker-compose.public.yml down
```

### Restart the application
```bash
docker-compose -f docker-compose.public.yml restart
```

### View logs
```bash
# All services
docker-compose -f docker-compose.public.yml logs -f

# Specific service
docker-compose -f docker-compose.public.yml logs -f backend
```

### Update to latest version
```bash
# Pull latest images
docker-compose -f docker-compose.public.yml pull

# Restart with new images
docker-compose -f docker-compose.public.yml up -d
```

### Clean up everything
```bash
# Stop and remove containers, volumes
docker-compose -f docker-compose.public.yml down -v
```

---

## 🐛 Troubleshooting

### Port Already in Use

If ports 3000, 8000, or 5432 are occupied:

```yaml
# Change in docker-compose.public.yml
ports:
  - "3001:80"    # Frontend: use 3001 instead
  - "8001:8000"  # Backend: use 8001 instead
  - "5433:5432"  # Database: use 5433 instead
```

### Backend Not Connecting to Database

Wait 30 seconds after starting for database to initialize:
```bash
docker-compose -f docker-compose.public.yml logs db
```

### LLM Classification Not Working

Verify your API key is correct:
```bash
docker-compose -f docker-compose.public.yml logs backend | grep "LLM"
```

---

## 📦 For Developers: Pulling Images Manually

If you want to use these images in your own setup:

```bash
# Pull backend
docker pull codeforlifeee/clootrack-backend:latest

# Pull frontend
docker pull codeforlifeee/clootrack-frontend:latest

# Run backend
docker run -d -p 8000:8000 \
  -e LLM_API_KEY=your-key \
  -e POSTGRES_HOST=host.docker.internal \
  codeforlifeee/clootrack-backend:latest

# Run frontend
docker run -d -p 3000:80 \
  codeforlifeee/clootrack-frontend:latest
```

---

## 📈 Resource Requirements

**Minimum:**
- 2 GB RAM
- 2 GB free disk space
- Docker Desktop

**Recommended:**
- 4 GB RAM
- 5 GB free disk space

---

## 🔐 Security Notes for Production

If deploying to production:

1. **Change default passwords:**
   ```yaml
   POSTGRES_PASSWORD=use-strong-password-here
   DJANGO_SECRET_KEY=generate-random-secret-key
   ```

2. **Set DEBUG=False:**
   ```yaml
   DEBUG=False
   ```

3. **Configure ALLOWED_HOSTS:**
   ```yaml
   ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
   ```

4. **Use HTTPS/SSL** with a reverse proxy (nginx, traefik)

---

## 🎯 Use Cases

This one-command deployment is perfect for:

- ✅ Quick demos and presentations
- ✅ Local development testing
- ✅ Team collaboration (share docker-compose file)
- ✅ Educational purposes
- ✅ Proof of concept deployments
- ✅ Internal company tools

---

## 📞 Support

**Issues?**
- GitHub Issues: https://github.com/codeforlifeee/clootrack-task/issues
- Documentation: See repo README.md

**Want to contribute?**
Fork the repo and submit a PR!

---

## 🏷️ Version Information

- **Backend Image**: `codeforlifeee/clootrack-backend:latest`
- **Frontend Image**: `codeforlifeee/clootrack-frontend:latest`
- **Last Updated**: March 3, 2026

---

## ⭐ Star the Project

If you find this useful, please star the repository:
https://github.com/codeforlifeee/clootrack-task

---

**Happy deploying! 🚀**
