# 🎯 Interview Questions & Answers - Quick Reference Guide

**Last Updated:** March 1, 2026  
**Project:** Support Ticket System with AI Classification

---

## 📑 Table of Contents

1. [Quick Technical Questions](#quick-technical-questions)
2. [Django & Backend Questions](#django--backend-questions)
3. [React & Frontend Questions](#react--frontend-questions)
4. [Database & SQL Questions](#database--sql-questions)
5. [LLM & AI Questions](#llm--ai-questions)
6. [Docker & DevOps Questions](#docker--devops-questions)
7. [API Design Questions](#api-design-questions)
8. [System Design & Architecture](#system-design--architecture)
9. [Debugging & Troubleshooting](#debugging--troubleshooting)
10. [Security Questions](#security-questions)
11. [Performance & Optimization](#performance--optimization)
12. [Scenario-Based Questions](#scenario-based-questions)
13. [Code Review Questions](#code-review-questions)
14. [Behavioral & Soft Skills](#behavioral--soft-skills)

---

## 🚀 Quick Technical Questions

### Q: What is Django REST Framework?
**A:** DRF is a powerful toolkit for building Web APIs in Django. It provides serializers for data validation and conversion, ViewSets for handling CRUD operations, authentication, permissions, pagination, and a browsable API interface.

---

### Q: What are React Hooks?
**A:** Functions that let you use state and lifecycle features in functional components. Examples: `useState` (state management), `useEffect` (side effects like API calls), `useContext` (context consumption).

---

### Q: What is Docker?
**A:** A containerization platform that packages applications with their dependencies into isolated containers. Ensures consistency across development, testing, and production environments.

---

### Q: What's the difference between SQL and NoSQL?
**A:** 
- **SQL (PostgreSQL):** Structured, relational, ACID compliant, schema-based, good for complex queries
- **NoSQL (MongoDB):** Flexible schema, document-based, horizontally scalable, good for unstructured data

---

### Q: What is REST?
**A:** Representational State Transfer - architectural style for APIs using HTTP methods (GET, POST, PUT, DELETE), stateless communication, resource-based URLs, and standard response codes.

---

### Q: What is CORS?
**A:** Cross-Origin Resource Sharing - security mechanism that allows web pages from one domain to access resources from another domain. Browsers block cross-origin requests by default; server must explicitly allow them.

---

### Q: What is ORM?
**A:** Object-Relational Mapping - technique to query and manipulate database data using object-oriented code instead of SQL. Django's ORM allows: `Ticket.objects.filter(category='billing')` instead of raw SQL.

---

### Q: What's the difference between authentication and authorization?
**A:**
- **Authentication:** Verifying WHO you are (login/password)
- **Authorization:** Verifying WHAT you can access (permissions/roles)

---

### Q: What is API rate limiting?
**A:** Restricting the number of API calls a user/client can make in a time period to prevent abuse, ensure fair usage, and protect server resources. Example: 100 requests per hour.

---

### Q: What is a serializer in DRF?
**A:** Converts complex data types (Django models, querysets) to native Python datatypes (JSON), and validates incoming data. Handles both serialization (model → JSON) and deserialization (JSON → model).

---

## 🐍 Django & Backend Questions

### Q: Explain the Django request-response cycle.
**A:**
1. Client sends HTTP request → Browser
2. Request hits Django → URL dispatcher
3. URL pattern matched → views.py function/class
4. View processes request → calls models/serializers
5. Model queries database → returns data
6. View formats response → JSON/HTML
7. Response sent back → client

---

### Q: What are Django models?
**A:** Python classes that define database table structure. Each model class maps to a database table, each attribute is a field/column. Example:
```python
class Ticket(models.Model):
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
```

---

### Q: What's the difference between `filter()` and `get()` in Django ORM?
**A:**
- **`filter()`:** Returns QuerySet (can be 0+ objects), chainable, doesn't raise exception if empty
- **`get()`:** Returns single object, raises DoesNotExist if not found, raises MultipleObjectsReturned if >1

```python
tickets = Ticket.objects.filter(category='billing')  # QuerySet
ticket = Ticket.objects.get(id=1)  # Single object or exception
```

---

### Q: What are Django migrations?
**A:** Version control for database schema. When you change models, migrations create/alter database tables. Commands:
- `python manage.py makemigrations` - Create migration files
- `python manage.py migrate` - Apply migrations to database

---

### Q: What is `select_related` and `prefetch_related`?
**A:**
- **`select_related`:** SQL JOIN for ForeignKey/OneToOne, single query
- **`prefetch_related`:** Separate queries for ManyToMany/reverse FK, reduces N+1 queries

```python
# Without optimization: 100 queries (1 + 99 for categories)
tickets = Ticket.objects.all()
for ticket in tickets:
    print(ticket.category)  # Each access hits DB

# With optimization: 2 queries
tickets = Ticket.objects.select_related('category').all()
```

---

### Q: What are Django signals?
**A:** Allow decoupled applications to get notified when actions occur. Example: `post_save` signal triggers after model.save(). Use cases: send email after user registration, log activity after ticket creation.

```python
from django.db.models.signals import post_save

@receiver(post_save, sender=Ticket)
def ticket_created(sender, instance, created, **kwargs):
    if created:
        send_notification_email(instance)
```

---

### Q: What's the difference between PUT and PATCH?
**A:**
- **PUT:** Replace entire resource (must send all fields)
- **PATCH:** Update partial resource (send only changed fields)

```python
# PUT /api/tickets/1/
{"title": "New", "description": "New", "category": "billing", ...}

# PATCH /api/tickets/1/
{"status": "resolved"}  # Only update status
```

---

### Q: How do you handle database transactions in Django?
**A:**
```python
from django.db import transaction

@transaction.atomic
def create_ticket_with_history(data):
    ticket = Ticket.objects.create(**data)
    TicketHistory.objects.create(ticket=ticket, action='created')
    # If any operation fails, all rollback
```

---

### Q: What are Django ViewSets?
**A:** Combine logic for multiple related views (list, create, retrieve, update, delete) into a single class. Reduces code duplication.

```python
class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    # Automatically provides: list, create, retrieve, update, destroy
```

---

### Q: What's the difference between `save()` and `create()` in Django?
**A:**
- **`save()`:** Instance method, updates existing or creates new
- **`create()`:** Manager method, always creates new object

```python
# save()
ticket = Ticket(title="Test")
ticket.save()  # INSERT

ticket.status = "resolved"
ticket.save()  # UPDATE

# create()
ticket = Ticket.objects.create(title="Test")  # INSERT only
```

---

## ⚛️ React & Frontend Questions

### Q: What's the Virtual DOM?
**A:** In-memory representation of real DOM. React compares Virtual DOM with previous version (diffing), calculates minimal changes needed, then updates only changed parts of real DOM. Makes updates faster.

---

### Q: What's the difference between state and props?
**A:**
- **State:** Internal data managed by component, mutable, triggers re-render on change
- **Props:** External data passed from parent, immutable, read-only

```javascript
// State - component owns and changes it
const [tickets, setTickets] = useState([]);

// Props - parent passes, child receives
<TicketList tickets={tickets} />
```

---

### Q: What is useEffect used for?
**A:** Handle side effects in functional components:
- API calls
- Subscriptions
- Timers
- DOM manipulations

```javascript
useEffect(() => {
    fetchTickets();  // Side effect
}, [filters]);  // Dependency array
```

---

### Q: What's the dependency array in useEffect?
**A:** Second argument that controls when effect runs:
- **No array:** Runs after every render
- **Empty array `[]`:** Runs once on mount
- **`[dependency]`:** Runs when dependency changes

```javascript
useEffect(() => { /* runs once */ }, []);
useEffect(() => { /* runs on filter change */ }, [filters]);
useEffect(() => { /* runs every render */ });
```

---

### Q: What are controlled vs uncontrolled components?
**A:**
- **Controlled:** Form values controlled by React state
- **Uncontrolled:** Form values controlled by DOM (use refs)

```javascript
// Controlled
const [title, setTitle] = useState('');
<input value={title} onChange={e => setTitle(e.target.value)} />

// Uncontrolled
const inputRef = useRef();
<input ref={inputRef} />
```

---

### Q: What is prop drilling and how to avoid it?
**A:** Passing props through multiple levels of components. Solutions:
1. **Context API:** Share data across component tree
2. **State management:** Redux, Zustand
3. **Composition:** Restructure components

```javascript
// Problem: Prop drilling
<App> → <Middle user={user}> → <Child user={user}>

// Solution: Context
const UserContext = createContext();
<UserContext.Provider value={user}>
    <Child />  // Access via useContext(UserContext)
</UserContext.Provider>
```

---

### Q: What are React keys and why are they important?
**A:** Unique identifiers for list items. Help React identify which items changed, added, or removed. Should be stable, unique, and not array index (if order changes).

```javascript
// Good
tickets.map(ticket => <li key={ticket.id}>{ticket.title}</li>)

// Bad
tickets.map((ticket, index) => <li key={index}>{ticket.title}</li>)
```

---

### Q: What's the difference between `==` and `===` in JavaScript?
**A:**
- **`==`:** Loose equality, type coercion
- **`===`:** Strict equality, no type coercion

```javascript
5 == "5"   // true (type coercion)
5 === "5"  // false (different types)
```

---

### Q: What are JavaScript promises?
**A:** Objects representing eventual completion/failure of async operation. Three states: pending, fulfilled, rejected.

```javascript
fetchTickets()
    .then(data => setTickets(data))
    .catch(error => setError(error))
    .finally(() => setLoading(false));

// Or async/await
try {
    const data = await fetchTickets();
    setTickets(data);
} catch (error) {
    setError(error);
}
```

---

### Q: What's the difference between `let`, `const`, and `var`?
**A:**
- **`const`:** Block-scoped, cannot reassign (but object properties can change)
- **`let`:** Block-scoped, can reassign
- **`var`:** Function-scoped, hoisted, outdated

```javascript
const tickets = [];
tickets.push(newTicket);  // OK - modifying array
tickets = [];  // ERROR - cannot reassign

let count = 0;
count = 5;  // OK
```

---

## 🗄️ Database & SQL Questions

### Q: What are database indexes and when to use them?
**A:** Data structures that improve query speed. Like book index - helps find data faster.

**Use when:**
- Frequent WHERE/JOIN/ORDER BY on column
- High read volume

**Don't use when:**
- Frequent writes (slows INSERT/UPDATE)
- Low cardinality columns (e.g., boolean)

```python
class Meta:
    indexes = [
        models.Index(fields=['category']),  # Speed up filtering
        models.Index(fields=['-created_at']),  # Speed up sorting
    ]
```

---

### Q: What's the difference between INNER JOIN and LEFT JOIN?
**A:**
- **INNER JOIN:** Returns only matching rows from both tables
- **LEFT JOIN:** Returns all from left table, matching from right (NULL if no match)

```sql
-- INNER JOIN: Only tickets with assigned agents
SELECT * FROM tickets INNER JOIN agents ON tickets.agent_id = agents.id;

-- LEFT JOIN: All tickets, agent info if assigned
SELECT * FROM tickets LEFT JOIN agents ON tickets.agent_id = agents.id;
```

---

### Q: What is database normalization?
**A:** Organizing data to reduce redundancy. Main goals:
- Eliminate duplicate data
- Ensure data dependencies make sense

**Normal Forms:**
- **1NF:** Atomic values, no repeating groups
- **2NF:** No partial dependencies
- **3NF:** No transitive dependencies

---

### Q: What's the difference between SQL and NoSQL databases?
**A:**

| Feature | SQL (PostgreSQL) | NoSQL (MongoDB) |
|---------|------------------|-----------------|
| Schema | Fixed, predefined | Flexible, dynamic |
| Scaling | Vertical (bigger server) | Horizontal (more servers) |
| Transactions | ACID compliant | Eventually consistent |
| Relations | JOINs | Embedded documents |
| Best for | Complex queries, relationships | Rapid development, unstructured data |

---

### Q: What are database transactions?
**A:** Series of operations treated as single unit - all succeed or all fail (atomicity).

**ACID Properties:**
- **Atomicity:** All or nothing
- **Consistency:** Valid state before/after
- **Isolation:** Concurrent transactions don't interfere
- **Durability:** Committed changes persist

---

### Q: How do you prevent SQL injection?
**A:**
1. **Use ORM:** Django ORM escapes inputs automatically
2. **Parameterized queries:** Never concatenate user input into SQL
3. **Validate input:** Sanitize and validate all user data

```python
# UNSAFE - SQL injection risk
query = f"SELECT * FROM tickets WHERE id = {user_input}"

# SAFE - Django ORM
Ticket.objects.filter(id=user_input)  # Automatically escaped

# SAFE - Parameterized
cursor.execute("SELECT * FROM tickets WHERE id = %s", [user_input])
```

---

### Q: What is database connection pooling?
**A:** Reusing database connections instead of creating new ones for each request. Improves performance by reducing connection overhead.

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'CONN_MAX_AGE': 600,  # Keep connection for 10 minutes
    }
}
```

---

## 🤖 LLM & AI Questions

### Q: What is prompt engineering?
**A:** Crafting effective instructions for LLMs to get desired outputs. Techniques:
- Clear role definition
- Specific output format
- Examples (few-shot learning)
- Constraints and guidelines

```python
prompt = """You are a support ticket classifier.
Categories: billing, technical, account, general
Output: JSON only {"category": "...", "priority": "..."}
Example: "Can't login" → {"category": "account", "priority": "medium"}
"""
```

---

### Q: What is temperature in LLM settings?
**A:** Controls randomness of output (0-1):
- **0:** Deterministic, same output every time
- **0.3:** Low randomness, good for classification
- **0.7:** Balanced creativity
- **1.0:** High randomness, creative writing

```python
client.chat.completions.create(
    model="gpt-3.5-turbo",
    temperature=0.3,  # Consistent classifications
    messages=[...]
)
```

---

### Q: What is few-shot learning?
**A:** Providing examples in the prompt to teach the model desired behavior without training.

```python
Examples in prompt:
- "I can't log in" → {"category": "account", "priority": "medium"}
- "System is down!" → {"category": "technical", "priority": "critical"}
- "How do I change billing?" → {"category": "billing", "priority": "low"}
```

---

### Q: Why limit max_tokens in LLM calls?
**A:**
- **Cost control:** Pay per token
- **Speed:** Fewer tokens = faster response
- **Focus:** Forces concise answers

```python
max_tokens=100  # We only need short JSON response
```

---

### Q: How do you handle LLM API rate limits?
**A:**
1. **Exponential backoff:** Retry with increasing delays
2. **Queue system:** Use Celery for async processing
3. **Caching:** Cache common classifications
4. **Fallback:** Use rule-based system when rate limited

```python
for attempt in range(3):
    try:
        return llm_api_call()
    except RateLimitError:
        time.sleep(2 ** attempt)  # 1s, 2s, 4s
```

---

### Q: What's the difference between GPT-3.5 and GPT-4?
**A:**
- **GPT-3.5:** Faster, cheaper (~$0.002/1K tokens), good for simple tasks
- **GPT-4:** More accurate, better reasoning, slower, expensive (~$0.03/1K tokens)

For ticket classification, GPT-3.5 is sufficient.

---

### Q: What is token in LLM context?
**A:** Piece of text the model processes. Roughly:
- 1 token ≈ 4 characters
- 1 token ≈ 0.75 words
- "Hello world!" ≈ 3 tokens

Cost and limits are token-based.

---

## 🐳 Docker & DevOps Questions

### Q: What's the difference between Docker image and container?
**A:**
- **Image:** Blueprint/template (immutable)
- **Container:** Running instance of image (mutable)

Like: Class vs Object in OOP

---

### Q: What is Docker Compose?
**A:** Tool for defining and running multi-container applications using YAML file. Single command starts all services with proper networking and dependencies.

```yaml
services:
  db:        # Service 1: Database
  backend:   # Service 2: Django API
  frontend:  # Service 3: React app
```

---

### Q: What is a Dockerfile?
**A:** Text file with instructions to build Docker image.

```dockerfile
FROM python:3.11          # Base image
WORKDIR /app              # Working directory
COPY requirements.txt .   # Copy files
RUN pip install -r requirements.txt  # Install dependencies
COPY . .                  # Copy source code
CMD ["python", "manage.py", "runserver"]  # Start command
```

---

### Q: What's the difference between CMD and ENTRYPOINT?
**A:**
- **CMD:** Default command, can be overridden
- **ENTRYPOINT:** Always executed, CMD becomes arguments

```dockerfile
ENTRYPOINT ["python", "manage.py"]
CMD ["runserver"]  # Can override to "migrate", etc.
```

---

### Q: What are Docker volumes?
**A:** Persistent data storage outside containers. Survive container deletion.

```yaml
volumes:
  postgres_data:/var/lib/postgresql/data  # Database persists
```

---

### Q: What is Docker networking?
**A:** Allows containers to communicate. Docker Compose creates network automatically.

```yaml
services:
  backend:
    depends_on:
      - db  # Can access db via hostname "db"
```

---

### Q: What's the difference between development and production Dockerfile?
**A:**

**Development:**
```dockerfile
CMD ["python", "manage.py", "runserver"]  # Dev server
# Volume mounted for live code changes
```

**Production:**
```dockerfile
RUN python manage.py collectstatic --noinput  # Static files
CMD ["gunicorn", "config.wsgi"]  # Production server
# No volume mount, code in image
```

---

### Q: What is CI/CD?
**A:**
- **CI (Continuous Integration):** Automatically test code on every commit
- **CD (Continuous Deployment):** Automatically deploy passing code to production

```yaml
# GitHub Actions example
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: python manage.py test
      - run: docker build .
```

---

### Q: What is container orchestration?
**A:** Managing multiple containers across multiple servers. Tools: Kubernetes, Docker Swarm.

Features:
- Auto-scaling
- Load balancing
- Health checks
- Rolling updates
- Self-healing

---

## 🔌 API Design Questions

### Q: What are HTTP status codes you should know?
**A:**
- **200 OK:** Success
- **201 Created:** Resource created
- **204 No Content:** Success, no response body
- **400 Bad Request:** Invalid input
- **401 Unauthorized:** Authentication required
- **403 Forbidden:** Authenticated but no permission
- **404 Not Found:** Resource doesn't exist
- **500 Internal Server Error:** Server error

---

### Q: What makes a good RESTful API?
**A:**
1. **Resource-based URLs:** `/tickets/` not `/get_tickets/`
2. **HTTP methods:** GET (read), POST (create), PATCH (update), DELETE (remove)
3. **Stateless:** Each request self-contained
4. **Consistent:** Similar patterns across endpoints
5. **Versioned:** `/api/v1/tickets/`
6. **Documented:** Clear API docs

---

### Q: What is API versioning and why is it important?
**A:** Managing changes to API without breaking existing clients.

**Methods:**
1. **URL:** `/api/v1/tickets/`, `/api/v2/tickets/`
2. **Header:** `Accept: application/vnd.api.v1+json`
3. **Query param:** `/api/tickets/?version=1`

Allows backward compatibility when making breaking changes.

---

### Q: What's the difference between authentication and API keys?
**A:**
- **Authentication (JWT/Session):** Identifies users, expires, can be revoked
- **API Keys:** Long-lived, identifies applications, typically doesn't expire

```python
# JWT Authentication
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Key
X-API-Key: sk_test_abcd1234...
```

---

### Q: How do you handle API errors consistently?
**A:**
```python
# Consistent error format
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid ticket data",
        "details": {
            "title": ["This field is required"],
            "category": ["Invalid choice"]
        }
    }
}
```

---

### Q: What is HATEOAS?
**A:** Hypermedia As The Engine Of Application State - REST constraint where API responses include links to related resources.

```json
{
    "id": 1,
    "title": "Bug report",
    "links": {
        "self": "/api/tickets/1/",
        "update": "/api/tickets/1/",
        "history": "/api/tickets/1/history/"
    }
}
```

---

## 🏗️ System Design & Architecture

### Q: How would you design a notification system for tickets?
**A:**

**Architecture:**
```
Ticket Created → Event → Message Queue (RabbitMQ)
                           ↓
                    Notification Service
                    ↙      ↓       ↘
                Email   SMS   Push Notification
```

**Implementation:**
1. Publish event when ticket status changes
2. Notification service subscribes to events
3. Determines notification preferences
4. Sends via appropriate channel
5. Logs delivery status

---

### Q: How would you implement real-time updates?
**A:**

**Options:**
1. **WebSockets (Django Channels):** Bidirectional communication
2. **Server-Sent Events (SSE):** One-way, simpler
3. **Polling:** Periodic API calls (simple but inefficient)

**Recommendation: WebSockets**
```python
# Django Channels
class TicketConsumer(WebsocketConsumer):
    def ticket_update(self, event):
        self.send(json.dumps(event['ticket']))
```

---

### Q: How would you implement search functionality?
**A:**

**Current (Simple):**
```python
Ticket.objects.filter(Q(title__icontains=search) | Q(description__icontains=search))
```

**Better (Elasticsearch):**
```python
# Index tickets in Elasticsearch
es.index(index='tickets', body=ticket_data)

# Full-text search with relevance scoring
results = es.search(index='tickets', query={
    'multi_match': {
        'query': search_term,
        'fields': ['title^2', 'description'],  # title weighted 2x
        'fuzziness': 'AUTO'  # Handle typos
    }
})
```

---

### Q: How would you implement a caching layer?
**A:**

**Strategy:**
```python
# Redis caching
from django.core.cache import cache

def get_ticket_stats():
    # Try cache first
    stats = cache.get('ticket_stats')
    if stats is None:
        # Cache miss - calculate
        stats = calculate_stats()
        cache.set('ticket_stats', stats, timeout=300)  # 5 min
    return stats
```

**What to cache:**
- Statistics (updated infrequently)
- Categories/priorities (static data)
- User permissions
- LLM classifications (same description → same result)

---

### Q: Design a system to handle 1 million tickets per day.
**A:**

**Architecture:**
```
Load Balancer (Nginx)
    ↓
API Servers (multiple Django instances)
    ↓
Message Queue (RabbitMQ/SQS)
    ↓
Worker Servers (Celery)
    ↓
Database Cluster (PostgreSQL - Primary + Replicas)
    ↓
Cache Layer (Redis)
```

**Key strategies:**
1. **Horizontal scaling:** Multiple API servers
2. **Async processing:** Queue LLM classification
3. **Database optimization:** Indexes, query optimization
4. **Caching:** Reduce database load
5. **CDN:** Serve static files
6. **Monitoring:** Track bottlenecks

---

### Q: How would you implement rate limiting?
**A:**

**DRF Throttling:**
```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour'
    }
}
```

**Redis-based (better for distributed):**
```python
import redis
r = redis.Redis()

def is_rate_limited(user_id):
    key = f'rate_limit:{user_id}'
    count = r.incr(key)
    if count == 1:
        r.expire(key, 3600)  # 1 hour window
    return count > 100
```

---

## 🐛 Debugging & Troubleshooting

### Q: How do you debug a slow API endpoint?
**A:**

**Steps:**
1. **Logging:** Add timing logs
```python
import time
start = time.time()
result = slow_operation()
logger.info(f'Operation took {time.time() - start}s')
```

2. **Django Debug Toolbar:** Shows SQL queries
```python
# Shows: 100 queries! N+1 problem
# Fix: Use select_related/prefetch_related
```

3. **Database query analysis:**
```python
from django.db import connection
print(connection.queries)  # See all SQL queries
```

4. **Profiling:**
```python
import cProfile
cProfile.run('my_function()')
```

**Common culprits:**
- N+1 queries
- Missing indexes
- Large data transfers
- External API calls

---

### Q: Frontend shows "Network Error" - how do you debug?
**A:**

**Check:**
1. **Browser Console:** See actual error
2. **Network Tab:** Check request/response
3. **Backend logs:** See if request reached server
4. **CORS:** Cross-origin blocked?

```javascript
// Add detailed error logging
try {
    const response = await axios.post('/api/tickets/', data);
} catch (error) {
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Headers:', error.response?.headers);
}
```

**Common issues:**
- Wrong URL (http vs https)
- CORS not configured
- Request timeout
- Server not running

---

### Q: Database query is slow - how to optimize?
**A:**

**Diagnosis:**
```sql
EXPLAIN ANALYZE SELECT * FROM tickets WHERE category = 'billing' ORDER BY created_at;
```

**Optimization techniques:**
1. **Add indexes:**
```python
indexes = [models.Index(fields=['category', '-created_at'])]
```

2. **Reduce data:**
```python
# Bad: Fetch all fields
tickets = Ticket.objects.all()

# Good: Only needed fields
tickets = Ticket.objects.values('id', 'title', 'status')
```

3. **Pagination:**
```python
tickets = Ticket.objects.all()[:20]  # Limit results
```

4. **Optimize joins:**
```python
tickets = Ticket.objects.select_related('user').all()
```

---

### Q: Docker container keeps crashing - how to debug?
**A:**

**Steps:**
1. **Check logs:**
```bash
docker-compose logs backend
docker logs <container_id>
```

2. **Check container status:**
```bash
docker ps -a  # See exit codes
```

3. **Interactive debugging:**
```bash
docker-compose run backend bash
# Run commands manually to see errors
```

4. **Check dependencies:**
```bash
docker-compose up db  # Start only database
docker-compose up backend  # Then start backend
```

**Common issues:**
- Database not ready (add health checks)
- Environment variables missing
- Port conflicts
- Volume permission issues

---

### Q: React component not re-rendering - why?
**A:**

**Common causes:**

1. **State mutation:**
```javascript
// Wrong - mutates state
tickets.push(newTicket);
setTickets(tickets);  // React doesn't detect change

// Right - new array
setTickets([...tickets, newTicket]);
```

2. **Missing dependency:**
```javascript
useEffect(() => {
    fetchData();
}, []);  // Missing 'filters' dependency
```

3. **Object reference:**
```javascript
// Wrong - same reference
setFilters(filters);

// Right - new object
setFilters({...filters});
```

---

## 🔒 Security Questions

### Q: What security measures would you add to this system?
**A:**

**Authentication & Authorization:**
```python
# JWT tokens
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}
```

**Input validation:**
- Serializer validation (already doing)
- Sanitize HTML input
- Validate file uploads

**HTTPS:**
```python
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

**Rate limiting:**
```python
'DEFAULT_THROTTLE_RATES': {
    'anon': '100/hour',
    'user': '1000/hour'
}
```

**Environment secrets:**
- Never commit API keys
- Use environment variables
- Rotate keys regularly

---

### Q: How do you prevent XSS attacks?
**A:**

**Frontend:**
```javascript
// React automatically escapes by default
<div>{userInput}</div>  // Safe

// Dangerous - avoid
<div dangerouslySetInnerHTML={{__html: userInput}} />
```

**Backend:**
```python
# Django templates auto-escape
{{ ticket.description }}  # Safe

# Disable carefully
{{ ticket.description|safe }}  # Only for trusted content
```

**Content Security Policy:**
```python
MIDDLEWARE = [
    'csp.middleware.CSPMiddleware',
]
CSP_DEFAULT_SRC = ("'self'",)
```

---

### Q: How do you secure API keys in production?
**A:**

**Don't:**
- ❌ Hardcode in source
- ❌ Commit to git
- ❌ Store in frontend code

**Do:**
- ✅ Environment variables
- ✅ Secret management service (AWS Secrets Manager, HashiCorp Vault)
- ✅ Rotate regularly
- ✅ Different keys per environment

```python
# settings.py
import os
LLM_API_KEY = os.environ.get('LLM_API_KEY')

# .env (not committed)
LLM_API_KEY=sk_test_abcd1234

# docker-compose.yml
environment:
  - LLM_API_KEY=${LLM_API_KEY}
```

---

### Q: What is CSRF and how does Django protect against it?
**A:**

**CSRF (Cross-Site Request Forgery):** Attacker tricks user into making unwanted requests.

**Django protection:**
1. CSRF token in forms
2. Token validated on POST/PUT/DELETE
3. Cookie + form token must match

```python
# DRF
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ]
}

# Frontend must include CSRF token
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
```

---

## ⚡ Performance & Optimization

### Q: How do you optimize database queries?
**A:**

**1. Use select_related/prefetch_related:**
```python
# Bad: N+1 queries
tickets = Ticket.objects.all()
for ticket in tickets:
    print(ticket.user.name)  # Query per iteration

# Good: 2 queries
tickets = Ticket.objects.select_related('user').all()
```

**2. Only fetch needed fields:**
```python
# Bad: Fetch all fields including large text
tickets = Ticket.objects.all()

# Good: Only IDs and titles
tickets = Ticket.objects.values('id', 'title')
```

**3. Use aggregation at DB level:**
```python
# Bad: Python-level counting
categories = {}
for ticket in Ticket.objects.all():
    categories[ticket.category] = categories.get(ticket.category, 0) + 1

# Good: Database aggregation
categories = Ticket.objects.values('category').annotate(count=Count('id'))
```

**4. Add indexes:**
```python
indexes = [
    models.Index(fields=['category', 'priority']),
]
```

---

### Q: How do you optimize React performance?
**A:**

**1. Memoization:**
```javascript
import { useMemo, useCallback } from 'react';

// Expensive calculation
const stats = useMemo(() => calculateStats(tickets), [tickets]);

// Function reference stability
const handleUpdate = useCallback((id) => {
    updateTicket(id);
}, []);
```

**2. Code splitting:**
```javascript
const TicketDetails = lazy(() => import('./TicketDetails'));

<Suspense fallback={<Loading />}>
    <TicketDetails />
</Suspense>
```

**3. Virtual scrolling for large lists:**
```javascript
// react-window library
<FixedSizeList
    height={600}
    itemCount={tickets.length}
    itemSize={80}
>
    {TicketRow}
</FixedSizeList>
```

**4. Debounce search:**
```javascript
const debouncedSearch = useMemo(
    () => debounce(value => fetchTickets(value), 300),
    []
);
```

---

### Q: What is lazy loading and when to use it?
**A:**

**Concept:** Load resources only when needed.

**Frontend:**
```javascript
// Route-based
const Dashboard = lazy(() => import('./Dashboard'));
const Reports = lazy(() => import('./Reports'));

// Image
<img loading="lazy" src="large-image.jpg" />
```

**Backend:**
```python
# Don't load related objects until accessed
tickets = Ticket.objects.all()  # Doesn't load user data
ticket.user.name  # Now loads user (if not select_related)
```

**Use when:**
- Large components not immediately visible
- Heavy data not always needed
- Initial load time is critical

---

## 🎭 Scenario-Based Questions

### Q: User reports ticket creation is slow. How do you investigate?
**A:**

**Step 1: Reproduce**
- Try creating ticket myself
- Check browser network tab (how long does API take?)

**Step 2: Identify bottleneck**
- Check backend logs for timing
- Most likely: LLM API call (1-2 seconds)

**Step 3: Solution**
```python
# Option A: Async processing
@transaction.atomic
def create_ticket(data):
    ticket = Ticket.objects.create(
        title=data['title'],
        description=data['description'],
        category='general',  # Default
        priority='medium',
        status='open'
    )
    # Classify asynchronously
    classify_ticket_task.delay(ticket.id)
    return ticket

# Option B: Show immediate feedback
# Create ticket first, classify in background, update UI when ready
```

---

### Q: Database is running out of space. What do you do?
**A:**

**Immediate (Short-term):**
1. Check what's using space: `SELECT pg_size_pretty(pg_database_size('tickets'));`
2. Archive old resolved/closed tickets
3. Clean up test data

**Long-term:**
1. **Data retention policy:** Auto-archive tickets >1 year old
2. **Separate storage:** Move attachments to S3
3. **Database partitioning:** Partition by date
4. **Compression:** Enable PostgreSQL table compression

```python
# Archive old tickets
from datetime import timedelta
old_date = timezone.now() - timedelta(days=365)
old_tickets = Ticket.objects.filter(
    status='closed',
    created_at__lt=old_date
)
# Move to archive table or export to cold storage
```

---

### Q: LLM API is down. How does system behave?
**A:**

**Current behavior:**
1. LLM call fails
2. Exception caught
3. Falls back to keyword-based classification
4. Ticket still created successfully
5. Error logged for monitoring

**User experience:**
- No difference - ticket created normally
- May get less accurate category/priority
- System continues functioning

**Monitoring alert:**
- High fallback usage triggers alert
- Team investigates LLM API status
- Can switch to backup provider if needed

---

### Q: You need to add a new field to Ticket model. What's your process?
**A:**

**Steps:**

1. **Update model:**
```python
class Ticket(models.Model):
    # ... existing fields
    assigned_to = models.ForeignKey(User, null=True, blank=True)
```

2. **Create migration:**
```bash
python manage.py makemigrations
```

3. **Review migration:**
```python
# migrations/0002_ticket_assigned_to.py
operations = [
    migrations.AddField(
        model_name='ticket',
        name='assigned_to',
        field=models.ForeignKey(..., null=True),
    ),
]
```

4. **Test migration:**
```bash
python manage.py migrate
```

5. **Update serializer:**
```python
class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        fields = [..., 'assigned_to']
```

6. **Update frontend:**
```javascript
// Add to ticket display
<div>Assigned to: {ticket.assigned_to}</div>
```

7. **Deploy:**
- Run migration in production
- Deploy new code

---

### Q: How do you handle a breaking API change?
**A:**

**Strategy: API Versioning**

1. **Keep old version running:**
```python
# urls.py
urlpatterns = [
    path('api/v1/', include('tickets.urls_v1')),
    path('api/v2/', include('tickets.urls_v2')),  # New version
]
```

2. **Communicate change:**
- Email users about deprecation
- Documentation updates
- Deprecation timeline (e.g., 6 months)

3. **Add deprecation warnings:**
```python
# V1 view
def list_tickets(request):
    warnings.warn('API v1 deprecated, use v2', DeprecationWarning)
    return Response(...)
```

4. **Monitor usage:**
- Track v1 vs v2 usage
- Contact users still on v1
- Sunset v1 after deadline

---

## 📝 Code Review Questions

### Q: Review this code - what's wrong?
```python
def get_tickets():
    tickets = Ticket.objects.all()
    result = []
    for ticket in tickets:
        result.append({
            'id': ticket.id,
            'title': ticket.title,
            'user': ticket.user.name  # Problem!
        })
    return result
```

**Answer:**
**Problem:** N+1 query - queries database for each user

**Fix:**
```python
def get_tickets():
    tickets = Ticket.objects.select_related('user').all()
    # Or use serializer
    return TicketSerializer(tickets, many=True).data
```

---

### Q: Review this React code - what's wrong?
```javascript
function TicketList() {
    const [tickets, setTickets] = useState([]);
    
    fetchTickets().then(data => setTickets(data));  // Problem!
    
    return <div>{tickets.map(t => <div>{t.title}</div>)}</div>;
}
```

**Answer:**
**Problems:**
1. Fetches on every render (infinite loop)
2. No error handling
3. No loading state

**Fix:**
```javascript
function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        setLoading(true);
        fetchTickets()
            .then(data => setTickets(data))
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }, []);  // Empty dependency - run once
    
    if (loading) return <div>Loading...</div>;
    return <div>{tickets.map(t => <div key={t.id}>{t.title}</div>)}</div>;
}
```

---

### Q: What's wrong with this Docker setup?
```dockerfile
FROM python:3.11
COPY . /app
RUN pip install django djangorestframework
CMD python manage.py runserver
```

**Answer:**
**Problems:**
1. No WORKDIR set
2. Hardcoded dependencies (should use requirements.txt)
3. No version pinning (reproducibility issue)
4. Copies everything (including unnecessary files)
5. Missing port exposure
6. Using runserver in production

**Fix:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

---

## 💼 Behavioral & Soft Skills

### Q: Tell me about a time you had to learn a new technology quickly.
**A:** 
"For this project, I needed to integrate LLM APIs, which I hadn't used before. I:
1. Read OpenAI documentation and examples
2. Built a simple prototype to test classification
3. Iterated on prompt engineering to improve accuracy
4. Added error handling and fallback logic
5. Successfully integrated it within 2 days

The key was breaking it down into small steps and testing incrementally."

---

### Q: How do you stay updated with new technologies?
**A:**
- Follow tech blogs (Django, React official blogs)
- GitHub trending repositories
- Tech Twitter/LinkedIn
- Online courses (when learning new tech)
- Reading documentation of tools I use
- Side projects to experiment

---

### Q: Describe your development workflow.
**A:**
1. **Understand requirements:** Break down features
2. **Plan:** Database design, API endpoints, components
3. **Develop iteratively:** Start with backend, then frontend
4. **Test:** Manual testing, edge cases
5. **Review:** Check code quality, optimization
6. **Document:** Comments, README updates
7. **Deploy:** Docker build, test in production-like environment

---

### Q: How do you handle disagreements with team members?
**A:**
"I focus on the problem, not the person:
1. Listen to their perspective fully
2. Explain my reasoning with data/examples
3. Find common ground
4. If still disagree, try both approaches on small scale
5. Let results guide decision

Example: If someone prefers Redux over useState, I'd prototype both and compare complexity vs. benefits for our specific use case."

---

### Q: What's your approach to debugging a complex issue?
**A:**
1. **Reproduce:** Can I consistently trigger it?
2. **Isolate:** Where exactly does it fail?
3. **Hypothesize:** What could cause this?
4. **Test:** Add logging, breakpoints
5. **Fix:** Implement solution
6. **Verify:** Test fix + regression testing
7. **Document:** Comment why issue happened

---

### Q: How do you prioritize features when building a product?
**A:**
1. **Must-have:** Core functionality (create/view tickets)
2. **Should-have:** Important but not blocking (filtering)
3. **Nice-to-have:** Enhancements (advanced analytics)

I use: Impact (user value) × Effort (dev time) = Priority score
Focus on high impact, low effort first.

---

### Q: Tell me about a bug you spent a long time debugging.
**A:**
"Early in this project, tickets weren't appearing in the list after creation. I:
1. Checked API response - ticket was created
2. Checked React state - not updating
3. Added console.logs - state updated but no re-render
4. Realized: I was mutating state directly instead of creating new object
5. Fixed: Used spread operator to create new array
6. Learned: Always create new state objects in React

Took 2 hours but learned valuable lesson about React state immutability."

---

### Q: Why do you want to work here?
**A:** [Customize based on company]
"I'm excited about [company's mission/product]. This role combines backend development, AI integration, and user-facing features - areas I enjoy and have experience in. I particularly like that you [specific thing about company culture/tech stack/projects]. I think my experience with Django, React, and LLM integration would let me contribute immediately while continuing to grow."

---

### Q: Where do you see yourself in 5 years?
**A:** [Customize to your goals]
"I want to become a senior full-stack engineer who can architect scalable systems and mentor junior developers. I'm particularly interested in AI/ML integration in production systems. In 5 years, I'd like to be leading technical decisions on projects and helping build products that solve real problems for users."

---

## 🎓 Quick Facts to Remember

### Your Project Statistics:
- **Languages:** Python, JavaScript
- **Backend:** Django 4.2, DRF 3.14, Python 3.11
- **Frontend:** React 18, Axios, CSS3
- **Database:** PostgreSQL 15
- **AI:** OpenAI GPT-3.5 / Anthropic Claude
- **Infrastructure:** Docker, Docker Compose
- **Models:** 1 (Ticket)
- **API Endpoints:** 5 (list, create, retrieve, update, stats)
- **Components:** 4 main (TicketForm, TicketList, TicketStats, FilterBar)

### Key Technical Achievements:
✅ Full-stack application (backend + frontend + database)
✅ RESTful API with filtering and search
✅ AI-powered classification with error handling
✅ Docker containerization
✅ Real-time statistics with database aggregation
✅ Responsive UI with smooth animations
✅ Production-ready setup (Gunicorn, Nginx)

---

## 🎯 Final Tips for Tomorrow

### Before Interview:
1. ✅ Review this document
2. ✅ Test your project (make sure it runs)
3. ✅ Prepare demo flow
4. ✅ Think of questions to ask them
5. ✅ Get good sleep!

### During Interview:
1. **Listen carefully** to questions
2. **Think before answering** (it's okay to pause)
3. **Ask clarifying questions** if needed
4. **Explain your thought process** while coding
5. **Be honest** if you don't know something
6. **Show enthusiasm** for technology

### Demo Tips:
1. **Have project running beforehand**
2. **Show complete flow:** Create ticket → AI suggests → Filter → Stats
3. **Mention technical details:** "Here Django ORM filters by category"
4. **Point out features:** "Notice the LLM suggested 'high' priority"
5. **Be ready to show code** if asked

### Things to Emphasize:
- "I built this end-to-end"
- "I implemented AI with error handling"
- "I made it production-ready with Docker"
- "I considered scalability and performance"
- "I can explain every technical decision"

---

## Good Luck! 🚀

Remember: You built a real, working system that solves a real problem using modern technologies. Be confident in your work and your ability to explain it!

**You've got this!** 💪
