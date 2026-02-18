# Quick Setup Guide

Follow these steps to get the Support Ticket System running in under 5 minutes.

## Prerequisites Check

Before starting, ensure you have:

- ✅ Docker Desktop installed and running
- ✅ At least 4GB RAM available
- ✅ Ports 3000, 8000, and 5432 are free
- ✅ An LLM API key (OpenAI or Anthropic)

## Step-by-Step Setup

### Step 1: Open Terminal

Open your terminal/command prompt and navigate to the project directory:

```bash
cd Project_Clootrack
```

### Step 2: Configure API Key

1. Open the `.env` file in the root directory
2. Replace `your-api-key-here` with your actual API key:

```env
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-actual-key-here
```

**Where to get API keys:**
- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/

### Step 3: Build and Start

Run this single command:

```bash
docker-compose up --build
```

**What happens:**
1. Downloads required Docker images (first time only)
2. Builds backend and frontend containers
3. Creates PostgreSQL database
4. Runs database migrations
5. Starts all services

**Expected output:**
```
✓ Container ticket_db        Started
✓ Container ticket_backend   Started
✓ Container ticket_frontend  Started
```

### Step 4: Wait for Services

Wait 30-60 seconds for all services to fully start. You'll see:

```
ticket_backend   | Starting development server at http://0.0.0.0:8000/
ticket_frontend  | Compiled successfully!
```

### Step 5: Open the Application

Open your browser and go to:

**http://localhost:3000**

You should see the Support Ticket System interface!

## Verify Everything Works

### 1. Test the Frontend
- Visit http://localhost:3000
- You should see the ticket submission form and statistics dashboard

### 2. Test the Backend API
Open a new terminal and run:

```bash
curl http://localhost:8000/api/tickets/
```

You should get a JSON response (empty array initially): `[]`

### 3. Test LLM Classification

```bash
curl -X POST http://localhost:8000/api/tickets/classify/ \
  -H "Content-Type: application/json" \
  -d "{\"description\": \"I cannot access my account\"}"
```

You should get:
```json
{
  "suggested_category": "account",
  "suggested_priority": "medium"
}
```

## First Ticket Submission

1. Go to http://localhost:3000
2. Fill in the form:
   - **Title**: "Cannot reset my password"
   - **Description**: "I tried to reset my password but didn't receive the email. This is urgent."
3. After typing the description, wait 1-2 seconds - the AI will suggest category and priority
4. Click "Submit Ticket"
5. You should see a success message and the ticket appears in the list below

## Common Issues

### Issue: Port already in use

**Solution:**
```bash
docker-compose down
# Find and kill the process using the port
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
```

### Issue: Docker permission denied (Linux)

**Solution:**
```bash
sudo docker-compose up --build
# Or add your user to docker group:
sudo usermod -aG docker $USER
```

### Issue: LLM classification returns errors

**Solution:**
1. Check your API key is correct in `.env`
2. Verify you have credits/quota remaining
3. The system will still work with fallback classification

### Issue: Database connection error

**Solution:**
```bash
# Reset everything
docker-compose down -v
docker-compose up --build
```

## Development Mode

To make changes while running:

### Backend Changes

1. Edit files in `backend/`
2. Restart backend:
```bash
docker-compose restart backend
```

### Frontend Changes

1. For development with hot reload:
```bash
cd frontend
npm install
npm start
```
2. Access on http://localhost:3000 (development server)

## Stopping the Application

Press `Ctrl+C` in the terminal where docker-compose is running, then:

```bash
docker-compose down
```

To also remove all data:
```bash
docker-compose down -v
```

## Next Steps

- Explore the API documentation in `API_DOCUMENTATION.md`
- Read the full `README.md` for detailed information
- Try creating tickets with different descriptions to see AI classification
- Use filters to search through tickets
- Update ticket statuses

## Need Help?

1. Check logs: `docker-compose logs backend`
2. Verify containers are running: `docker-compose ps`
3. Review the troubleshooting section in README.md

---

**You're all set!** 🎉 Start submitting tickets and exploring the system.
