# Contributing to Cazza.ai Frontend

Thank you for your interest in contributing to Cazza.ai! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+
- Git

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/cazza-frontend.git
   cd cazza-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Creating a Pull Request

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Write tests
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example: `feat: add user authentication`

## Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Define types/interfaces for all props
- Avoid `any` type
- Use meaningful type names

### React/Next.js
- Use functional components with hooks
- Follow React best practices
- Use Next.js App Router patterns
- Implement proper error boundaries

### Styling
- Use Tailwind CSS utility classes
- Follow design system tokens
- Ensure responsive design
- Maintain accessibility (a11y)

### File Structure
```
app/
  layout.tsx
  page.tsx
  [route]/
    page.tsx
    layout.tsx
components/
  ui/          # Reusable UI components
  features/    # Feature-specific components
lib/          # Utilities, hooks, API clients
types/        # TypeScript definitions
public/       # Static assets
```

## Testing

### Running Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### Test Coverage
- Aim for >80% test coverage
- Write unit tests for utilities
- Write integration tests for components
- Write E2E tests for critical user flows

## Code Review Process

1. **Automated Checks**
   - CI pipeline runs on all PRs
   - Must pass all checks before review

2. **Review Criteria**
   - Code quality and readability
   - Test coverage
   - Security considerations
   - Performance impact
   - Documentation updates

3. **Reviewers**
   - At least one approved review required
   - Address all review comments
   - Keep discussions constructive

## Documentation

### Updating Documentation
- Update README.md for major changes
- Document new features
- Update API documentation
- Add code comments for complex logic

### Writing Documentation
- Use clear, concise language
- Include code examples
- Update when APIs change
- Keep documentation in sync with code

## Security

### Reporting Vulnerabilities
See [SECURITY.md](SECURITY.md) for vulnerability reporting.

### Security Guidelines
- Never commit secrets or API keys
- Validate all user input
- Use parameterized queries
- Implement proper authentication/authorization
- Keep dependencies updated

## Getting Help

- Check existing documentation
- Search existing issues
- Join our community discussions
- Ask for help in PR reviews

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Recognized for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

Thank you for contributing to Cazza.ai! 🚀