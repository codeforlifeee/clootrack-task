# 🎯 Clootrack Company - SDE Intern Interview Preparation Guide

**Company:** Clootrack  
**Location:** Bangalore, India (Remote-first company)  
**Domain:** AI-Powered Voice of Customer (VoC) Analytics  
**Prepared on:** March 1, 2026

---

## 📊 About Clootrack

### Company Overview
- **What they do:** AI Super Agent for Voice of Customer analytics that drives business outcomes
- **Technology:** Patented unsupervised AI/ML, NLP, GenAI (100+ billion OpenAI tokens processed)
- **Clients:** 150+ enterprises (TATA, Xiaomi, VIVO, HSBC, Deloitte, Wipro, Wagner, etc.)
- **Focus Areas:**
  - Customer Experience (CX) Analytics
  - Product feedback analysis
  - Contact center analytics
  - Competitive analysis
  - Sentiment analysis from unstructured data

### Tech Stack (Based on Domain)
- **AI/ML:** NLP, Unsupervised Learning, GenAI, LLMs (OpenAI GPT)
- **Backend:** Python, Django/Flask, Node.js
- **Data Processing:** Pandas, NumPy, Spark
- **Databases:** PostgreSQL, MongoDB, Elasticsearch
- **Cloud:** AWS, Microsoft Azure (Azure Marketplace presence)
- **Integrations:** 1000+ connectors (Salesforce, Zendesk, Tableau, Power BI)
- **Languages Supported:** 55+ languages

---

## 🎓 Interview Process (Typical for AI/Analytics Companies)

### Round 1: Online Assessment (OA)
**Duration:** 60-90 minutes  
**Topics:**
- 2-3 DSA coding problems (Easy to Medium)
- MCQs on CS fundamentals
- Python/JavaScript coding questions

### Round 2: Technical Interview 1
**Duration:** 45-60 minutes  
**Focus:**
- Data structures and algorithms
- Problem-solving approach
- Code optimization
- Time complexity analysis

### Round 3: Technical Interview 2 / Domain Round
**Duration:** 45-60 minutes  
**Focus:**
- Machine Learning basics
- NLP concepts (text processing, sentiment analysis)
- System design (for experienced candidates)
- API design
- Database queries

### Round 4: HR Round
**Duration:** 20-30 minutes  
**Focus:**
- Cultural fit
- Projects and internships
- Why Clootrack?
- Availability and expectations

---

## 💻 DSA Questions (Expected for SDE Intern Role)

### String Manipulation (Critical for NLP/Text Processing)

#### Q1: Count frequency of words in a text
```python
def word_frequency(text):
    """
    Count word frequency in customer feedback text
    Input: "good product good quality"
    Output: {"good": 2, "product": 1, "quality": 1}
    """
    words = text.lower().split()
    freq = {}
    for word in words:
        freq[word] = freq.get(word, 0) + 1
    return freq
```

**Follow-up:** What if you need to ignore stop words like "the", "is", "a"?

---

#### Q2: Find longest common substring
```python
def longest_common_substring(str1, str2):
    """
    Used in finding similar customer feedback
    Input: "customer service", "customer support"
    Output: "customer s"
    """
    m, n = len(str1), len(str2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    max_len = 0
    end_pos = 0
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i-1] == str2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
                if dp[i][j] > max_len:
                    max_len = dp[i][j]
                    end_pos = i
    
    return str1[end_pos - max_len:end_pos]
```

---

#### Q3: Remove duplicate words while preserving order
```python
def remove_duplicate_words(sentence):
    """
    Clean customer feedback text
    Input: "good product product very good"
    Output: "good product very"
    """
    words = sentence.split()
    seen = set()
    result = []
    for word in words:
        if word not in seen:
            result.append(word)
            seen.add(word)
    return " ".join(result)
```

---

#### Q4: Group anagrams (text analysis)
```python
def group_anagrams(words):
    """
    Group similar feedback patterns
    Input: ["listen", "silent", "enlist", "abc", "bca"]
    Output: [["listen", "silent", "enlist"], ["abc", "bca"]]
    """
    from collections import defaultdict
    groups = defaultdict(list)
    
    for word in words:
        key = ''.join(sorted(word))
        groups[key].append(word)
    
    return list(groups.values())
```

---

### Arrays and Hashing (Sentiment Scores, Analytics)

#### Q5: Find top K frequent elements
```python
def top_k_frequent(nums, k):
    """
    Find top K mentioned issues in customer feedback
    Input: [1,1,1,2,2,3], k=2
    Output: [1, 2]
    """
    from collections import Counter
    import heapq
    
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)
```

