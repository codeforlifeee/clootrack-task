# API Documentation

Complete API documentation for the Support Ticket System backend.

**Base URL**: `http://localhost:8000/api`

## Authentication

Currently, no authentication is required (assessment version). In production, implement JWT or session-based authentication.

## Response Format

All responses are in JSON format.

### Success Response
```json
{
  "id": 1,
  "title": "Cannot login",
  "description": "...",
  ...
}
```

### Error Response
```json
{
  "detail": "Error message",
  "field_name": ["Validation error message"]
}
```

---

## Endpoints

### 1. List All Tickets

**GET** `/tickets/`

Returns a list of all tickets, with optional filtering and search.

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| category | string | Filter by category | `?category=billing` |
| priority | string | Filter by priority | `?priority=high` |
| status | string | Filter by status | `?status=open` |
| search | string | Search in title and description | `?search=password` |

#### Response

```json
[
  {
    "id": 1,
    "title": "Cannot reset password",
    "description": "I tried to reset my password but did not receive the email",
    "category": "account",
    "priority": "high",
    "status": "open",
    "created_at": "2026-02-18T10:30:00Z"
  },
  ...
]
```

#### Status Codes

- `200 OK` - Success

#### Example

```bash
# Get all tickets
curl http://localhost:8000/api/tickets/

# Filter by category and priority
curl "http://localhost:8000/api/tickets/?category=technical&priority=critical"

# Search for keywords
curl "http://localhost:8000/api/tickets/?search=login+error"
```

---

### 2. Create a Ticket

**POST** `/tickets/`

Creates a new support ticket.

#### Request Body

```json
{
  "title": "Cannot access dashboard",
  "description": "When I try to access the dashboard, I get a 500 error",
  "category": "technical",
  "priority": "high"
}
```

#### Required Fields

- `title` (string, max 200 characters)
- `description` (string)
- `category` (string: billing, technical, account, general)
- `priority` (string: low, medium, high, critical)

#### Response

```json
{
  "id": 5,
  "title": "Cannot access dashboard",
  "description": "When I try to access the dashboard, I get a 500 error",
  "category": "technical",
  "priority": "high",
  "status": "open",
  "created_at": "2026-02-18T10:45:00Z"
}
```

#### Status Codes

- `201 Created` - Ticket created successfully
- `400 Bad Request` - Validation error

#### Example

```bash
curl -X POST http://localhost:8000/api/tickets/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cannot access dashboard",
    "description": "When I try to access the dashboard, I get a 500 error",
    "category": "technical",
    "priority": "high"
  }'
```

---

### 3. Get Ticket Details

**GET** `/tickets/{id}/`

Returns details of a specific ticket.

#### Parameters

- `id` (integer) - Ticket ID

#### Response

```json
{
  "id": 5,
  "title": "Cannot access dashboard",
  "description": "When I try to access the dashboard, I get a 500 error",
  "category": "technical",
  "priority": "high",
  "status": "open",
  "created_at": "2026-02-18T10:45:00Z"
}
```

#### Status Codes

- `200 OK` - Success
- `404 Not Found` - Ticket does not exist

#### Example

```bash
curl http://localhost:8000/api/tickets/5/
```

---

### 4. Update a Ticket

**PATCH** `/tickets/{id}/`

Updates a ticket (partial update). Commonly used to change status.

#### Parameters

- `id` (integer) - Ticket ID

#### Request Body

You can update any field:

```json
{
  "status": "in_progress"
}
```

Or multiple fields:

```json
{
  "status": "resolved",
  "priority": "medium"
}
```

#### Response

```json
{
  "id": 5,
  "title": "Cannot access dashboard",
  "description": "When I try to access the dashboard, I get a 500 error",
  "category": "technical",
  "priority": "high",
  "status": "in_progress",
  "created_at": "2026-02-18T10:45:00Z"
}
```

#### Status Codes

