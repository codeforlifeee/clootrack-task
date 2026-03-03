# 🎫 Support Ticket System - Interview Preparation Guide

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [How the Project Works - Complete Flow](#how-the-project-works---complete-flow)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Technical Stack Explained](#technical-stack-explained)
- [Key Features Implementation](#key-features-implementation)
- [Database Design](#database-design)
- [LLM Integration Details](#llm-integration-details)
- [Interview Questions & Answers](#interview-questions--answers)

---

## 🎯 Project Overview

A **full-stack AI-powered support ticket management system** that automatically classifies and prioritizes customer support tickets using Large Language Models (LLMs). The system helps support teams efficiently manage incoming tickets by automatically suggesting categories and priority levels based on ticket descriptions.

### Core Value Proposition
- **Automated Classification**: Uses AI to suggest category and priority, reducing manual triage time
- **Real-time Analytics**: Provides instant insights into ticket distribution and workload
- **Smart Filtering**: Allows support agents to quickly find and manage specific ticket types
- **Responsive Interface**: Modern, user-friendly React UI with smooth interactions

---

## 🔄 How the Project Works - Complete Flow

### 1. **User Submits a Ticket** (Frontend Flow)

```
User fills form → Frontend validation → API call → Backend receives request
```

**What Happens:**
1. User enters title and description in [TicketForm.js](frontend/src/components/TicketForm.js)
2. Frontend React component validates input locally
3. `ticketAPI.createTicket()` in [api.js](frontend/src/api.js) sends POST request to `/api/tickets/`
4. Request includes: `{title, description}` (no category/priority - LLM will suggest)

**Code Flow:**
```javascript
// TicketForm.js
const handleSubmit = async (e) => {
  e.preventDefault();
  const ticket = await ticketAPI.createTicket(formData);
  onTicketCreated(ticket);
}
```

### 2. **Backend Receives & Processes Ticket** (Django Flow)

```
API Endpoint → Serializer Validation → LLM Service → Database → Response
```

**What Happens:**
1. Django REST Framework view receives POST at [views.py](backend/tickets/views.py)
2. `TicketSerializer` validates the data
3. **LLM Classification Triggered**: [llm_service.py](backend/tickets/llm_service.py) analyzes description
4. LLM returns suggested category & priority
5. Ticket saved to PostgreSQL with status='open'
6. Response sent back with complete ticket data

**Code Flow:**
```python
# views.py - TicketViewSet.create()
serializer.is_valid(raise_exception=True)
self.perform_create(serializer)  # Calls serializer.save()

# serializers.py - TicketSerializer.create()
category, priority = llm_service.classify_ticket(description)
ticket = Ticket.objects.create(
    title=title,
    description=description,
    category=category,
    priority=priority,
    status='open'
)
```

### 3. **LLM Classification** (AI Processing)

```
Description → Prompt Engineering → LLM API → JSON Parsing → Category + Priority
```

**What Happens:**
1. Description text is inserted into a carefully crafted prompt
2. Prompt defines categories (billing, technical, account, general)
3. Prompt defines priorities (low, medium, high, critical) with criteria
4. LLM provider API called (OpenAI GPT-3.5 or Anthropic Claude)
5. LLM responds with structured JSON: `{"category": "technical", "priority": "high"}`
6. Response parsed and validated
7. Fallback to rule-based classification if LLM fails

**Prompt Structure:**
```
Role: "You are a support ticket classifier"
Categories: [definitions with examples]
Priority Levels: [urgency criteria]
Input: {description}
Output: JSON only
Examples: [few-shot learning samples]
```

### 4. **Frontend Displays Updated List** (React State Management)

```
Response received → State update → React re-render → UI updates
```

**What Happens:**
1. API response received in `App.js`
2. `handleTicketCreated()` triggers ticket list refresh
3. `fetchTickets()` re-fetches all tickets with current filters
4. `fetchStats()` updates dashboard statistics
5. React state updates trigger component re-renders
6. New ticket appears in [TicketList.js](frontend/src/components/TicketList.js)
7. Statistics update in [TicketStats.js](frontend/src/components/TicketStats.js)

### 5. **Filtering & Search** (Query Flow)

```
User selects filter → State change → API call with params → Filtered results
```

**What Happens:**
1. User changes filter in [FilterBar.js](frontend/src/components/FilterBar.js)
2. `handleFilterChange()` updates App state
3. `useEffect` detects filter change
4. API called: `/api/tickets/?category=billing&priority=high&search=invoice`
5. Backend `get_queryset()` builds Django Q objects for filtering
6. Database query with WHERE clauses executed
7. Filtered results returned and displayed

**Backend Filtering Logic:**
```python
# views.py - TicketViewSet.get_queryset()
queryset = Ticket.objects.all()
if category:
    queryset = queryset.filter(category=category)
if priority:
    queryset = queryset.filter(priority=priority)
if search:
    queryset = queryset.filter(
        Q(title__icontains=search) | Q(description__icontains=search)
    )
```

### 6. **Statistics Dashboard** (Aggregation Flow)

```
Stats endpoint called → Database aggregation → Calculations → Dashboard display
```

**What Happens:**
1. Frontend calls `/api/tickets/stats/`
2. Django performs database aggregations using ORM
3. `Count`, `TruncDate` functions for efficient queries
4. Calculates: total tickets, open tickets, avg per day
5. Groups tickets by priority and category
6. Returns aggregated data
7. React displays in visual cards and charts

**Database Aggregation:**
```python
# views.py - statistics action
priority_counts = Ticket.objects.values('priority').annotate(
    count=Count('id')
)
category_counts = Ticket.objects.values('category').annotate(
    count=Count('id')
)
```

---

## 🏗️ Architecture & Design Decisions

### 1. **Three-Tier Architecture**

```
┌─────────────────┐
│   Frontend      │  React SPA (Port 3000)
│   (React 18)    │  User Interface Layer
└────────┬────────┘
         │ REST API (JSON)
         │
┌────────▼────────┐
│   Backend       │  Django REST API (Port 8000)
│   (Django 4.2)  │  Business Logic Layer
└────────┬────────┘
         │ SQL Queries
         │
┌────────▼────────┐
│   Database      │  PostgreSQL (Port 5432)
│  (PostgreSQL)   │  Data Persistence Layer
└─────────────────┘
```

**Why This Architecture?**
- **Separation of Concerns**: Frontend focuses on UI, backend on logic, database on storage
- **Scalability**: Each tier can be scaled independently
- **Technology Flexibility**: Can swap implementations without affecting other tiers
- **Security**: Backend validates all data, frontend can't directly access database
- **API-First**: RESTful API can be used by mobile apps, third-party integrations

### 2. **Docker Containerization**

```
docker-compose.yml orchestrates:
  ├── backend (Django)
  ├── frontend (React + Nginx)
  └── db (PostgreSQL)
```

**Why Docker?**
- **Consistency**: Same environment on dev, staging, production
- **Easy Setup**: Single `docker-compose up` command starts everything
- **Isolation**: Dependencies don't conflict with host system
- **Portability**: Works on Windows, Mac, Linux identically
- **Production-Ready**: Same containers used in deployment

### 3. **Django REST Framework Choice**

**Why DRF over Flask or FastAPI?**
- Built-in ORM for database modeling
- Admin interface for quick data management
- Serialization and validation handled automatically
- ViewSets reduce boilerplate code
- Battle-tested in production environments
- Rich ecosystem of packages

### 4. **React with Hooks (No Redux)**

**Why State Management Without Redux?**
- App complexity doesn't justify Redux overhead
- `useState` + `useEffect` sufficient for current needs
- Easier to understand and maintain
- Faster development
- Props drilling avoided by smart component structure

### 5. **PostgreSQL over SQLite**

**Why PostgreSQL?**
- Production-grade database
- Better concurrency handling
- JSON field support for future extensibility
- Full-text search capabilities
- ACID compliance
- Prepared for scaling

---

## 💻 Technical Stack Explained

### Backend Technologies

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Python** | 3.11 | Programming Language | Clean syntax, great for rapid development, extensive libraries |
| **Django** | 4.2 | Web Framework | Batteries-included, ORM, admin, security features |
| **DRF** | 3.14 | REST API Framework | Simplifies API creation, serialization, browsable API |
| **PostgreSQL** | 15 | Database | ACID compliance, reliability, JSON support |
| **OpenAI API** | Latest | LLM Provider | GPT-3.5 for text classification |
| **Anthropic API** | Latest | Alternative LLM | Claude for classification (configurable) |

### Frontend Technologies

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **React** | 18 | UI Framework | Component-based, virtual DOM, huge ecosystem |
| **Axios** | 1.6 | HTTP Client | Promise-based, interceptors, better than fetch |
| **CSS3** | - | Styling | Modern animations, flexbox, grid |
| **Nginx** | Latest | Web Server | Serve React build, reverse proxy in production |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Gunicorn** | WSGI server for Django in production |

---

## 🎯 Key Features Implementation

### Feature 1: AI-Powered Classification

**How It Works:**
1. User submits ticket with only title + description
2. Backend intercepts in serializer's `create()` method
3. LLM service called with structured prompt
4. LLM analyzes text and returns category + priority
5. Ticket saved with AI suggestions
6. User sees suggestions instantly

**Implementation Location:** [llm_service.py](backend/tickets/llm_service.py)

**Error Handling:**
- API key missing? → Falls back to keyword-based classification
- LLM API down? → Uses fallback algorithm
- Invalid JSON response? → Parses and retries
- All errors logged for debugging

**Fallback Algorithm:**
```python
def _fallback_classification(description):
    # Keyword-based rules
    if 'payment' or 'invoice' in description → 'billing'
    if 'error' or 'bug' in description → 'technical'
    if 'login' or 'password' in description → 'account'
    else → 'general'
    
    # Priority based on urgency keywords
    if 'urgent' or 'critical' → 'high'
    else → 'medium'
```

### Feature 2: Real-Time Filtering

**How It Works:**
1. User changes filter dropdown or types in search
2. React state updates via `setFilters()`
3. `useEffect` detects change and triggers `fetchTickets()`
4. API called with query parameters: `?category=billing&search=refund`
5. Django ORM builds filtered query
6. Results returned and displayed

**Performance Optimization:**
- Database indexes on category, priority, status fields
- Case-insensitive search using `icontains`
- Query optimization: only necessary fields fetched

### Feature 3: Statistics Dashboard

**How It Works:**
1. Separate API endpoint: `/api/tickets/stats/`
2. Database aggregation using Django ORM
3. Grouped counts by category and priority
4. Average tickets per day calculation
5. JSON response with all metrics
6. Frontend displays in visual cards

**Aggregation Efficiency:**
- Single database query per metric
- Uses `annotate()` and `aggregate()` for SQL-level counting
- No Python-level loops for counting
- Index optimization for fast queries

### Feature 4: Status Management

**How It Works:**
1. User clicks status dropdown on a ticket
2. PATCH request sent: `/api/tickets/{id}/` with `{status: 'resolved'}`
3. Backend updates single field
4. Response confirms update
5. UI updates immediately
6. Statistics recalculated

---

## 🗄️ Database Design

### Ticket Model Schema

```python
class Ticket(models.Model):
    id          # Auto-increment primary key
    title       # CharField(max_length=200)
    description # TextField (unlimited length)
    category    # CharField(choices=CATEGORY_CHOICES)
    priority    # CharField(choices=PRIORITY_CHOICES)
    status      # CharField(choices=STATUS_CHOICES, default='open')
    created_at  # DateTimeField(auto_now_add=True)
```

### Field Choices

**Categories:**
- `billing` - Payment, invoices, refunds, pricing
- `technical` - Bugs, errors, performance issues
- `account` - Login, password, profile settings
- `general` - Feedback, questions, other

**Priorities:**
- `low` - Minor issues, general questions
- `medium` - Standard issues needing attention
- `high` - Significant problems affecting UX
- `critical` - System down, data loss, security

**Statuses:**
- `open` - New ticket, not yet addressed
- `in_progress` - Being worked on
- `resolved` - Fixed, awaiting closure
- `closed` - Completed and closed

### Database Indexes

```python
indexes = [
    models.Index(fields=['-created_at']),  # Fast sorting
    models.Index(fields=['category']),     # Fast filtering
    models.Index(fields=['priority']),     # Fast filtering
    models.Index(fields=['status']),       # Fast filtering
]
```

**Why These Indexes?**
- Most common queries filter by these fields
- `-created_at` for "newest first" ordering
- Significantly speeds up filter operations
- Small trade-off: slightly slower writes (acceptable for this use case)

---

## 🤖 LLM Integration Details

### Prompt Engineering Strategy

**1. Role Definition**
```
"You are a support ticket classifier"
```
- Sets clear expectation for LLM behavior
- Constrains responses to classification task

**2. Explicit Category Definitions**
```
- billing: Issues related to payments, invoices, refunds...
- technical: Technical problems, bugs, errors...
```
- Removes ambiguity
- Provides examples for each category
- Helps LLM understand context

**3. Priority Criteria**
```
- low: Minor issues, general questions...
- critical: System down, data loss, security issues...
```
- Clear urgency indicators
- Business impact considerations
- Helps consistent classification

**4. Structured Output**
```
Respond ONLY with valid JSON: {"category": "...", "priority": "..."}
```
- Easy parsing
- No natural language to interpret
- Reduces errors

**5. Few-Shot Examples**
```
- "I can't log into my account" -> {"category": "account", "priority": "medium"}
- "Your service has been down for 3 hours!" -> {"category": "technical", "priority": "critical"}
```
- Teaches LLM by example
- Shows edge cases
- Improves accuracy

### Multi-Provider Support

**OpenAI (GPT-3.5)**
- Default choice
- Fast responses (~1-2 seconds)
- Cost: ~$0.0015 per 1000 tokens
- Temperature: 0.3 (low randomness for consistency)

**Anthropic (Claude)**
- Alternative provider
- Slightly more verbose understanding
- Cost: ~$0.008 per 1000 tokens
- Max tokens: 100 (only need short response)

**Configuration:**
```env
LLM_PROVIDER=openai        # or 'anthropic'
LLM_API_KEY=sk-...         # Your API key
OPENAI_MODEL=gpt-3.5-turbo # or 'gpt-4'
```

### Error Handling & Fallback

**Fallback Triggers:**
1. No API key configured
2. API request fails (network, rate limit, etc.)
3. Invalid JSON response
4. Unexpected category/priority values

**Fallback Algorithm:**
- Keyword matching on description
- Simple rules-based classification
- Always returns valid category + priority
- Ensures system never fails to create ticket

---

## 🎓 Interview Questions & Answers

### Section 1: Project Understanding

#### Q1: What problem does this project solve?

**Answer:**
This project solves the manual triage problem in customer support. When support tickets come in, someone needs to read, categorize, and prioritize them - which is time-consuming and inconsistent. Our system uses AI to automatically suggest the category (billing, technical, account, general) and priority level (low, medium, high, critical) based on the ticket description. This reduces manual work, speeds up response times, and ensures consistent classification.

**Key Points to Mention:**
- Automates manual classification
- Reduces human error and inconsistency
- Speeds up ticket routing to correct teams
- Provides analytics for support team optimization

---

#### Q2: Walk me through the complete flow when a user submits a ticket.

**Answer:**
1. **Frontend**: User fills form with title and description, clicks submit
2. **API Call**: React sends POST request to `/api/tickets/` with ticket data
3. **Django View**: `TicketViewSet.create()` receives request
4. **Serializer**: `TicketSerializer` validates the data
5. **LLM Service**: Before saving, `llm_service.classify_ticket()` is called
6. **AI Processing**: Description sent to OpenAI/Anthropic with structured prompt
7. **LLM Response**: Returns JSON with suggested category and priority
8. **Database**: Ticket saved to PostgreSQL with AI suggestions and status='open'
9. **Response**: Complete ticket data sent back to frontend
10. **UI Update**: React state updates, ticket appears in list, stats refresh

---

#### Q3: Why did you choose this tech stack?

**Answer:**

**Backend (Django + DRF):**
- Built-in ORM for easy database operations
- Serializers handle validation and JSON conversion
- ViewSets reduce boilerplate code
- Admin panel for quick data inspection
- Security features (CSRF, SQL injection protection)

**Frontend (React):**
- Component-based architecture for reusability
- Virtual DOM for fast rendering
- Hooks for simple state management
- Large ecosystem and community

**Database (PostgreSQL):**
- Production-ready, reliable
- Better concurrency than SQLite
- ACID compliance
- JSON field support for future features
- Full-text search capabilities

**Docker:**
- Consistent environments across dev/prod
- Easy setup for anyone
- Isolated dependencies
- Production-ready deployment

---

### Section 2: Technical Deep Dive

#### Q4: How does the LLM classification work in detail?

**Answer:**

**Prompt Engineering:**
We use a carefully structured prompt that includes:
1. Clear role definition: "You are a support ticket classifier"
2. Explicit category definitions with examples
3. Priority criteria based on business impact
4. Strict JSON output format requirement
5. Few-shot examples for better accuracy

**API Integration:**
```python
# OpenAI example
client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a support ticket classifier..."},
        {"role": "user", "content": prompt}
    ],
    temperature=0.3,  # Low randomness for consistency
    max_tokens=100    # Short response needed
)
```

**Response Parsing:**
- LLM returns: `{"category": "technical", "priority": "high"}`
- We parse JSON and validate values
- If invalid, use fallback classification

**Why It Works:**
- Temperature=0.3 ensures consistent classifications
- Structured prompt reduces ambiguity
- Few-shot examples teach edge cases
- JSON format eliminates parsing complexity

---

#### Q5: What happens if the LLM API fails?

**Answer:**

**Multiple Fallback Layers:**

1. **Network/API Failure**: Caught in try-except block
2. **Fallback Algorithm**: Keyword-based classification
   ```python
   def _fallback_classification(description):
       desc_lower = description.lower()
       
       # Category detection
       if any(word in desc_lower for word in ['payment', 'invoice']):
           category = 'billing'
       elif any(word in desc_lower for word in ['error', 'bug']):
           category = 'technical'
       # ... more rules
       
       # Priority detection
       if any(word in desc_lower for word in ['urgent', 'critical']):
           priority = 'high'
       else:
           priority = 'medium'
       
       return category, priority
   ```

3. **Logging**: All errors logged for monitoring
4. **User Experience**: Ticket still created successfully

**Why This Matters:**
- System never fails to create tickets
- Degraded gracefully - still functional without AI
- Fallback reasonably accurate for common keywords
- Business continuity maintained

---

#### Q6: How do you handle filtering and search efficiently?

**Answer:**

**Django ORM Optimization:**
```python
def get_queryset(self):
    queryset = Ticket.objects.all()
    
    # Multiple filters can be combined
    if category:
        queryset = queryset.filter(category=category)
    if priority:
        queryset = queryset.filter(priority=priority)
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) | Q(description__icontains=search)
        )
    
    return queryset.order_by('-created_at')
```

**Performance Optimizations:**
1. **Database Indexes**: Created on category, priority, status, created_at
2. **Single Query**: All filters combined into one WHERE clause
3. **Case-Insensitive Search**: Using `icontains` (uses `ILIKE` in PostgreSQL)
4. **Lazy Evaluation**: Query only executes when data accessed

**Frontend Optimization:**
- Debouncing on search input (could add)
- State updates trigger re-fetch via useEffect
- Loading states for better UX

---

#### Q7: Explain your database design decisions.

**Answer:**

**Model Structure:**
```python
class Ticket(models.Model):
    title = CharField(max_length=200)
    description = TextField()
    category = CharField(choices=CATEGORY_CHOICES)
    priority = CharField(choices=PRIORITY_CHOICES)
    status = CharField(choices=STATUS_CHOICES, default='open')
    created_at = DateTimeField(auto_now_add=True)
```

**Design Decisions:**

1. **Choices vs Foreign Keys:**
   - Used CharField with choices instead of separate Category/Priority tables
   - **Why**: Only 4 categories, 4 priorities - not growing
   - Simpler queries, no JOINs needed
   - If categories became dynamic/user-defined, would switch to FK

2. **Indexes:**
   ```python
   indexes = [
       models.Index(fields=['-created_at']),
       models.Index(fields=['category']),
       models.Index(fields=['priority']),
       models.Index(fields=['status']),
   ]
   ```
   - Speed up common filter queries
   - `-created_at` for sorting newest first

3. **TextField for Description:**
   - No length limit on descriptions
   - Allows detailed problem explanations
   - Full-text search capability

4. **Timestamp:**
   - `auto_now_add=True` captures creation time automatically
   - Used for sorting and analytics
   - Could add `updated_at` for tracking changes

---

### Section 3: API & Backend

#### Q8: How is your REST API structured?

**Answer:**

**Endpoint Design:**
```
GET    /api/tickets/          - List all tickets (with filters)
POST   /api/tickets/          - Create new ticket
GET    /api/tickets/{id}/     - Retrieve specific ticket
PATCH  /api/tickets/{id}/     - Update ticket (e.g., status)
DELETE /api/tickets/{id}/     - Delete ticket
GET    /api/tickets/stats/    - Get statistics
```

**RESTful Principles:**
- Resource-based URLs (`/tickets/` not `/get_tickets/`)
- HTTP methods indicate action (GET, POST, PATCH, DELETE)
- Consistent JSON response format
- Proper status codes (200, 201, 400, 404, 500)

**Query Parameters for Filtering:**
```
/api/tickets/?category=billing&priority=high&search=refund
```

**Why This Structure:**
- Standard REST conventions
- Easy to understand and document
- Works with standard HTTP clients
- Can be consumed by mobile apps, other services

---

#### Q9: How do you validate data in your API?

**Answer:**

**Django REST Framework Serializers:**
```python
class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ['id', 'title', 'description', 'category', 
                  'priority', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']
```

**Validation Layers:**

1. **Field-Level Validation:**
   - Automatic type checking (CharField, TextField)
   - Max length enforcement (title max 200 chars)
   - Required fields validation

2. **Choice Validation:**
   - Category must be in CATEGORY_CHOICES
   - Priority must be in PRIORITY_CHOICES
   - Status must be in STATUS_CHOICES
   - Invalid choices rejected with 400 error

3. **Custom Validation:**
   ```python
   def validate_title(self, value):
       if len(value.strip()) < 3:
           raise serializers.ValidationError("Title too short")
       return value
   ```

4. **Frontend Validation:**
   - Required fields checked before submission
   - User feedback before API call
   - Double validation (frontend + backend)

**Error Response:**
```json
{
  "title": ["This field is required."],
  "category": ["'invalid' is not a valid choice."]
}
```

---

#### Q10: How would you handle pagination for large datasets?

**Answer:**

**Current Implementation:**
Currently no pagination - loads all tickets. For assessment/demo purposes, this is fine.

**Production Implementation:**
Would add DRF pagination:

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20
}
```

**API Response Changes:**
```json
{
  "count": 150,
  "next": "http://localhost:8000/api/tickets/?page=2",
  "previous": null,
  "results": [/* 20 tickets */]
}
```

**Frontend Changes:**
```javascript
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

// Fetch with pagination
const fetchTickets = async () => {
  const data = await ticketAPI.getTickets({...filters, page});
  setTickets(data.results);
  setTotalPages(Math.ceil(data.count / 20));
};

// Add pagination controls
<Pagination 
  currentPage={page} 
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

**Why Pagination Important:**
- Performance: Don't load 10,000 tickets at once
- UX: Faster initial load, smoother scrolling
- Bandwidth: Reduce data transfer
- Database: Limit query size with OFFSET/LIMIT

---

### Section 4: Frontend & UX

#### Q11: Explain your React component structure.

**Answer:**

**Component Hierarchy:**
```
App.js (Main container - manages state)
├── TicketForm.js (Create ticket form)
├── TicketStats.js (Statistics dashboard)
├── FilterBar.js (Filter controls)
└── TicketList.js (List of tickets)
    └── Individual ticket cards
```

**State Management:**
```javascript
// App.js - Central state
const [tickets, setTickets] = useState([]);
const [stats, setStats] = useState(null);
const [filters, setFilters] = useState({});
```

**Data Flow:**
1. **Parent to Child**: Props passed down
   ```javascript
   <TicketList tickets={tickets} onUpdate={handleTicketUpdate} />
   ```

2. **Child to Parent**: Callback functions
   ```javascript
   <TicketForm onTicketCreated={handleTicketCreated} />
   ```

3. **Sibling Communication**: Through parent state
   - TicketForm creates ticket → App updates → TicketList re-renders

**Why This Structure:**
- Single source of truth (App.js state)
- Clear data flow (unidirectional)
- Easy to debug
- Component reusability
- No prop drilling (max 1 level deep)

---

#### Q12: How do you handle loading states and errors?

**Answer:**

**Loading States:**
```javascript
const [loading, setLoading] = useState(false);

const fetchTickets = async () => {
  setLoading(true);
  try {
    const data = await ticketAPI.getTickets();
    setTickets(data);
  } catch (err) {
    setError('Failed to load tickets');
  } finally {
    setLoading(false);  // Always executed
  }
};

// In render
{loading && <div className="loading">Loading...</div>}
```

**Error Handling:**
```javascript
const [error, setError] = useState(null);

// Try-catch around API calls
try {
  await ticketAPI.createTicket(data);
} catch (err) {
  console.error('Error:', err);
  alert('Failed to create ticket. Please try again.');
}
```

**User Feedback:**
1. **Loading Spinner**: Visual indicator during API calls
2. **Error Messages**: User-friendly error text
3. **Success Feedback**: Ticket appears immediately in list
4. **Optimistic Updates**: Could update UI before API confirms

**Better Implementation Ideas:**
- Toast notifications (react-toastify)
- Error boundary components
- Retry logic for failed requests
- Offline detection

---

#### Q13: How do you handle API communication?

**Answer:**

**Centralized API Module:** [api.js](frontend/src/api.js)
```javascript
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export const ticketAPI = {
  getTickets: async (filters) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${BASE_URL}/tickets/?${params}`);
    return response.data;
  },
  
  createTicket: async (ticketData) => {
    const response = await axios.post(`${BASE_URL}/tickets/`, ticketData);
    return response.data;
  },
  
  updateTicket: async (id, updates) => {
    const response = await axios.patch(`${BASE_URL}/tickets/${id}/`, updates);
    return response.data;
  },
  
  getStats: async () => {
    const response = await axios.get(`${BASE_URL}/tickets/stats/`);
    return response.data;
  }
};
```

**Benefits:**
1. **Single Source**: All API calls in one file
2. **Easy Updates**: Change BASE_URL in one place
3. **Reusability**: Import ticketAPI anywhere
4. **Error Handling**: Can add axios interceptors
5. **Type Safety**: Could add TypeScript interfaces

**Production Improvements:**
```javascript
// Add interceptors for auth
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

// Handle errors globally
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

---

### Section 5: DevOps & Deployment

#### Q14: Explain your Docker setup.

**Answer:**

**Docker Compose Structure:**
```yaml
services:
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=tickets
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=admin123
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      - LLM_PROVIDER=openai
      - LLM_API_KEY=${LLM_API_KEY}

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

**Service Dependencies:**
1. **PostgreSQL** starts first (db)
2. **Backend** starts after db is ready
3. **Frontend** starts after backend is ready

**Volume Mapping:**
- `./backend:/app` - Code changes reflect immediately
- `postgres_data:/var/lib/postgresql/data` - Database persists

**Benefits:**
1. **Single Command**: `docker-compose up` starts everything
2. **Environment Consistency**: Same environment everywhere
3. **Easy Cleanup**: `docker-compose down` stops all services
4. **Production-Ready**: Same containers in production

---

#### Q15: How would you deploy this to production?

**Answer:**

**Production Deployment Strategy:**

**1. Backend Deployment:**
```dockerfile
# Production Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN python manage.py collectstatic --noinput
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

**Changes Needed:**
- Use Gunicorn instead of runserver
- Set `DEBUG=False` in settings
- Configure `ALLOWED_HOSTS`
- Use environment variables for secrets
- Set up proper database (AWS RDS, etc.)

**2. Frontend Deployment:**
```dockerfile
# Multi-stage build
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**3. Cloud Options:**

**Option A: AWS**
- **Backend**: ECS (Fargate) or Elastic Beanstalk
- **Frontend**: S3 + CloudFront
- **Database**: RDS PostgreSQL
- **Secrets**: AWS Secrets Manager

**Option B: Heroku** (Easiest)
```bash
# Backend
heroku create myapp-api
heroku addons:create heroku-postgresql
git push heroku main

# Frontend
heroku create myapp-frontend
heroku buildpacks:set heroku/nodejs
git push heroku main
```

**Option C: DigitalOcean App Platform**
- Connect GitHub repo
- Auto-deploys on push
- Manages containers automatically

**4. Additional Production Needs:**
- **HTTPS**: SSL certificates (Let's Encrypt)
- **Environment Variables**: Separate .env for prod
- **Monitoring**: Sentry for error tracking
- **Logging**: CloudWatch or ELK stack
- **CI/CD**: GitHub Actions for automated testing/deployment
- **Backups**: Automated database backups
- **CDN**: CloudFlare for static assets

---

#### Q16: How would you handle security in production?

**Answer:**

**Security Measures to Implement:**

**1. Django Security Settings:**
```python
# settings.py (production)
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
```

**2. Database Security:**
- Don't commit credentials to git
- Use environment variables
- Restrict database access to backend only
- Use strong passwords
- Enable SSL for database connections

**3. API Security:**
```python
# Add authentication
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

**4. Input Validation:**
- Already using DRF serializers (prevents injection)
- Add rate limiting to prevent abuse:
```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
    }
}
```

**5. CORS Configuration:**
```python
# Only allow specific origins
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
]
```

**6. API Key Management:**
- Never commit API keys
- Use environment variables
- Rotate keys regularly
- Monitor usage for anomalies

---

### Section 6: Improvements & Scaling

#### Q17: What improvements would you make to this system?

**Answer:**

**Short-Term Improvements:**

1. **Pagination**
   - Add page numbers to API
   - Implement frontend pagination controls
   - Improves performance with large datasets

2. **Authentication & Authorization**
   - User login system
   - Role-based access (admin, agent, user)
   - Users can only see their own tickets

3. **Email Notifications**
   - Notify users when ticket status changes
   - Auto-reply on ticket creation
   - Daily digest for support team

4. **File Attachments**
   - Allow screenshot/log file uploads
   - Store in S3 or similar
   - Display in ticket details

5. **Ticket Assignment**
   - Assign tickets to support agents
   - Show agent workload
   - Auto-assignment based on category

**Medium-Term Improvements:**

1. **Real-Time Updates**
   - WebSocket connection (Django Channels)
   - Live ticket updates across sessions
   - Collaborative ticket management

2. **Rich Text Editor**
   - Markdown support for descriptions
   - Formatted responses
   - Code block support for technical tickets

3. **Ticket History**
   - Track all status changes
   - Log who made changes
   - Activity timeline

4. **Better Analytics**
   - Response time metrics
   - Resolution time tracking
   - Agent performance stats
   - Trend analysis

**Long-Term Improvements:**

1. **Machine Learning Enhancements**
   - Train custom model on historical data
   - Suggest responses based on past tickets
   - Identify duplicate tickets
   - Predict resolution time

2. **Multi-Language Support**
   - Internationalization (i18n)
   - Translation support
   - Language detection

3. **Advanced Search**
   - Elasticsearch integration
   - Fuzzy matching
   - Search by date range
   - Saved searches

4. **Mobile App**
   - React Native app
   - Push notifications
   - Offline support

---

#### Q18: How would you scale this for 1 million tickets?

**Answer:**

**Database Optimization:**

1. **Indexing Strategy**
   - Already have indexes on filter fields
   - Add composite indexes for common filter combinations
   ```python
   indexes = [
       models.Index(fields=['category', 'priority']),
       models.Index(fields=['status', '-created_at']),
   ]
   ```

2. **Database Sharding**
   - Partition tickets by date (e.g., by year)
   - Separate hot (recent) and cold (old) data
   - Archive old resolved tickets

3. **Read Replicas**
   - Primary DB for writes
   - Multiple read replicas for queries
   - Load balance read traffic

**Caching Layer:**

```python
# Redis caching
from django.core.cache import cache

def get_ticket_stats():
    stats = cache.get('ticket_stats')
    if not stats:
        stats = calculate_stats()
        cache.set('ticket_stats', stats, timeout=300)  # 5 min
    return stats
```

**Search Optimization:**

1. **Elasticsearch**
   - Move full-text search to Elasticsearch
   - Much faster for large text searches
   - Support advanced queries

2. **Pagination**
   - Mandatory with 1M records
   - Cursor-based pagination for performance
   ```python
   # Better than offset pagination
   queryset.filter(id__gt=last_id)[:20]
   ```

**Application Scaling:**

1. **Horizontal Scaling**
   - Multiple Django instances behind load balancer
   - Stateless application design
   - Session data in Redis/database

2. **Asynchronous Processing**
   ```python
   # Use Celery for LLM calls
   @celery_app.task
   def classify_ticket_async(ticket_id):
       ticket = Ticket.objects.get(id=ticket_id)
       category, priority = llm_service.classify_ticket(ticket.description)
       ticket.category = category
       ticket.priority = priority
       ticket.save()
   ```

3. **CDN for Frontend**
   - Serve React build from CDN
   - Reduce server load
   - Faster global access

**Infrastructure:**

1. **Container Orchestration**
   - Kubernetes for auto-scaling
   - Scale pods based on CPU/memory
   - Health checks and auto-recovery

2. **Message Queue**
   - RabbitMQ/SQS for async tasks
   - Decouple services
   - Handle traffic spikes

3. **Monitoring**
   - New Relic/DataDog for APM
   - Alert on slow queries
   - Track error rates

---

#### Q19: What testing strategy would you implement?

**Answer:**

**Backend Testing:**

**1. Unit Tests**
```python
# tests.py
from django.test import TestCase
from .models import Ticket
from .llm_service import LLMService

class TicketModelTest(TestCase):
    def test_ticket_creation(self):
        ticket = Ticket.objects.create(
            title="Test ticket",
            description="Test description",
            category="technical",
            priority="high"
        )
        self.assertEqual(ticket.status, 'open')
        self.assertIsNotNone(ticket.created_at)
    
    def test_ticket_str(self):
        ticket = Ticket.objects.create(
            title="Bug report",
            priority="critical",
            # ...
        )
        self.assertEqual(str(ticket), "[CRITICAL] Bug report")

class LLMServiceTest(TestCase):
    def test_fallback_classification(self):
        service = LLMService()
        category, priority = service._fallback_classification(
            "I can't pay my invoice"
        )
        self.assertEqual(category, 'billing')
```

**2. API Tests**
```python
from rest_framework.test import APITestCase

class TicketAPITest(APITestCase):
    def test_create_ticket(self):
        data = {
            'title': 'Test',
            'description': 'Test desc'
        }
        response = self.client.post('/api/tickets/', data)
        self.assertEqual(response.status_code, 201)
        self.assertIn('category', response.data)
        self.assertIn('priority', response.data)
    
    def test_filter_by_category(self):
        # Create test tickets
        Ticket.objects.create(title="T1", category="billing", ...)
        Ticket.objects.create(title="T2", category="technical", ...)
        
        response = self.client.get('/api/tickets/?category=billing')
        self.assertEqual(len(response.data), 1)
```

**Frontend Testing:**

**1. Component Tests (Jest + React Testing Library)**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import TicketForm from './TicketForm';

test('renders ticket form', () => {
  render(<TicketForm onTicketCreated={() => {}} />);
  expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
});

test('submits form with valid data', async () => {
  const mockCreate = jest.fn();
  render(<TicketForm onTicketCreated={mockCreate} />);
  
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: 'Test ticket' }
  });
  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: 'Test description' }
  });
  fireEvent.click(screen.getByText(/submit/i));
  
  await waitFor(() => expect(mockCreate).toHaveBeenCalled());
});
```

**2. Integration Tests**
- Test complete user flows
- Mock API responses
- Test error scenarios

**3. E2E Tests (Cypress)**
```javascript
describe('Ticket Creation Flow', () => {
  it('creates a new ticket', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[name="title"]').type('Test ticket');
    cy.get('textarea[name="description"]').type('Test description');
    cy.get('button[type="submit"]').click();
    cy.contains('Test ticket').should('be.visible');
  });
});
```

**CI/CD Integration:**
```yaml
# .github/workflows/test.yml
name: Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run backend tests
        run: |
          cd backend
          python manage.py test
      - name: Run frontend tests
        run: |
          cd frontend
          npm test
