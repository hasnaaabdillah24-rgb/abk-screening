#!/bin/bash

# ABK Screening - Quick Start Script
# Memudahkan setup awal aplikasi

echo "🚀 ABK Screening - Quick Setup"
echo "================================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak terinstall. Silakan install dari https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL tidak terinstall. Silakan install dari https://www.postgresql.org/"
    exit 1
fi
echo "✅ PostgreSQL: $(psql --version)"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your database credentials"
fi

echo "📥 Installing dependencies..."
npm install

echo "🗄️  Running database migrations..."
npm run migrate

echo "✅ Backend setup complete!"

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend

echo "📥 Installing dependencies..."
npm install

echo "✅ Frontend setup complete!"

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Backend:  cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Application URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Backend:  http://localhost:5000"
echo ""
echo "Default test account:"
echo "- Email:    guru@example.com"
echo "- Password: password123"
echo ""
echo "For more info, see SETUP.md"