- `200 OK` - Updated successfully
- `400 Bad Request` - Validation error
- `404 Not Found` - Ticket does not exist

#### Example

```bash
# Update status
curl -X PATCH http://localhost:8000/api/tickets/5/ \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}'

# Update multiple fields
curl -X PATCH http://localhost:8000/api/tickets/5/ \
  -H "Content-Type: application/json" \
  -d '{"status": "closed", "priority": "low"}'
```

---

### 5. Get Statistics

**GET** `/tickets/stats/`

Returns aggregated statistics about all tickets.

#### Response

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

#### Status Codes

- `200 OK` - Success

#### Example

```bash
curl http://localhost:8000/api/tickets/stats/
```

---

### 6. Classify Ticket (LLM)

**POST** `/tickets/classify/`

Uses LLM to analyze a ticket description and suggest category and priority.

#### Request Body

```json
{
  "description": "I have been charged twice for the same subscription this month"
}
```

#### Response

```json
{
  "suggested_category": "billing",
  "suggested_priority": "high"
}
```

#### Status Codes

- `200 OK` - Classification successful
- `400 Bad Request` - Invalid request (missing description)
- `500 Internal Server Error` - LLM service unavailable (will use fallback)

#### Example

```bash
curl -X POST http://localhost:8000/api/tickets/classify/ \
  -H "Content-Type: application/json" \
  -d '{"description": "I have been charged twice for the same subscription"}'
```

#### Notes

- If LLM API is unavailable, returns fallback classification based on keywords
- Classification is a suggestion - users can override it
- Typically called from frontend when user finishes typing description

---

## Field Value Options

### Category

- `billing` - Payment, invoice, refund issues
- `technical` - Bugs, errors, technical problems
- `account` - Login, password, account settings
- `general` - General inquiries and other issues

### Priority

- `low` - Minor issues, questions
- `medium` - Standard issues
- `high` - Significant problems
- `critical` - System down, severe issues

### Status

- `open` - Newly created ticket (default)
- `in_progress` - Being worked on
- `resolved` - Issue fixed
- `closed` - Ticket closed

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or malformed request |
| 404 | Not Found - Resource does not exist |
| 500 | Internal Server Error - Server-side error |

---

## Rate Limiting

Not implemented in this version. For production:
- Implement rate limiting (e.g., Django Ratelimit)
- Suggested: 100 requests per minute per IP

---

## CORS

CORS is enabled for all origins in development. For production:
- Restrict to specific frontend domains
- Configure in `backend/config/settings.py`

---

## Testing the API

### Using cURL

All examples above use cURL. Available on Mac/Linux by default, install on Windows via:
- Git Bash
- WSL (Windows Subsystem for Linux)
- Download from https://curl.se/

### Using Postman

1. Import collection (not provided, but easy to create)
2. Set base URL: `http://localhost:8000/api`
3. Test each endpoint

### Using Python

```python
import requests

# List tickets
response = requests.get('http://localhost:8000/api/tickets/')
print(response.json())

# Create ticket
ticket_data = {
    'title': 'Test ticket',
    'description': 'This is a test',
    'category': 'general',
    'priority': 'low'
}
response = requests.post('http://localhost:8000/api/tickets/', json=ticket_data)
print(response.json())

# Classify description
desc = {'description': 'Cannot login to my account'}
response = requests.post('http://localhost:8000/api/tickets/classify/', json=desc)
print(response.json())
```

---

## Production Considerations

For production deployment:

1. **Authentication** - Add JWT or OAuth
2. **Rate Limiting** - Prevent API abuse
3. **Pagination** - For large datasets
4. **Caching** - Redis for frequently accessed data
5. **Monitoring** - Log all API calls
6. **HTTPS** - Always use SSL/TLS
7. **Documentation** - Auto-generate with drf-spectacular
8. **Versioning** - API versioning (e.g., `/api/v1/`)

---

## Contact

For issues or questions about this API, refer to the main README.md or check the code in `backend/tickets/views.py`.
