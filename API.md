# 📖 ABK Screening - API Documentation

## Base URL

```
http://localhost:5000/api/v1
```

## Authentication

Semua endpoint (kecuali `/auth/*`) memerlukan JWT token di header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Authentication

#### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "guru@example.com",
  "password": "password123",
  "full_name": "Guru Budi",
  "school_name": "SDN 01 Jakarta"
}

Response 201:
{
  "message": "Registrasi berhasil",
  "user": {
    "id": "uuid",
    "email": "guru@example.com",
    "full_name": "Guru Budi"
  }
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "guru@example.com",
  "password": "password123"
}

Response 200:
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "guru@example.com",
    "full_name": "Guru Budi",
    "school_name": "SDN 01 Jakarta",
    "role": "guru"
  }
}
```

### 2. Students

#### Get All Students

```http
GET /students
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "teacher_id": "uuid",
    "full_name": "Andi Wijaya",
    "date_of_birth": "2015-05-20",
    "gender": "Laki-laki",
    "grade": "3A",
    "description": "Siswa berprestasi",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Student by ID

```http
GET /students/:id
Authorization: Bearer <token>

Response 200:
{
  "id": "uuid",
  "teacher_id": "uuid",
  "full_name": "Andi Wijaya",
  "date_of_birth": "2015-05-20",
  "gender": "Laki-laki",
  "grade": "3A",
  "description": "Siswa berprestasi",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Create Student

```http
POST /students
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Andi Wijaya",
  "date_of_birth": "2015-05-20",
  "gender": "Laki-laki",
  "grade": "3A",
  "description": "Siswa berprestasi"
}

Response 201:
{
  "id": "uuid",
  "teacher_id": "uuid",
  "full_name": "Andi Wijaya",
  "date_of_birth": "2015-05-20",
  "gender": "Laki-laki",
  "grade": "3A",
  "description": "Siswa berprestasi",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Update Student

```http
PUT /students/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Andi Wijaya",
  "grade": "3B"
}

Response 200:
{
  "id": "uuid",
  "teacher_id": "uuid",
  "full_name": "Andi Wijaya",
  "date_of_birth": "2015-05-20",
  "gender": "Laki-laki",
  "grade": "3B",
  "description": "Siswa berprestasi",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-16T14:20:00Z"
}
```

#### Delete Student

```http
DELETE /students/:id
Authorization: Bearer <token>

Response 200:
{
  "message": "Siswa berhasil dihapus"
}
```

### 3. Screening Sessions

#### Start Screening

```http
POST /screenings/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "student_id": "uuid",
  "category": "ADHD"
}

Response 201:
{
  "session": {
    "id": "uuid",
    "student_id": "uuid",
    "teacher_id": "uuid",
    "category": "ADHD",
    "status": "in_progress",
    "started_at": "2024-01-16T15:00:00Z",
    "completed_at": null,
    "created_at": "2024-01-16T15:00:00Z"
  },
  "firstQuestion": {
    "id": "uuid",
    "category": "ADHD",
    "question_text": "Apakah anak sering kesulitan memusatkan perhatian?",
    "question_type": "likert",
    "difficulty_level": 1
  }
}
```

#### Submit Answer

```http
POST /screenings/answer
Authorization: Bearer <token>
Content-Type: application/json

{
  "session_id": "uuid",
  "question_id": "uuid",
  "answer_id": "uuid"
}

Response 200:
{
  "message": "Jawaban tersimpan",
  "nextQuestion": {
    "id": "uuid",
    "category": "ADHD",
    "question_text": "Apakah anak mudah terganggu?",
    "question_type": "likert",
    "difficulty_level": 1
  }
}
```

#### Complete Screening

```http
POST /screenings/complete/:sessionId
Authorization: Bearer <token>

Response 200:
{
  "message": "Skrining selesai"
}
```

### 4. Results

#### Get Results by Session

```http
GET /results/session/:sessionId
Authorization: Bearer <token>

Response 200:
{
  "id": "uuid",
  "session_id": "uuid",
  "student_id": "uuid",
  "teacher_id": "uuid",
  "category": "ADHD",
  "total_score": 28,
  "max_score": 40,
  "percentage": 70.00,
  "confidence_level": 0.85,
  "initial_indication": "Kemungkinan ADHD",
  "severity_level": "Berat",
  "analysis_summary": "Berdasarkan observasi...",
  "teacher_recommendations": [...],
  "parent_recommendations": [...],
  "professional_consultation_needed": true,
  "created_at": "2024-01-16T15:30:00Z",
  "updated_at": "2024-01-16T15:30:00Z"
}
```

#### Get Results by Student

```http
GET /results/student/:studentId
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "uuid",
    "session_id": "uuid",
    "student_id": "uuid",
    "category": "ADHD",
    "total_score": 28,
    "percentage": 70.00,
    "initial_indication": "Kemungkinan ADHD",
    "severity_level": "Berat",
    "created_at": "2024-01-16T15:30:00Z"
  },
  {
    "id": "uuid",
    "session_id": "uuid",
    "student_id": "uuid",
    "category": "ASD",
    "total_score": 15,
    "percentage": 37.50,
    "initial_indication": "ASD tidak mungkin",
    "severity_level": "Ringan",
    "created_at": "2024-01-15T14:00:00Z"
  }
]
```

#### Generate Results

```http
POST /results/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "session_id": "uuid"
}

Response 200:
{
  "id": "uuid",
  "session_id": "uuid",
  "student_id": "uuid",
  "teacher_id": "uuid",
  "category": "ADHD",
  "total_score": 28,
  "max_score": 40,
  "percentage": 70.00,
  "confidence_level": 0.85,
  "initial_indication": "Kemungkinan ADHD",
  "severity_level": "Berat",
  "analysis_summary": "...",
  "teacher_recommendations": [...],
  "parent_recommendations": [...],
  "professional_consultation_needed": true,
  "created_at": "2024-01-16T15:30:00Z",
  "updated_at": "2024-01-16T15:30:00Z"
}
```

### 5. Users

#### Get User Profile

```http
GET /users/profile
Authorization: Bearer <token>

Response 200:
{
  "id": "uuid",
  "email": "guru@example.com",
  "full_name": "Guru Budi",
  "school_name": "SDN 01 Jakarta",
  "role": "guru",
  "created_at": "2024-01-15T10:30:00Z"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Email sudah terdaftar"
}
```

### 401 Unauthorized

```json
{
  "error": "Token tidak ditemukan"
}
```

### 403 Forbidden

```json
{
  "error": "Token tidak valid atau expired"
}
```

### 404 Not Found

```json
{
  "error": "Siswa tidak ditemukan"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "timestamp": "2024-01-16T15:30:00Z"
}
```

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 requests per window
- **Headers:**
  - `X-RateLimit-Limit: 100`
  - `X-RateLimit-Remaining: 95`
  - `X-RateLimit-Reset: 1705417800`

---

**For more information, visit [SETUP.md](./SETUP.md)**