---

#### Q6: Group data by category
```python
def group_by_category(feedbacks):
    """
    Group customer feedbacks by category
    Input: [
        {"text": "...", "category": "billing"},
        {"text": "...", "category": "technical"},
        {"text": "...", "category": "billing"}
    ]
    Output: {"billing": [...], "technical": [...]}
    """
    from collections import defaultdict
    result = defaultdict(list)
    
    for feedback in feedbacks:
        result[feedback['category']].append(feedback)
    
    return dict(result)
```

---

#### Q7: Sliding window - Average sentiment over time
```python
def moving_average(scores, window_size):
    """
    Calculate moving average of sentiment scores
    Input: [1, 3, 5, 7, 9], window=3
    Output: [3.0, 5.0, 7.0]
    """
    if not scores or window_size > len(scores):
        return []
    
    result = []
    window_sum = sum(scores[:window_size])
    result.append(window_sum / window_size)
    
    for i in range(window_size, len(scores)):
        window_sum = window_sum - scores[i - window_size] + scores[i]
        result.append(window_sum / window_size)
    
    return result
```

---

### Trees and Graphs (Hierarchical Data, Relationships)

#### Q8: Build category tree
```python
class CategoryNode:
    def __init__(self, name):
        self.name = name
        self.children = []
        self.feedback_count = 0

def build_category_tree(data):
    """
    Build hierarchical category structure
    Electronics -> Mobile -> Samsung
    """
    root = CategoryNode("Root")
    # Implementation for building tree from flat data
    return root
```

---

#### Q9: Find path in category hierarchy
```python
def find_category_path(root, target):
    """
    Find path from root to specific category
    Input: root, "Samsung"
    Output: ["Electronics", "Mobile", "Samsung"]
    """
    def dfs(node, target, path):
        if node.name == target:
            return path + [node.name]
        
        for child in node.children:
            result = dfs(child, target, path + [node.name])
            if result:
                return result
        return None
    
    return dfs(root, target, [])
```

---

#### Q10: Merge overlapping intervals (time-based data)
```python
def merge_intervals(intervals):
    """
    Merge overlapping feedback time periods
    Input: [[1,3], [2,6], [8,10]]
    Output: [[1,6], [8,10]]
    """
    if not intervals:
        return []
    
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        if current[0] <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], current[1])
        else:
            merged.append(current)
    
    return merged
```

---

### Sorting and Searching (Data Analysis)

#### Q11: Find median of data stream
```python
import heapq

class MedianFinder:
    """
    Find median sentiment score in real-time
    """
    def __init__(self):
        self.small = []  # max heap
        self.large = []  # min heap
    
    def addNum(self, num):
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        
        if len(self.small) < len(self.large):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    
    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2.0
```

---

#### Q12: Binary search in sorted data
```python
def search_feedback_by_score(feedbacks, target_score):
    """
    Find feedback with specific sentiment score
    Input: sorted list of feedbacks by score
    """
    left, right = 0, len(feedbacks) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if feedbacks[mid]['score'] == target_score:
            return mid
        elif feedbacks[mid]['score'] < target_score:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

---

## 🤖 Machine Learning & NLP Questions

### ML Basics

#### Q1: What is supervised vs unsupervised learning?
**Answer:**
- **Supervised:** Learn from labeled data (e.g., sentiment classification with labeled reviews)
  - Examples: Classification, Regression
  - Clootrack use: Classifying feedback as positive/negative
  
- **Unsupervised:** Find patterns in unlabeled data (Clootrack's specialty!)
  - Examples: Clustering, Dimensionality Reduction
  - Clootrack use: Discovering hidden themes in customer feedback without predefined categories

---

#### Q2: Explain sentiment analysis.
**Answer:**
Process of determining emotional tone of text (positive, negative, neutral).

**Approaches:**
1. **Rule-based:** Keyword matching (simple, limited)
2. **ML-based:** Train classifier on labeled data
3. **Deep Learning:** Use BERT, GPT for context understanding
4. **Lexicon-based:** Use sentiment dictionaries

**Example:**
```python
# Simple sentiment analysis
def simple_sentiment(text):
    positive_words = {'good', 'great', 'excellent', 'amazing'}
    negative_words = {'bad', 'poor', 'terrible', 'awful'}
    
    words = text.lower().split()
    pos_count = sum(1 for w in words if w in positive_words)
    neg_count = sum(1 for w in words if w in negative_words)
    
    if pos_count > neg_count:
        return 'positive'
    elif neg_count > pos_count:
        return 'negative'
    return 'neutral'
