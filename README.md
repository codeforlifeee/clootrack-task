# Support Ticket System

A full-stack support ticket management system with AI-powered ticket categorization using LLMs (Large Language Models).

## 🚀 Features

- **Submit Support Tickets** - Users can create support tickets with title and description
- **AI-Powered Classification** - LLM automatically suggests category and priority based on ticket description
- **Filtering & Search** - Filter tickets by category, priority, status, and search through content
- **Real-time Statistics** - Dashboard showing ticket metrics and breakdowns
- **Status Management** - Update ticket status (open, in progress, resolved, closed)
- **Responsive UI** - Modern React interface with smooth animations

## 🏗️ Architecture

### Tech Stack

- **Backend**: Django 4.2 + Django REST Framework + PostgreSQL
- **Frontend**: React 18 with modern hooks
- **LLM Integration**: OpenAI GPT-3.5 / Anthropic Claude (configurable)
- **Infrastructure**: Docker + Docker Compose
- **Database**: PostgreSQL 15

### Project Structure

```
Project_Clootrack/
├── backend/                 # Django backend
│   ├── config/             # Django project settings
│   ├── tickets/            # Tickets app
│   │   ├── models.py       # Ticket data model
│   │   ├── serializers.py  # DRF serializers
│   │   ├── views.py        # API endpoints
│   │   ├── llm_service.py  # LLM integration
│   │   └── urls.py         # URL routing
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend container
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js          # Main application
│   │   └── api.js          # API client
│   ├── package.json        # Node dependencies
│   └── Dockerfile          # Frontend container
├── docker-compose.yml      # Service orchestration
└── README.md              # This file
```

## 📋 Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine + Docker Compose (Linux)
- LLM API Key (OpenAI or Anthropic)
- Minimum 4GB RAM available for Docker

## 🚀 Quick Start

### 1. Clone or Download the Project

```bash
cd Project_Clootrack
```

### 2. Configure LLM API Key

Edit the `.env` file in the root directory and add your API key:

```env
LLM_PROVIDER=openai
LLM_API_KEY=your-api-key-here
```

**Getting API Keys:**
- OpenAI: https://platform.openai.com/api-keys
- Anthropic: https://console.anthropic.com/

### 3. Build and Start the Application

```bash
docker-compose up --build
```

This single command will:
- Build all Docker containers
- Start PostgreSQL database
- Run Django migrations
- Start the backend API server
- Build and serve the React frontend

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin (optional)

### 5. Create Admin User (Optional)

To access Django admin panel:

```bash
docker-compose exec backend python manage.py createsuperuser
```

## 📡 API Endpoints

### Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets/` | List all tickets (supports filtering) |
| POST | `/api/tickets/` | Create a new ticket |
| GET | `/api/tickets/{id}/` | Get ticket details |
| PATCH | `/api/tickets/{id}/` | Update ticket (e.g., status) |
| GET | `/api/tickets/stats/` | Get aggregated statistics |
| POST | `/api/tickets/classify/` | Classify ticket description with LLM |

### Filtering Parameters

- `?category=billing` - Filter by category
- `?priority=high` - Filter by priority
- `?status=open` - Filter by status
- `?search=login` - Search in title and description

Multiple filters can be combined:
```
/api/tickets/?category=technical&priority=high&status=open
```

### Example API Requests

**Create a ticket:**
```bash
curl -X POST http://localhost:8000/api/tickets/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cannot reset password",
    "description": "I tried to reset my password but did not receive the email",
    "category": "account",
    "priority": "high"
  }'
```

**Classify a description:**
```bash
curl -X POST http://localhost:8000/api/tickets/classify/ \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Your service has been down for 3 hours"
  }'
```

**Get statistics:**
```bash
curl http://localhost:8000/api/tickets/stats/
```

## 🤖 LLM Integration

### How It Works

1. User types a ticket description
2. On blur (or button click), frontend calls `/api/tickets/classify/`
3. Backend sends description to configured LLM with a specialized prompt
4. LLM analyzes the text and returns suggested category and priority
5. Frontend pre-fills the dropdowns with suggestions
6. User can accept or override before submitting

### Prompt Engineering

The classification prompt is located in `backend/tickets/llm_service.py`. It includes:

