# Contributing to MovieMania

First off, thank you for considering contributing to MovieMania! 🎬 It's people like you that make MovieMania such a great tool for entertainment lovers.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to uphold this standard. Please be respectful, constructive, and considerate in all interactions.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MongoDB** - [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) or local installation
- **Git** - [Download here](https://git-scm.com/)
- **TMDB API Key** - [Get one here](https://www.themoviedb.org/settings/api) (free)

### Fork and Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/moviemania.git
   cd moviemania
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/moviemania.git
   ```

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting a bug, include:**
- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior vs actual behavior
- Screenshots (if applicable)
- Your environment (OS, browser, Node.js version)

### 💡 Suggesting Features

We love feature suggestions! Please:
- Check if the feature already exists or has been requested
- Provide a clear description of the feature
- Explain why this feature would be useful
- Include mockups or examples if possible

### 🔧 Pull Requests

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Development Setup

### Installation

```bash
# Install all dependencies (root, client, and server)
npm run install:all

# Copy environment file
cp server/.env.example server/.env
# Edit server/.env with your API keys
```

### Running the Application

```bash
# Run both frontend and backend in development mode
npm run dev

# Or run them separately:
npm run server   # Backend only (port 5000)
npm run client   # Frontend only (port 5173)
```

### Project Structure

```
MovieMania/
├── client/          # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # React contexts
│   │   └── services/     # API service functions
│   └── ...
├── server/          # Express.js backend
│   ├── src/
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   └── services/     # Business logic
│   └── ...
└── package.json     # Root package with scripts
```

## Style Guidelines

### JavaScript/React

- Use **ES6+** syntax
- Use **functional components** with hooks
- Follow existing code patterns and conventions
- Use **meaningful variable names**
- Add comments for complex logic

### CSS (Tailwind)

- Use Tailwind utility classes
- Follow the existing design system
- Ensure responsive design (mobile-first approach)
- Test on multiple screen sizes

### Backend

- Follow RESTful API conventions
- Validate all inputs
- Handle errors gracefully
- Add appropriate status codes

## Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(tv): add episode rating feature
fix(auth): resolve token refresh issue
docs(readme): update installation steps
```

## Pull Request Process

1. **Ensure your code follows the style guidelines**
2. **Update documentation** if needed
3. **Test your changes** thoroughly
4. **Write a clear PR description** explaining:
   - What changes were made
   - Why these changes were necessary
   - Any breaking changes
5. **Link related issues** using keywords (e.g., "Fixes #123")
6. **Request a review** from maintainers
7. **Address feedback** promptly and respectfully

### PR Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have tested my changes locally
- [ ] I have updated documentation as needed
- [ ] My changes don't break existing functionality
- [ ] I have added comments for complex code

## 🎉 Recognition

Contributors will be recognized in our README and releases. Thank you for helping make MovieMania better!

---

**Questions?** Feel free to open an issue or reach out to the maintainers.

Happy coding! 🎬✨