```

---

#### Q3: What is NLP? Common NLP tasks?
**Answer:**
Natural Language Processing - enables computers to understand human language.

**Common Tasks:**
1. **Tokenization:** Break text into words/sentences
2. **POS Tagging:** Identify parts of speech
3. **NER:** Extract entities (names, locations)
4. **Sentiment Analysis:** Determine opinion
5. **Text Classification:** Categorize documents
6. **Text Summarization:** Generate summaries

**Relevance to Clootrack:**
- Process customer reviews, support tickets, social media
- Extract insights from unstructured feedback
- Categorize issues automatically

---

#### Q4: How do you handle imbalanced datasets?
**Answer:**
When one class has much more data than others.

**Techniques:**
1. **Oversampling:** Duplicate minority class (SMOTE)
2. **Undersampling:** Reduce majority class
3. **Class weights:** Penalize errors on minority class more
4. **Ensemble methods:** Use multiple models
5. **Anomaly detection:** Treat minority as anomaly

**Clootrack context:**
- Negative reviews might be fewer than positive
- Critical issues might be rare but important

---

#### Q5: What is TF-IDF?
**Answer:**
Term Frequency-Inverse Document Frequency - statistical measure of word importance.

**Formula:**
```
TF-IDF(word, doc) = TF(word, doc) × IDF(word)

TF = (word count in doc) / (total words in doc)
IDF = log(total documents / documents containing word)
```

**Use case:**
```python
from sklearn.feature_extraction.text import TfidfVectorizer

feedbacks = [
    "good product",
    "bad product",
    "excellent service"
]

vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(feedbacks)
print(vectorizer.get_feature_names_out())
print(tfidf_matrix.toarray())
```

**Clootrack use:** Identify important keywords in customer feedback

---

### NLP Specific

#### Q6: What is word embedding?
**Answer:**
Dense vector representation of words capturing semantic meaning.

**Types:**
1. **Word2Vec:** Skip-gram, CBOW
2. **GloVe:** Global vectors
3. **FastText:** Character-level
4. **Contextual:** BERT, ELMo (context-aware)

**Example:**
```python
# Using pre-trained embeddings
from gensim.models import Word2Vec

sentences = [["customer", "service", "good"], ["product", "quality", "bad"]]
model = Word2Vec(sentences, vector_size=100, window=5, min_count=1)

# Find similar words
similar = model.wv.most_similar("good")
# Output: [("excellent", 0.85), ("great", 0.82), ...]
```

---

#### Q7: How do you handle text preprocessing?
**Answer:**
```python
import re
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer

def preprocess_text(text):
    """
    Clean customer feedback text
    """
    # 1. Lowercase
    text = text.lower()
    
    # 2. Remove URLs, emails
    text = re.sub(r'http\S+|www\S+|https\S+', '', text)
    text = re.sub(r'\S+@\S+', '', text)
    
    # 3. Remove special characters
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # 4. Tokenize
    tokens = text.split()
    
    # 5. Remove stop words
    stop_words = set(stopwords.words('english'))
    tokens = [t for t in tokens if t not in stop_words]
    
    # 6. Lemmatization
    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(t) for t in tokens]
    
    return ' '.join(tokens)

# Example
text = "The product is really good! Visit https://example.com"
cleaned = preprocess_text(text)
# Output: "product really good"
```

---

#### Q8: What is named entity recognition (NER)?
**Answer:**
Extracting entities like names, locations, organizations from text.

**Example:**
```python
# Using spaCy
import spacy

nlp = spacy.load("en_core_web_sm")
text = "Apple Inc. is launching new iPhone in California"
doc = nlp(text)

for ent in doc.ents:
    print(f"{ent.text} - {ent.label_}")

# Output:
# Apple Inc. - ORG
# iPhone - PRODUCT
# California - GPE
```

**Clootrack use:**
- Extract product names from reviews
- Identify competitor mentions
- Detect location-specific issues

---

## 🗄️ Database & SQL Questions

### SQL Queries (Analytics Focused)

#### Q1: Find customer feedback by sentiment
```sql
-- Get all negative feedbacks from last 30 days
SELECT customer_id, feedback_text, sentiment_score, created_at
FROM customer_feedback
WHERE sentiment_score < 0.3
  AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY sentiment_score ASC