```

---

#### Q20: How would you monitor this system in production?

**Answer:**

**1. Application Performance Monitoring (APM)**

**Backend Monitoring:**
```python
# Use Sentry for error tracking
import sentry_sdk
sentry_sdk.init(
    dsn="your-sentry-dsn",
    traces_sample_rate=0.1,
)
```

**Metrics to Track:**
- API response times
- Error rates by endpoint
- Database query performance
- LLM API latency
- Memory usage

**2. Logging Strategy**

```python
# Structured logging
import logging
logger = logging.getLogger(__name__)

logger.info('Ticket created', extra={
    'ticket_id': ticket.id,
    'category': ticket.category,
    'priority': ticket.priority,
    'classification_time_ms': time_taken
})
```

**Log Levels:**
- `ERROR`: Failed requests, exceptions
- `WARNING`: Fallback classifications, slow queries
- `INFO`: Ticket creation, status changes
- `DEBUG`: Detailed flow for troubleshooting

**3. Infrastructure Monitoring**

**Metrics Dashboard:**
- CPU usage per container
- Memory consumption
- Disk I/O
- Network traffic
- Container restart count

**Database Monitoring:**
- Connection pool usage
- Slow query log
- Table sizes
- Index usage statistics

**4. Business Metrics**

**Dashboard KPIs:**
- Tickets created per hour
- Average classification time
- LLM API success rate
- Tickets by category/priority distribution
- Response time by priority
- Resolution time

**5. Alerts**

```yaml
# Example alert rules
alerts:
  - name: HighErrorRate
    condition: error_rate > 5%
    duration: 5m
    action: notify_team
  
  - name: SlowAPIResponse
    condition: avg_response_time > 1000ms
    duration: 10m
    action: page_oncall
  
  - name: LLMAPIDown
    condition: llm_api_success_rate < 50%
    duration: 5m
    action: use_fallback