- Clear category definitions (billing, technical, account, general)
- Priority level criteria (low, medium, high, critical)
- Examples for better accuracy
- Strict JSON response format

### Fallback Mechanism

If the LLM is unavailable or returns an error:
- System falls back to keyword-based classification
- Ticket submission still works without AI suggestions
- Graceful degradation ensures reliability

### Switching LLM Providers

Edit `.env` file:

```env
# For OpenAI
LLM_PROVIDER=openai
LLM_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo

# For Anthropic
LLM_PROVIDER=anthropic
LLM_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-haiku-20240307
```

## 🗄️ Database Schema

### Ticket Model

| Field | Type | Constraints |
|-------|------|-------------|
| id | Integer | Primary key, auto-increment |
| title | String(200) | Required, max 200 chars |
| description | Text | Required |
| category | String | Choices: billing, technical, account, general |
| priority | String | Choices: low, medium, high, critical |
| status | String | Choices: open, in_progress, resolved, closed; Default: open |
| created_at | DateTime | Auto-set on creation, indexed |

All constraints are enforced at the database level through Django migrations.

## 📊 Statistics Endpoint

Returns aggregated metrics using database-level operations (no Python loops):

```json
{
  "total_tickets": 124,
  "open_tickets": 67,
  "avg_tickets_per_day": 8.3,
  "priority_breakdown": {
    "low": 30,
    "medium": 52,
    "high": 31,
    "critical": 11
  },
  "category_breakdown": {
    "billing": 28,
    "technical": 55,
    "account": 22,
    "general": 19
  }
}
```

**Implementation**: Uses Django ORM's `aggregate()` and `annotate()` for efficient database-level calculations.

## 🧪 Testing

### Test the Backend API

```bash
# Run Django tests
docker-compose exec backend python manage.py test

# Check API health
curl http://localhost:8000/api/tickets/
```

### Test LLM Integration

```bash
# Test classification endpoint
curl -X POST http://localhost:8000/api/tickets/classify/ \
  -H "Content-Type: application/json" \
  -d '{"description": "I cannot access my account after password reset"}'
```

## 🛠️ Development

### Running Without Docker (Local Development)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Environment Variables

**Backend** (`.env` in backend folder):
```env
DEBUG=True
DJANGO_SECRET_KEY=your-secret-key
POSTGRES_DB=ticketdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
LLM_PROVIDER=openai
LLM_API_KEY=your-key
```

**Frontend** (`.env` in frontend folder):
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Stop and remove all containers
docker-compose down

# Check what's using the port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux
```

### Database Connection Issues

```bash
# Reset the database
docker-compose down -v
docker-compose up --build
```

### LLM Classification Not Working

1. Check if API key is set in `.env`
2. Verify API key is valid
3. Check backend logs: `docker-compose logs backend`
4. Test with fallback (it should still work without LLM)

### Frontend Can't Connect to Backend

1. Ensure backend is running: `curl http://localhost:8000/api/tickets/`
2. Check CORS settings in `backend/config/settings.py`
3. Verify `REACT_APP_API_URL` in frontend `.env`

## 📈 Performance Considerations

- **Database Indexing**: Created indexes on frequently queried fields (category, priority, status, created_at)
- **Database-Level Aggregation**: Stats endpoint uses SQL aggregation, not Python loops
- **LLM Caching**: Consider implementing Redis cache for repeated classifications
- **Pagination**: Add pagination for large ticket lists (not implemented due to time)

## 🔒 Security Notes

⚠️ **Important for Production:**

1. Change `DJANGO_SECRET_KEY` in production
2. Set `DEBUG=False` in production
3. Configure `ALLOWED_HOSTS` properly
4. Use environment-specific `.env` files
5. Enable HTTPS/SSL
6. Implement authentication and authorization
7. Use secrets management for API keys (AWS Secrets Manager, HashiCorp Vault)
8. Add rate limiting to prevent API abuse

## 📝 License

This project was created for a technical assessment.

## 👨‍💻 Author

Built as part of Tech Intern Assessment for Clootrack.

## 🙋 Support

If you encounter issues:
1. Check the logs: `docker-compose logs`
2. Ensure all ports (3000, 8000, 5432) are available
3. Verify Docker has sufficient resources
4. Check the API documentation above

---

**Ready to go?** Run `docker-compose up --build` and visit http://localhost:3000 🚀
