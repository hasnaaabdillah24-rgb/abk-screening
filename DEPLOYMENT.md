# 🌐 ABK Screening - Deployment Guide

Panduan untuk mendeploy aplikasi ABK Screening ke production.

## 🚀 Deployment Options

### Option 1: Heroku (Recommended untuk testing)

#### Backend Deployment

```bash
# Login ke Heroku
heroku login

# Buat app baru
heroku create abk-screening-backend

# Setup PostgreSQL add-on
heroku addons:create heroku-postgresql:hobby-dev -a abk-screening-backend

# Set environment variables
heroku config:set JWT_SECRET=your_jwt_secret_here -a abk-screening-backend
heroku config:set NODE_ENV=production -a abk-screening-backend

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate -a abk-screening-backend
```

#### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variable untuk API URL
vercel env add VITE_API_URL=https://abk-screening-backend.herokuapp.com/api/v1
```

### Option 2: Docker + Docker Compose

#### 1. Create Dockerfile Backend

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 5000
CMD ["node", "src/index.js"]
```

#### 2. Create Dockerfile Frontend

```dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: abk_screening
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: abk_screening
      DB_USER: postgres
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      CLIENT_URL: http://localhost:3000
    ports:
      - "5000:5000"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend/src:/app/src

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      VITE_API_URL: http://localhost:5000/api/v1
    depends_on:
      - backend

volumes:
  postgres_data:
```

#### 4. Run dengan Docker Compose

```bash
# Create .env file
echo "DB_PASSWORD=your_secure_password" > .env
echo "JWT_SECRET=your_jwt_secret_here" >> .env

# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: AWS EC2 + RDS

#### 1. Setup RDS PostgreSQL

```bash
# Via AWS Console:
# - RDS > Create Database
# - Engine: PostgreSQL 15
# - DB Instance: db.t3.micro (free tier)
# - Storage: 20GB (free tier)
# - Set Master Username dan Password
# - Enable Public Accessibility: Yes (for testing)
```

#### 2. Setup EC2 Instance

```bash
# SSH ke EC2
ssh -i your-key.pem ec2-user@your-instance-ip

# Update system
sudo yum update -y

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install Git
sudo yum install -y git

# Clone repository
git clone https://github.com/your-username/abk-screening.git
cd abk-screening/backend

# Setup environment
cp .env.example .env
# Edit .env dengan RDS endpoint

# Install dan run
npm install
npm run migrate
npm start
```

#### 3. Setup PM2 untuk Auto-restart

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start app with PM2
pm2 start src/index.js --name "abk-screening-api"

# Enable startup
pm2 startup
pm2 save

# Monitor
pm2 logs abk-screening-api
```

## 🔒 Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Setup database backups
- [ ] Configure rate limiting
- [ ] Setup logging and monitoring
- [ ] Enable CORS properly (whitelist domains)
- [ ] Use environment variables for sensitive data
- [ ] Setup database connection pooling
- [ ] Enable database encryption
- [ ] Setup CI/CD pipeline
- [ ] Regular security audits

## 📊 Monitoring

### Application Logs

```bash
# PM2 logs
pm2 logs

# Docker logs
docker-compose logs -f backend
```

### Database Monitoring

```bash
# Connect to production database
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d abk_screening

# Check connections
SELECT datname, usename, count(*) FROM pg_stat_activity GROUP BY datname, usename;
```

## 🔄 Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install backend dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run tests
        run: |
          cd backend
          npm test
      
      - name: Deploy to Heroku
        run: |
          git remote add heroku https://git.heroku.com/abk-screening-backend.git
          git push heroku main
```

## 🆘 Troubleshooting Production

### Database Connection Issues

```bash
# Check connection
psql -h localhost -U postgres -d abk_screening -c "SELECT 1"

# Check connection limit
SHOW max_connections;
```

### Out of Memory

```bash
# Increase Node.js memory
node --max-old-space-size=2048 src/index.js
```

### Slow Queries

```sql
-- Enable query logging
ALTER DATABASE abk_screening SET log_min_duration_statement = 1000;

-- Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM screening_results WHERE percentage > 60;
```

---

**For more help, check the [SETUP.md](./SETUP.md) guide.**