# 🚀 ABK Screening - Streamlit Deployment Guide

Panduan lengkap untuk deploy aplikasi ABK Screening ke Streamlit Cloud (alternatif dari web app berbasis React).

## 📋 Mengapa Streamlit?

✅ **Mudah digunakan** - Tidak perlu expertise frontend
✅ **Deploy gratis** - Streamlit Cloud free tier
✅ **Maintenance minimal** - Streamlit mengelola hosting
✅ **Development cepat** - Ratusan baris kode jadi aplikasi
✅ **Real-time updates** - Hot reload otomatis
✅ **Data science focused** - Perfect untuk analysis & visualization

## 🔧 Setup Lokal Streamlit

### 1. Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Streamlit & dependencies
pip install streamlit pandas psycopg2-binary python-dotenv pyjwt bcrypt pillow reportlab
```

### 2. Buat Project Struktur

```
abk-screening-streamlit/
├── app.py                      # Main Streamlit app
��── pages/
│   ├── 01_Login.py
│   ├── 02_Dashboard.py
│   ├── 03_Students.py
│   ├── 04_Screening.py
│   └── 05_Results.py
├── utils/
│   ├── database.py
│   ├── auth.py
│   ├── analyzer.py
│   └── pdf_generator.py
├── data/
│   └── questions.py
├── requirements.txt
├── .env
├── .streamlit/
│   └── config.toml
├── .gitignore
└── README.md
```

### 3. Buat Main App (app.py)

```python
import streamlit as st
import os
from dotenv import load_dotenv
from utils.auth import check_login

load_dotenv()