LIMIT 100;
```

---

#### Q2: Count feedbacks by category
```sql
-- Aggregation - count issues by category
SELECT 
    category,
    COUNT(*) as feedback_count,
    AVG(sentiment_score) as avg_sentiment,
    COUNT(CASE WHEN sentiment_score < 0.3 THEN 1 END) as negative_count
FROM customer_feedback
WHERE created_at >= '2026-01-01'
GROUP BY category
HAVING COUNT(*) > 10
ORDER BY negative_count DESC;
```

---

#### Q3: Find customers with multiple complaints
```sql
-- Join and aggregation
SELECT 
    c.customer_id,
    c.customer_name,
    COUNT(f.feedback_id) as complaint_count,
    MIN(f.created_at) as first_complaint,
    MAX(f.created_at) as last_complaint
FROM customers c
JOIN customer_feedback f ON c.customer_id = f.customer_id
WHERE f.sentiment_score < 0.3
GROUP BY c.customer_id, c.customer_name
HAVING COUNT(f.feedback_id) >= 3
ORDER BY complaint_count DESC;
```

---

#### Q4: Trend analysis - sentiment over time
```sql
-- Time series analysis
SELECT 
    DATE_TRUNC('day', created_at) as date,
    category,
    AVG(sentiment_score) as avg_sentiment,
    COUNT(*) as feedback_count
FROM customer_feedback
WHERE created_at >= NOW() - INTERVAL '90 days'
GROUP BY DATE_TRUNC('day', created_at), category
ORDER BY date, category;
```

---

#### Q5: Find duplicate/similar feedbacks
```sql
-- Detect duplicate customer complaints
SELECT 
    f1.feedback_id,
    f1.feedback_text,
    f2.feedback_id as similar_id,
    f2.feedback_text as similar_text
FROM customer_feedback f1
JOIN customer_feedback f2 
  ON f1.customer_id = f2.customer_id
  AND f1.feedback_id < f2.feedback_id
  AND f1.category = f2.category
  AND f1.created_at::date = f2.created_at::date;
```

---

#### Q6: Top products with most complaints
```sql
-- Product analysis
WITH product_stats AS (
    SELECT 
        product_id,
        COUNT(*) as total_feedback,
        SUM(CASE WHEN sentiment_score < 0.3 THEN 1 ELSE 0 END) as negative_count,
        AVG(sentiment_score) as avg_sentiment
    FROM customer_feedback
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY product_id
)
SELECT 
    p.product_name,
    ps.total_feedback,
    ps.negative_count,
    ps.avg_sentiment,
    ROUND(ps.negative_count::numeric / ps.total_feedback * 100, 2) as negative_percentage
FROM product_stats ps
JOIN products p ON ps.product_id = p.product_id
WHERE ps.total_feedback >= 10
ORDER BY negative_percentage DESC
LIMIT 20;
```

---

### NoSQL (MongoDB) Questions

#### Q7: Store customer feedback document
```javascript
// MongoDB document structure
{
    "_id": ObjectId("507f1f77bcf86cd799439011"),
    "customer_id": "CUST123",
    "feedback_text": "Great product, fast delivery",
    "sentiment_score": 0.85,
    "category": "delivery",
    "created_at": ISODate("2026-03-01T10:30:00Z"),
    "metadata": {
        "source": "email",
        "language": "en",
        "location": "Bangalore"
    },
    "keywords": ["great", "product", "fast", "delivery"],
    "entities": ["product", "delivery"]
}
```

---

#### Q8: Query MongoDB for analytics
```javascript
// Find negative feedbacks by category
db.customer_feedback.find({
    sentiment_score: { $lt: 0.3 },
    created_at: { $gte: ISODate("2026-02-01") },
    category: "product_quality"
}).sort({ sentiment_score: 1 }).limit(50);

// Aggregation pipeline
db.customer_feedback.aggregate([
    {
        $match: {
            created_at: { $gte: ISODate("2026-01-01") }
        }
    },
    {
        $group: {
            _id: "$category",
            avg_sentiment: { $avg: "$sentiment_score" },
            count: { $sum: 1 }
        }
    },
    {
        $sort: { avg_sentiment: 1 }
    }
]);
```

---

## 🌐 API & System Design Questions

### API Design

#### Q1: Design REST API for customer feedback system
**Answer:**
```
GET    /api/feedbacks                    - List all feedbacks (with filters)
GET    /api/feedbacks/{id}               - Get specific feedback
POST   /api/feedbacks                    - Submit new feedback
PATCH  /api/feedbacks/{id}               - Update feedback
DELETE /api/feedbacks/{id}               - Delete feedback

