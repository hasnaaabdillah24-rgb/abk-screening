# 💻 ABK Screening - Development Guide

## Development Setup

### Prerequisites
- Node.js v16+
- PostgreSQL 12+
- Visual Studio Code (recommended)

### IDE Extensions (VS Code)

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Thunder Client atau REST Client (untuk testing API)

## Project Structure

### Backend

```
backend/
├── src/
│   ├── index.js              # Entry point
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── utils/                # Utility functions
│   └── database/             # Database setup
├── package.json
└── .env.example
```

### Frontend

```
frontend/
├── src/
│   ├── components/           # Reusable React components
│   ├── pages/                # Page-level components
│   ├── store/                # Zustand state management
│   ├── utils/                # Utility functions & API client
│   ├── data/                 # Static data (question bank)
│   ├── App.jsx               # Root component
│   └── main.jsx              # Entry point
├── index.html
├── vite.config.js
└── tailwind.config.js
```

## Coding Standards

### Backend (Node.js/Express)

1. **File Naming:**
   - Route files: `camelCase.js` (e.g., `auth.js`, `students.js`)
   - Utility files: `camelCase.js` (e.g., `screeningAnalyzer.js`)
   - Classes: `PascalCase.js`

2. **Code Style:**
   ```javascript
   // Use async/await instead of callbacks
   const result = await db.query('SELECT * FROM users');
   
   // Use const/let, never var
   const user = { name: 'Budi' };
   let counter = 0;
   
   // Use meaningful variable names
   const isTeacherAuthorized = checkAuthorization(req.user);
   ```

3. **Error Handling:**
   ```javascript
   try {
     const result = await db.query(sql);
     res.json(result.rows);
   } catch (error) {
     console.error('Error details:', error);
     res.status(500).json({ error: 'Internal server error' });
   }
   ```

4. **API Responses:**
   ```javascript
   // Success
   res.json({ message: 'Success', data: result });
   
   // Error
   res.status(400).json({ error: 'Detailed error message' });
   ```

### Frontend (React.js)

1. **Component Naming:**
   - Page components: `PascalCase.jsx` in `pages/`
   - UI components: `PascalCase.jsx` in `components/`
   - Hooks: `useCamelCase.js`

2. **Component Structure:**
   ```jsx
   import { useState, useEffect } from 'react';
   
   function MyComponent({ prop1, prop2 }) {
     const [state, setState] = useState(null);
     
     useEffect(() => {
       // Setup
       return () => {
         // Cleanup
       };
     }, [dependencies]);
     
     return (
       <div>
         {/* JSX */}
       </div>
     );
   }
   
   export default MyComponent;
   ```

3. **State Management (Zustand):**
   ```javascript
   import { create } from 'zustand';
   
   const useMyStore = create((set) => ({
     value: 0,
     setValue: (newValue) => set({ value: newValue }),
     increment: () => set((state) => ({ value: state.value + 1 })),
   }));
   
   export { useMyStore };
   ```

4. **API Calls:**
   ```javascript
   import { api } from '../utils/api';
   
   const response = await api.get('/endpoint');
   const data = response.data;
   ```

## Testing

### Backend Testing

```bash
cd backend

# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Frontend Testing

```bash
cd frontend

# Run tests
npm test

# Coverage
npm test -- --coverage
```

## Git Workflow

### Branch Naming

```
feature/description      - New feature
bugfix/description       - Bug fix
hotfix/description       - Urgent fix
refactor/description     - Code refactoring
```

### Commit Messages

```
feat: add new feature
fix: fix bug in component
refactor: improve code structure
docs: update documentation
test: add test cases
chore: update dependencies
```

### Example Workflow

```bash
# Create feature branch
git checkout -b feature/add-export-pdf

# Make changes
git add .
git commit -m "feat: add PDF export functionality"

# Push to remote
git push origin feature/add-export-pdf

# Create Pull Request on GitHub
# Wait for review and merge
```

## Common Tasks

### Adding a New API Endpoint

1. Create or update route file in `backend/src/routes/`
2. Implement the endpoint logic
3. Update `API.md` documentation
4. Test with Thunder Client or Postman

### Adding a New Page

1. Create component in `frontend/src/pages/NewPage.jsx`
2. Add route in `App.jsx`
3. Create navigation link if needed
4. Test the page

### Adding New Questions

1. Update `frontend/src/data/questionBank.js`
2. Make sure questions follow the existing format
3. Test the screening flow

### Deploying to Production

1. Test locally: `npm run dev` (both backend and frontend)
2. Run: `npm test` if tests exist
3. Push to main branch
4. CI/CD will automatically deploy
5. Verify deployment on production URL

## Debugging

### Backend Debugging

```javascript
// Add logs
console.log('Debug info:', variable);
console.error('Error:', error);

// VS Code Debugger
// Add launch.json in .vscode/
```

### Frontend Debugging

```javascript
// React DevTools
// Install React DevTools extension

// Console logs
console.log('Component rendered', props);

// Zustand DevTools
import { devtools } from 'zustand/middleware';
```

## Performance Optimization

### Backend

- Use connection pooling
- Add indexes to frequently queried columns
- Cache database results
- Use pagination for large datasets

### Frontend

- Code splitting with lazy loading
- Memoize expensive computations
- Optimize re-renders with React.memo
- Use production build for testing

## Security Best Practices

1. **Authentication:** Always validate JWT tokens
2. **Authorization:** Check user permissions before operations
3. **Input Validation:** Validate and sanitize all inputs
4. **SQL Injection:** Use parameterized queries
5. **XSS Prevention:** Sanitize output, use React's built-in protection
6. **CORS:** Configure properly for production
7. **Environment Variables:** Never commit sensitive data

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process: `lsof -i :5000` then `kill -9 <PID>` |
| Database connection failed | Check `.env` and PostgreSQL is running |
| Module not found | Run `npm install` again |
| CORS error | Check backend `CORS` configuration |
| Build failed | Check for TypeScript/ESLint errors |

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Happy coding! 🚀**