# Configure Streamlit
st.set_page_config(
    page_title="ABK Screening",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1.5rem;
        border-radius: 0.5rem;
        text-align: center;
    }
    .success-box {
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
        padding: 1rem;
        border-radius: 0.5rem;
    }
    .warning-box {
        background-color: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
        padding: 1rem;
        border-radius: 0.5rem;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'authenticated' not in st.session_state:
    st.session_state.authenticated = False
if 'user' not in st.session_state:
    st.session_state.user = None

# Main header
st.markdown('<div class="main-header">🎓 ABK Screening</div>', unsafe_allow_html=True)
st.markdown('---')

# Check authentication
if not st.session_state.authenticated:
    st.info('Silakan login terlebih dahulu')
    st.stop()

# Sidebar Navigation
with st.sidebar:
    st.image('https://via.placeholder.com/150', width=150)
    st.write(f"👤 {st.session_state.user['full_name']}")
    st.write(f"📧 {st.session_state.user['email']}")
    st.write(f"🏫 {st.session_state.user.get('school_name', '-')}")
    
    if st.button('🚪 Logout', use_container_width=True):
        st.session_state.authenticated = False
        st.session_state.user = None
        st.rerun()

st.write("Gunakan menu di samping untuk navigasi.")
```

### 4. Buat Database Utils (utils/database.py)

```python
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    def __init__(self):
        self.connection = None
        self.connect()
    
    def connect(self):
        try:
            self.connection = psycopg2.connect(
                host=os.getenv('DB_HOST'),
                port=os.getenv('DB_PORT'),
                database=os.getenv('DB_NAME'),
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASSWORD')
            )
        except Exception as e:
            raise Exception(f"Database connection failed: {str(e)}")
    
    def query(self, sql, params=None):
        try:
            cursor = self.connection.cursor(cursor_factory=RealDictCursor)
            cursor.execute(sql, params)
            self.connection.commit()
            return cursor.fetchall()
        except Exception as e:
            self.connection.rollback()
            raise Exception(f"Query failed: {str(e)}")
    
    def execute(self, sql, params=None):
        try:
            cursor = self.connection.cursor()
            cursor.execute(sql, params)
            self.connection.commit()
            return cursor.lastrowid
        except Exception as e:
            self.connection.rollback()
            raise Exception(f"Execution failed: {str(e)}")
    
    def close(self):
        if self.connection:
            self.connection.close()

db = Database()
```

### 5. Buat Login Page (pages/01_Login.py)

```python
import streamlit as st
import bcrypt
from utils.database import db

st.set_page_config(page_title="Login", page_icon="🔐")

st.markdown('<div class="main-header">🔐 Login</div>', unsafe_allow_html=True)

col1, col2, col3 = st.columns([1, 2, 1])

with col2:
    st.write("")
    with st.form("login_form"):
        email = st.text_input("📧 Email", placeholder="guru@example.com")
        password = st.text_input("🔑 Password", type="password")
        
        submitted = st.form_submit_button("Login", use_container_width=True)
        
        if submitted:
            if not email or not password:
                st.error("Email dan password harus diisi!")
            else:
                try:
                    # Query user
                    result = db.query(
                        "SELECT * FROM users WHERE email = %s",
                        (email,)
                    )
                    
                    if not result:
                        st.error("Email atau password salah")
                    else:
                        user = result[0]
                        # Check password
                        if bcrypt.checkpw(
                            password.encode(),
                            user['password'].encode()
                        ):
                            st.session_state.authenticated = True
                            st.session_state.user = {
                                'id': str(user['id']),
                                'email': user['email'],
                                'full_name': user['full_name'],
                                'school_name': user['school_name']
                            }
                            st.success("Login berhasil!")
                            st.rerun()
                        else:
                            st.error("Email atau password salah")
                except Exception as e:
                    st.error(f"Error: {str(e)}")
    
    st.write("---")
    st.write("Belum punya akun? Hubungi admin untuk registrasi.")
```

### 6. Buat Dashboard Page (pages/02_Dashboard.py)

```python
import streamlit as st
from utils.database import db

st.set_page_config(page_title="Dashboard", page_icon="📊")

if not st.session_state.get('authenticated'):
    st.error("Silakan login terlebih dahulu")
    st.stop()

st.title("📊 Dashboard")

# Get statistics
try:
    # Total students
    students_result = db.query(
        "SELECT COUNT(*) as count FROM students WHERE teacher_id = %s",
        (st.session_state.user['id'],)
    )
    total_students = students_result[0]['count'] if students_result else 0
    
    # Total screenings
    screenings_result = db.query(
        "SELECT COUNT(*) as count FROM screening_sessions WHERE teacher_id = %s",
        (st.session_state.user['id'],)
    )
    total_screenings = screenings_result[0]['count'] if screenings_result else 0
    
    # Total results
    results_result = db.query(
        "SELECT COUNT(*) as count FROM screening_results WHERE teacher_id = %s",
        (st.session_state.user['id'],)
    )
    total_results = results_result[0]['count'] if results_result else 0
    
    # Metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("👥 Total Siswa", total_students)
    
    with col2:
        st.metric("📋 Skrining", total_screenings)
    
    with col3:
        st.metric("📊 Hasil", total_results)
    
    with col4:
        st.metric("📚 Kategori", 4)
    
    st.write("---")
    
    # Recent screenings
    st.subheader("📌 Skrining Terbaru")
    
    recent = db.query(
        """SELECT ss.*, s.full_name FROM screening_sessions ss
           JOIN students s ON ss.student_id = s.id
           WHERE ss.teacher_id = %s
           ORDER BY ss.started_at DESC LIMIT 5""",
        (st.session_state.user['id'],)
    )
    
    if recent:
        for item in recent:
            with st.expander(f"{item['full_name']} - {item['category']}"):
                st.write(f"Status: {item['status']}")
                st.write(f"Mulai: {item['started_at']}")
    else:
        st.info("Belum ada skrining")

except Exception as e:
    st.error(f"Error: {str(e)}")
```

### 7. Buat Screening Page (pages/04_Screening.py)

```python
import streamlit as st
from utils.database import db
from data.questions import QUESTIONS
from utils.analyzer import ScreeningAnalyzer
from uuid import uuid4

st.set_page_config(page_title="Screening", page_icon="📝")

if not st.session_state.get('authenticated'):
    st.error("Silakan login terlebih dahulu")
    st.stop()

st.title("📝 Mulai Skrining")

# Get students
try:
    students = db.query(
        "SELECT id, full_name FROM students WHERE teacher_id = %s ORDER BY full_name",
        (st.session_state.user['id'],)
    )
    
    if not students:
        st.warning("Belum ada siswa. Tambahkan siswa terlebih dahulu di halaman Students.")
        st.stop()
    
    student_options = {s['full_name']: str(s['id']) for s in students}
    
    col1, col2 = st.columns(2)
    
    with col1:
        selected_student_name = st.selectbox(
            "📚 Pilih Siswa",
            options=student_options.keys()
        )
        student_id = student_options[selected_student_name]
    
    with col2:
        category = st.selectbox(
            "📂 Pilih Kategori",
            options=["ADHD", "ASD", "Disleksia", "Gangguan Perilaku Emosional"]
        )
    
    if st.button("🚀 Mulai Skrining", use_container_width=True):
        # Create screening session
        session_id = str(uuid4())
        
        db.execute(
            """INSERT INTO screening_sessions 
               (id, student_id, teacher_id, category, status, started_at)
               VALUES (%s, %s, %s, %s, %s, NOW())""",
            (session_id, student_id, st.session_state.user['id'], category, 'in_progress')
        )
        
        st.session_state.session_id = session_id
        st.session_state.category = category
        st.session_state.responses = []
        st.session_state.current_question = 0
        st.success("Skrining dimulai!")
        st.rerun()
    
    # Display screening if started
    if 'session_id' in st.session_state:
        st.write("---")
        st.subheader(f"🎯 Skrining {st.session_state.category}")
        
        questions = QUESTIONS.get(st.session_state.category, [])
        current_idx = st.session_state.current_question
        
        if current_idx < len(questions):
            q = questions[current_idx]
            
            # Progress bar
            progress = (current_idx + 1) / len(questions)
            st.progress(progress)
            st.write(f"Pertanyaan {current_idx + 1} dari {len(questions)}")
            
            st.write("---")
            st.write(f"**{q['question']}**")
            if 'description' in q:
                st.write(f"*{q['description']}*")
            
            answer = st.radio(
                "Jawaban:",
                options=q['options'],
                key=f"q_{current_idx}"
            )
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                if st.button("⬅️ Sebelumnya") and current_idx > 0:
                    st.session_state.current_question -= 1
                    st.rerun()
            
            with col3:
                if current_idx < len(questions) - 1:
                    if st.button("➡️ Berikutnya"):
                        # Save response
                        st.session_state.responses.append({
                            'question': q['question'],
                            'answer': answer,
                            'value': q['options'].index(answer) + 1
                        })
                        st.session_state.current_question += 1
                        st.rerun()
                else:
                    if st.button("✅ Selesai Skrining"):
                        # Save response
                        st.session_state.responses.append({
                            'question': q['question'],
                            'answer': answer,
                            'value': q['options'].index(answer) + 1
                        })
                        
                        # Complete screening
                        db.execute(
                            """UPDATE screening_sessions 
                               SET status = %s, completed_at = NOW()
                               WHERE id = %s""",
                            ('completed', st.session_state.session_id)
                        )
                        
                        # Generate results
                        analyzer = ScreeningAnalyzer()
                        results = analyzer.analyze(
                            st.session_state.responses,
                            st.session_state.category
                        )
                        
                        # Save results
                        result_id = str(uuid4())
                        db.execute(
                            """INSERT INTO screening_results 
                               (id, session_id, student_id, teacher_id, category, total_score, 
                                max_score, percentage, confidence_level, initial_indication, 
                                severity_level, analysis_summary, teacher_recommendations, 
                                parent_recommendations, professional_consultation_needed)
                               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                            (result_id, st.session_state.session_id, student_id, 
                             st.session_state.user['id'], st.session_state.category,
                             results['total_score'], results['max_score'], 
                             results['percentage'], results['confidence_level'],
                             results['initial_indication'], results['severity_level'],
                             results['analysis_summary'],
                             str(results['teacher_recommendations']),
                             str(results['parent_recommendations']),
                             results['professional_consultation_needed'])
                        )
                        
                        st.success("Skrining selesai!")
                        st.session_state.result_id = result_id
                        st.rerun()

except Exception as e:
    st.error(f"Error: {str(e)}")
```

### 8. Buat Requirements.txt

```txt
streamlit==1.29.0
pandas==2.1.1
psycopg2-binary==2.9.9
python-dotenv==1.0.0
PyJWT==2.8.1
bcrypt==4.1.1
Pillow==10.1.0
reportlab==4.0.7
plotly==5.17.0
```

### 9. Buat .env File

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=abk_screening
DB_USER=postgres
DB_PASSWORD=your_password

# App Configuration
STREAMLIT_SERVER_PORT=8501
STREAMLIT_LOGGER_LEVEL=info
```

### 10. Buat .streamlit/config.toml

```toml
[theme]
primaryColor = "#1f77b4"
backgroundColor = "#ffffff"
secondaryBackgroundColor = "#f0f2f6"
textColor = "#262730"
font = "sans serif"

[client]
showErrorDetails = true

[logger]
level = "info"
```

## 🏃 Menjalankan Lokal

```bash
# Activate virtual environment
source venv/bin/activate

# Run Streamlit app
streamlit run app.py

# Atau jalankan dari direktori berbeda
streamlit run streamlit_app/app.py
```

Aplikasi akan berjalan di `http://localhost:8501`

## ☁️ Deploy ke Streamlit Cloud

### 1. Setup GitHub Repository

```bash
# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: Streamlit version"

# Add remote (sesuaikan dengan repo Anda)
git remote add origin https://github.com/your-username/abk-screening-streamlit.git

# Push to GitHub
git push -u origin main
```

### 2. Login ke Streamlit Cloud

1. Buka https://share.streamlit.io
2. Sign up/Login dengan GitHub account
3. Klik "New app"
4. Pilih repository: `abk-screening-streamlit`
5. Branch: `main`
6. Main file path: `app.py`
7. Klik "Deploy"

### 3. Setup Secrets (Environment Variables)

1. Di Streamlit Cloud dashboard
2. Pergi ke "Settings" → "Secrets"
3. Tambahkan secrets:

```
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=abk_screening
DB_USER=postgres
DB_PASSWORD=your_secure_password
```

### 4. Deploy dengan Custom Domain

1. Pergi ke "Settings"
2. "Custom domain" → tambahkan domain Anda
3. Configure DNS records sesuai instruksi

## 🔐 Production Setup

### Deploy Database

#### Option A: Heroku PostgreSQL

```bash
# Buat Heroku account
# Buat PostgreSQL instance melalui Heroku dashboard
# Copy connection string ke Streamlit Secrets
```

#### Option B: AWS RDS

```bash
# Create RDS instance melalui AWS Console
# Configure security groups untuk allow Streamlit Cloud IP
# Copy endpoint ke Streamlit Secrets
```

#### Option C: Railway.app

```bash
# Sign up di https://railway.app
# Create PostgreSQL service
# Copy connection URL ke Streamlit Secrets
```

### Deploy with Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8501

CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

```bash
# Build image
docker build -t abk-screening-streamlit .

# Run container
docker run -p 8501:8501 --env-file .env abk-screening-streamlit
```

## 📊 Performance Tips

1. **Caching dengan @st.cache_data**
```python
@st.cache_data
def get_students(teacher_id):
    return db.query(...)
```

2. **Session State untuk State Management**
```python
if 'counter' not in st.session_state:
    st.session_state.counter = 0
```

3. **Columns untuk Layout**
```python
col1, col2 = st.columns(2)
with col1:
    st.write("Left")
with col2:
    st.write("Right")
```

4. **Expander untuk Organize Content**
```python
with st.expander("Details"):
    st.write("Hidden content")
```

## 🐛 Troubleshooting

### "ModuleNotFoundError"
```bash
# Pastikan requirements.txt ter-push ke GitHub
# Streamlit akan auto install dari requirements.txt
```

### "Connection to database failed"
```bash
# Cek Streamlit Cloud Secrets
# Cek database firewall/security groups
# Pastikan database running
```

### "Page not found"
```bash
# Streamlit pages harus di folder 'pages/'
# File harus berformat "01_NamaPage.py"
# Nama file menentukan urutan page
```

## 📚 Struktur Lengkap

```
abk-screening-streamlit/
├── app.py                          # Main app
├── pages/
│   ├── 01_Login.py                # Login page
│   ├── 02_Dashboard.py            # Dashboard
│   ├── 03_Students.py             # Student management
│   ├── 04_Screening.py            # Screening interface
│   └── 05_Results.py              # Results & reports
├── utils/
│   ├── __init__.py
│   ├── database.py                # Database connection
│   ├── auth.py                    # Authentication logic
│   ├── analyzer.py                # Screening analysis
│   └── pdf_generator.py           # PDF export
├── data/
│   └── questions.py               # Question bank
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment template
├── .streamlit/
│   └── config.toml               # Streamlit config
├── Dockerfile                     # Docker image
├── docker-compose.yml            # Docker compose
├── .gitignore                    # Git ignore
├── README.md                     # Documentation
└── .github/
    └── workflows/
        └── deploy.yml            # CI/CD workflow
```

## ✅ Keuntungan Streamlit vs React

| Aspek | Streamlit | React |
|-------|-----------|-------|
| Setup | Sangat mudah | Kompleks |
| Deploy | Satu klik | Memerlukan setup |
| Maintenance | Minimal | Perlu monitoring |
| Cost | Gratis (Cloud) | Bayar hosting |
| Development | Cepat | Lebih lambat |
| Customization | Limited | Unlimited |
| Database integration | Easy | Perlu backend |
| Reporting | Built-in | Perlu library |

## 🎉 Kesimpulan

Streamlit adalah pilihan terbaik untuk:
- ✅ Rapid prototyping
- ✅ Data analysis apps
- ✅ Internal tools
- ✅ Minimal budget
- ✅ Quick deployment

Gunakan React jika Anda butuh:
- ✅ Complex UI
- ✅ High customization
- ✅ Multiple pages
- ✅ Mobile app

---

**Happy deploying! 🚀**