GET    /api/feedbacks/analytics          - Get analytics/stats
GET    /api/feedbacks/sentiment/{type}   - Filter by sentiment
GET    /api/feedbacks/category/{cat}     - Filter by category

GET    /api/customers/{id}/feedbacks     - Get customer's feedbacks
GET    /api/products/{id}/feedbacks      - Get product feedbacks
```

**Filters:**
```
/api/feedbacks?sentiment=negative&category=billing&from_date=2026-01-01&limit=50
```

---

#### Q2: Handle API rate limiting
**Answer:**
```python
from functools import wraps
from flask import request, jsonify
import redis

redis_client = redis.Redis()

def rate_limit(max_requests=100, window=3600):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            user_id = request.headers.get('User-ID', 'anonymous')
            key = f"rate_limit:{user_id}"
            
            count = redis_client.incr(key)
            if count == 1:
                redis_client.expire(key, window)
            
            if count > max_requests:
                return jsonify({
                    'error': 'Rate limit exceeded',
                    'retry_after': redis_client.ttl(key)
                }), 429
            
            return f(*args, **kwargs)
        return wrapped
    return decorator

@app.route('/api/feedbacks')
@rate_limit(max_requests=100, window=3600)
def get_feedbacks():
    # Implementation
    pass
```

---

### System Design (Basic Level for Intern)

#### Q3: Design a simple customer feedback collection system
**Answer:**

**Requirements:**
- Collect feedback from multiple channels (web, email, social media)
- Process and analyze sentiment
- Store and retrieve efficiently
- Display analytics dashboard

**Architecture:**
```
┌─────────────────────────┐
│   Frontend (React)      │
│   - Feedback form       │
│   - Dashboard           │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   API Gateway (Nginx)   │
│   - Rate limiting       │
│   - Load balancing      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Backend (Python)      │
│   - Django/Flask API    │
│   - Business logic      │
└───────────┬─────────────┘
            │
      ┌─────┴─────┐
      ▼           ▼
┌───────────┐ ┌───────────┐
│ PostgreSQL│ │  Redis    │
│ (Feedback)│ │  (Cache)  │
└───────────┘ └───────────┘
      │
      ▼
┌───────────────────────┐
│   ML Service          │
│   - Sentiment analysis│
│   - Text processing   │
└───────────────────────┘
```

**Database Schema:**
```sql
CREATE TABLE customer_feedback (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50),
    feedback_text TEXT NOT NULL,
    sentiment_score DECIMAL(3,2),
    category VARCHAR(50),
    source VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW(),
    processed BOOLEAN DEFAULT FALSE,
    metadata JSONB
);

CREATE INDEX idx_sentiment ON customer_feedback(sentiment_score);
CREATE INDEX idx_category ON customer_feedback(category);
CREATE INDEX idx_created_at ON customer_feedback(created_at);
```

---

#### Q4: How would you handle real-time sentiment analysis at scale?
**Answer:**

**Approach:**
```
Customer Feedback
      ↓
Message Queue (RabbitMQ/Kafka)
      ↓
Worker Processes (multiple)
   ↙  ↓  ↘
 W1  W2  W3  (parallel processing)
      ↓
  ML Model (sentiment analysis)
      ↓
Database + Cache
      ↓
WebSocket → Frontend (real-time update)
```

**Key strategies:**
1. **Async processing:** Don't block API response
2. **Queue system:** Handle traffic spikes
3. **Worker pool:** Process multiple feedbacks in parallel
4. **Caching:** Cache model results for similar text
5. **Batch processing:** Process multiple feedbacks together

**Code example:**
```python
# Celery task for async processing
from celery import Celery

celery_app = Celery('feedback_processor')

@celery_app.task
def process_feedback_async(feedback_id):
    feedback = Feedback.objects.get(id=feedback_id)
    
    # Sentiment analysis
    sentiment = sentiment_model.predict(feedback.text)
    
    # Update database
    feedback.sentiment_score = sentiment
    feedback.processed = True
    feedback.save()
    
    # Notify via websocket
    notify_client(feedback_id, sentiment)
```

---

## 🔧 Python Programming Questions

### Q1: Implement LRU Cache
```python
class LRUCache:
    """
    Cache for frequently accessed feedback or analysis results
    """
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.order = []
    
    def get(self, key):
        if key not in self.cache:
            return -1
        
        # Move to end (most recent)
        self.order.remove(key)
        self.order.append(key)
        return self.cache[key]
    
    def put(self, key, value):
        if key in self.cache:
            self.order.remove(key)
        elif len(self.cache) >= self.capacity:
            # Remove least recently used
            oldest = self.order.pop(0)
            del self.cache[oldest]
        
        self.cache[key] = value
        self.order.append(key)