```

**6. Tools Stack**

- **APM**: Sentry, New Relic, or DataDog
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Infrastructure**: Prometheus + Grafana
- **Alerts**: PagerDuty or Opsgenie
- **Uptime**: Pingdom or UptimeRobot

---

## 🎯 Behavioral Questions

### Q21: What was the most challenging part of this project?

**Answer:**

"The most challenging part was designing robust error handling for the LLM integration. LLM APIs can fail for various reasons - rate limits, network issues, invalid responses - and I couldn't let that break ticket creation.

I solved this by implementing a multi-layer approach:
1. Structured prompts to get consistent JSON responses
2. Response validation with retry logic
3. Fallback keyword-based classification algorithm
4. Comprehensive logging to track failure patterns

This ensures the system degrades gracefully - even without AI, users can still create tickets."

---

### Q22: How did you decide on the database schema?

**Answer:**

"I focused on simplicity and query performance. I chose CharField with choices over foreign key tables for categories and priorities because:
1. The values are fixed and unlikely to change
2. No JOIN queries needed - faster filters
3. Simpler code and migrations

For indexing, I analyzed the most common queries - filtering by category, priority, status, and sorting by date - and added indexes accordingly. This turned out to be the right choice as filter queries are very fast even with thousands of tickets."

---

### Q23: Why did you use LLMs instead of traditional ML?

**Answer:**

"LLMs offer several advantages for this use case:

1. **Zero Training Data Required**: Don't need thousands of labeled tickets to start
2. **Quick Implementation**: Ready to use with just prompt engineering
3. **Handles Nuance**: Understands context like urgency, business impact
4. **Adaptable**: Can handle new types of requests without retraining

For a startup or MVP, this is perfect. If we eventually get 10,000+ labeled tickets, we could train a custom classifier for better cost/performance, but LLMs are ideal for getting started quickly."

---

## 📝 Final Tips for Your Interview

### Talking Points to Emphasize:

1. **Full-Stack Capability**: You built both frontend and backend
2. **AI Integration**: Real-world LLM usage with error handling
3. **Production Thinking**: Docker, error handling, monitoring considerations
4. **Scalability Awareness**: You know how to scale this
5. **Clean Code**: RESTful API, component architecture

### Questions to Ask Them:

1. "What's your typical tech stack for new projects?"
2. "How do you handle AI/ML integrations in production?"
3. "What's your deployment process like?"
4. "How do you balance speed vs. perfection in development?"

### Demo Tips:

1. **Show the flow**: Create a ticket, watch AI classify it
2. **Demonstrate filtering**: Show real-time filtering
3. **Explain as you go**: Point out AI suggestions, stats update
4. **Mention improvements**: Show you're thinking ahead
5. **Handle errors gracefully**: If something breaks, explain how you'd debug it

---

## 🚀 Quick Start Commands for Demo

```bash
# Start the system
docker-compose up --build

# Create test tickets via API
curl -X POST http://localhost:8000/api/tickets/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Cannot access dashboard", "description": "Getting 500 error when trying to load dashboard after login"}'

# Check stats
curl http://localhost:8000/api/tickets/stats/

# Filter tickets
curl "http://localhost:8000/api/tickets/?category=technical&priority=high"
```

---

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [Docker Documentation](https://docs.docker.com/)

---

**Good luck with your interview! 🎉**

Remember: You built a real, working system that solves a real problem. That's impressive! Be confident, explain your decisions, and show enthusiasm for the technology.