# Usage
cache = LRUCache(3)
cache.put("feedback_123", {"sentiment": 0.85})
cache.put("feedback_456", {"sentiment": 0.45})
result = cache.get("feedback_123")
```

---

### Q2: Implement decorator for timing functions
```python
import time
from functools import wraps

def timing_decorator(func):
    """
    Measure execution time of ML model prediction
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timing_decorator
def analyze_sentiment(text):
    # Sentiment analysis logic
    time.sleep(0.1)  # Simulate processing
    return 0.85

# Usage
score = analyze_sentiment("Great product!")
# Output: analyze_sentiment took 0.1002 seconds
```

---

### Q3: Implement context manager for database connection
```python
class DatabaseConnection:
    """
    Manage database connections efficiently
    """
    def __init__(self, db_name):
        self.db_name = db_name
        self.connection = None
    
    def __enter__(self):
        import psycopg2
        self.connection = psycopg2.connect(
            host="localhost",
            database=self.db_name,
            user="user",
            password="pass"
        )
        return self.connection
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            self.connection.close()

# Usage
with DatabaseConnection("feedback_db") as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM customer_feedback LIMIT 10")
    results = cursor.fetchall()
# Connection automatically closed
```

---

### Q4: Implement async API calls
```python
import asyncio
import aiohttp

async def fetch_feedback(session, feedback_id):
    """
    Fetch feedback asynchronously
    """
    url = f"https://api.example.com/feedbacks/{feedback_id}"
    async with session.get(url) as response:
        return await response.json()

async def fetch_multiple_feedbacks(feedback_ids):
    """
    Fetch multiple feedbacks concurrently
    """
    async with aiohttp.ClientSession() as session:
        tasks = [
            fetch_feedback(session, fid) 
            for fid in feedback_ids
        ]
        results = await asyncio.gather(*tasks)
        return results

# Usage
feedback_ids = [1, 2, 3, 4, 5]
results = asyncio.run(fetch_multiple_feedbacks(feedback_ids))
```

---

## 💼 Clootrack-Specific Questions

### Q1: Why do you want to work at Clootrack?
**Sample Answer:**
"I'm excited about Clootrack because:
1. **AI/ML in Production:** You're using patented unsupervised AI to solve real business problems, processing 100+ billion OpenAI tokens
2. **Impact:** Your platform helps 150+ enterprises including TATA, HSBC, Xiaomi make data-driven decisions
3. **Technology:** Working with NLP, sentiment analysis, and large-scale data processing aligns with my interests
4. **Learning:** Being a remote-first company with cutting-edge technology, I'll learn from experienced engineers while contributing to real products
5. **Domain:** Customer experience analytics is crucial - every company needs to understand their customers better"

---

### Q2: How would you improve customer feedback analysis?
**Answer:**
1. **Multi-lingual support:** Feedback in regional languages
2. **Image/Video analysis:** Process screenshots, videos from customers
3. **Real-time alerts:** Notify when critical issues are detected
4. **Competitive benchmarking:** Compare with competitors' feedback
5. **Predictive analytics:** Predict potential issues before they escalate
6. **Contextual understanding:** Use conversation history for better context
7. **Emotion detection:** Beyond sentiment - detect frustration, delight, urgency

---

### Q3: Explain how you'd handle multilingual feedback.
**Answer:**
```python
from googletrans import Translator
from langdetect import detect

def process_multilingual_feedback(text):
    """
    Handle feedback in multiple languages
    """
    # 1. Detect language
    language = detect(text)
    print(f"Detected language: {language}")
    
    # 2. Translate to English if needed
    if language != 'en':
        translator = Translator()
        translation = translator.translate(text, dest='en')
        english_text = translation.text
    else:
        english_text = text
    
    # 3. Analyze sentiment on English text
    sentiment = analyze_sentiment(english_text)
    
    # 4. Store both original and translated
    return {
        'original_text': text,
        'original_language': language,
        'english_text': english_text,
        'sentiment': sentiment
    }

# Example
feedback = "यह उत्पाद बहुत अच्छा है"  # Hindi: "This product is very good"
result = process_multilingual_feedback(feedback)
```

---

### Q4: How do you handle sarcasm in sentiment analysis?
**Answer:**
Sarcasm is challenging! Examples: "Great! Another bug 🙄" (negative, not positive)

**Approaches:**
1. **Context clues:** Punctuation (!!, ...), emojis, ALL CAPS
2. **Contrast words:** "great" + "bug" together is suspicious
3. **Deep learning:** BERT, GPT can detect context better
4. **Training data:** Include sarcastic examples in training
5. **User history:** Person who usually complains saying "great" might be sarcastic

```python
def detect_sarcasm_indicators(text):
    indicators = {
        'excessive_punctuation': len(re.findall(r'[!?]{2,}', text)) > 0,
        'all_caps': text.isupper(),
        'negative_emoji': '🙄' in text or '😒' in text,
        'contrast_words': has_contrasting_words(text)
    }
    return indicators
```

---

### Q5: Design a duplicate feedback detection system.
**Answer:**

**Approach:**
1. **Text similarity:** Cosine similarity, Jaccard similarity
2. **Fuzzy matching:** Handle typos, slight variations
3. **Semantic similarity:** Word embeddings, sentence transformers
4. **Time window:** Same user within 24 hours
5. **Hash-based:** MinHash for fast duplicate detection

**Implementation:**
```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def find_duplicate_feedbacks(new_feedback, existing_feedbacks, threshold=0.85):
    """
    Find similar existing feedbacks
    """
    # Combine all texts
    all_texts = [new_feedback] + [f['text'] for f in existing_feedbacks]
    
    # Vectorize
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(all_texts)
    
    # Calculate similarity
    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])
    
    # Find duplicates
    duplicates = []
    for idx, sim in enumerate(similarities[0]):
        if sim >= threshold:
            duplicates.append({
                'feedback_id': existing_feedbacks[idx]['id'],
                'similarity': sim
            })
    
    return duplicates
```

---

## 🎤 HR Round Questions

### Q1: Tell me about yourself.
**Sample Answer:**
"I'm a [year] year computer science student at [college] with a strong passion for AI and data analytics. I've built projects involving NLP, sentiment analysis, and full-stack development. 

My recent project was a support ticket system using LLMs for automatic classification, which got me interested in how AI can process and understand human feedback at scale. 

I'm particularly excited about Clootrack because you're solving this problem for real enterprises, processing billions of customer interactions. I'm looking for an internship where I can apply my skills in Python, ML, and backend development while learning from experienced engineers in a production environment."

---

### Q2: What are your strengths?
**Sample Answer:**
"Three main strengths:
1. **Quick learner:** Picked up Django and React independently for my project
2. **Problem-solving:** Enjoy debugging complex issues and optimizing code
3. **Curiosity:** Always exploring new technologies - recently learning about transformer models and prompt engineering

For Clootrack, this means I can quickly adapt to your tech stack and contribute effectively."

---

### Q3: What's your biggest weakness?
**Sample Answer:**
"I sometimes get too focused on making code perfect and spend extra time on optimizations that might not be critical initially. 

I'm learning to balance - now I follow: make it work → make it right → make it fast. I've started setting time limits for tasks and seeking feedback earlier rather than perfecting in isolation.

For this internship, I'll focus on delivering working features first, then iterating based on team feedback."

---

### Q4: Where do you see yourself in 5 years?
**Sample Answer:**
"In 5 years, I see myself as a skilled machine learning engineer, contributing to production AI systems that impact millions of users.

Short-term (1-2 years): Master ML/NLP fundamentals, gain hands-on experience with real-world data

Mid-term (3-4 years): Work on complex problems like improving model accuracy, scaling systems

Long-term (5+ years): Lead technical projects, mentor junior engineers

Clootrack would be an excellent start - working with enterprise-scale customer data and production AI systems."

---

### Q5: Why should we hire you?
**Sample Answer:**
"Three reasons:
1. **Relevant skills:** Strong foundation in Python, ML/NLP, and building end-to-end systems
2. **Passion for the domain:** Genuinely interested in AI-powered analytics - I've built similar projects
3. **Quick contributor:** I can ramp up quickly with your tech stack and start adding value

Plus, I'm excited about your remote-first culture and the opportunity to work with cutting-edge AI on real business problems that affect major enterprises."

---

### Q6: Do you have any questions for us?
**Great Questions to Ask:**

**Technical:**
1. "What's the tech stack for the team I'd be joining?"
2. "What does the ML pipeline look like - from data ingestion to model deployment?"
3. "How do you handle model versioning and experimentation?"

**Culture:**
4. "What does success look like for an intern in the first 3 months?"
5. "How is knowledge sharing done in a remote-first environment?"
6. "What opportunities are there for learning - mentorship, courses, conferences?"

**Company:**
7. "What are the biggest technical challenges Clootrack is solving right now?"
8. "How is the internship structured - dedicated project or contribute to ongoing work?"
9. "Is there potential for conversion to full-time after the internship?"

---

## 📚 Preparation Checklist

### Week Before Interview

**Day 1-2: DSA Practice**
- [ ] 10 string problems (crucial for NLP domain)
- [ ] 5 array/hashing problems
- [ ] 3 tree/graph problems

**Day 3: ML/NLP Concepts**
- [ ] Review supervised vs unsupervised learning
- [ ] Sentiment analysis approaches
- [ ] Text preprocessing techniques
- [ ] Basic NLP tasks

**Day 4: SQL & Databases**
- [ ] Practice aggregation queries
- [ ] Joins and subqueries
- [ ] Time-series analysis queries
- [ ] MongoDB basics

**Day 5: System Design Basics**
- [ ] Design customer feedback system
- [ ] API design principles
- [ ] Caching strategies
- [ ] Async processing

**Day 6: Python & Coding**
- [ ] Practice live coding on HackerRank/LeetCode
- [ ] Review decorators, context managers
- [ ] Async programming basics

**Day 7: Mock Interviews**
- [ ] Practice explaining solutions out loud
- [ ] Time yourself (45 min per problem)
- [ ] Prepare questions for interviewer

---

### Day of Interview

**Before:**
- [ ] Test internet and backup connection
- [ ] Test camera and microphone
- [ ] Have water nearby
- [ ] Keep notebook and pen ready
- [ ] Have your projects/resume open in tabs
- [ ] Review Clootrack website

**During:**
- [ ] Ask clarifying questions
- [ ] Think out loud (explain your approach)
- [ ] Start with brute force, then optimize
- [ ] Test your code with examples
- [ ] Mention edge cases

**After:**
- [ ] Send thank you email
- [ ] Note down questions asked
- [ ] Follow up after 1 week if no response

---

## 🎯 Key Points to Remember

### About Clootrack
✅ AI-powered VoC analytics platform  
✅ 150+ enterprise clients (TATA, HSBC, Xiaomi)  
✅ Patented unsupervised AI - 98% accuracy  
✅ 100+ billion OpenAI tokens processed  
✅ 1000+ integrations (Salesforce, Zendesk, etc.)  
✅ 55+ languages supported  
✅ Remote-first company culture  
✅ Microsoft Azure Marketplace presence  

### Your Strengths for This Role
✅ Built AI-powered support ticket system  
✅ Experience with Django, React, PostgreSQL  
✅ Understanding of LLM integration  
✅ Knowledge of NLP concepts  
✅ Full-stack development skills  
✅ Passion for AI/ML and data analytics  

---

## 🚀 Final Tips

1. **For Coding Questions:**
   - Always clarify inputs/outputs first
   - Start with brute force approach
   - Mention time/space complexity
   - Test with edge cases
   - Write clean, readable code

2. **For ML Questions:**
   - Relate to Clootrack's domain (customer feedback)
   - Mention real-world challenges
   - Show awareness of production concerns

3. **For Behavioral Questions:**
   - Use STAR method (Situation, Task, Action, Result)
   - Be specific with examples from projects
   - Show enthusiasm and curiosity

4. **General:**
   - Be honest if you don't know something
   - Show willingness to learn
   - Ask thoughtful questions
   - Follow up after interview

---

## 📖 Recommended Resources

**DSA Practice:**
- LeetCode: String, Array, Hash Table sections
- HackerRank: Problem Solving track
- GeeksforGeeks: Company-specific questions

**ML/NLP:**
- Coursera: NLP Specialization (first 2 weeks)
- Kaggle: Sentiment analysis tutorials
- Medium: "NLP for Beginners" articles

**System Design:**
- "Grokking the System Design Interview"
- YouTube: System Design Interview channel
- "Designing Data-Intensive Applications" (first 3 chapters)

**Company Research:**
- Clootrack website and blog
- LinkedIn: Follow company and employees
- G2/Gartner reviews of Clootrack

---

## 🎉 You've Got This!

Remember:
- You've built a relevant project (support ticket system with AI)
- You have the technical skills they need
- Show genuine interest in their problem domain
- Be yourself and let your passion show

**Good luck! 🚀**

---

**Last Updated:** March 1, 2026  
**Prepared for:** SDE Intern Role at Clootrack  
**Contact:** For any clarifications, review your project and be ready to discuss it in detail!
