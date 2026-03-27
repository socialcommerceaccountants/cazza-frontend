# Cazza.ai Frontend

A modern Next.js 14 dashboard application for Cazza.ai - an AI-powered business assistant platform.

## 🚀 Features

- **Next.js 14** with TypeScript for type safety
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** component library for consistent UI
- **Dark/Light mode** toggle with system preference
- **Dashboard layout** with collapsible sidebar
- **Dynamic module cards** based on connected platforms
- **AI Chatbot interface** placeholder for future integration
- **Xero integration** settings page
- **Responsive design** for all screen sizes
- **Comprehensive testing** with Playwright
- **World-class code quality** with automated CI/CD pipeline

## 📋 Code Quality & Security

### Automated Code Review System
- **ESLint** with strict TypeScript rules
- **Prettier** for consistent code formatting
- **TypeScript** strict type checking
- **Security scanning** with Gitleaks
- **Dependency vulnerability** scanning
- **CodeQL** analysis for security vulnerabilities

### CI/CD Pipeline
- Automated testing on every push/PR
- Type checking and linting
- Security audits
- Build verification
- Playwright E2E tests
- Preview deployments for PRs
- Production deployments from main branch

## 🏗️ Project Structure

```
cazza-frontend/
├── .github/               # GitHub workflows and templates
│   ├── workflows/        # CI/CD pipelines
│   └── ISSUE_TEMPLATE/   # Issue templates
├── app/                  # Next.js app router pages
│   ├── layout.tsx       # Root layout with sidebar
│   ├── page.tsx         # Dashboard home page
│   └── settings/        # Settings pages
│       └── page.tsx     # Settings with Xero integration
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── sidebar.tsx     # Main sidebar navigation
│   ├── dashboard-header.tsx
│   ├── module-grid.tsx # Platform modules
│   ├── chatbot-interface.tsx
│   ├── stats-overview.tsx
│   └── recent-activity.tsx
├── lib/                 # Utility functions
│   └── utils.ts        # shadcn utilities
├── public/             # Static assets
├── tests/              # Playwright E2E tests
└── *.config.*          # Configuration files
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## 🎨 Design Principles

Follows Midday.ai's minimalist, clean, modern aesthetic:
- **Generous whitespace** for readability
- **Clean typography** with system fonts
- **Subtle animations** for smooth interactions
- **Consistent spacing** using Tailwind's spacing scale
- **Accessible color palette** with proper contrast ratios

## 🔧 Key Components

### Sidebar
- Collapsible navigation with smooth transitions
- Connected platforms status with real-time indicators
- User profile management and theme toggle
- Quick stats overview for at-a-glance insights

### Dashboard
- Module grid with platform connection management
- Performance metrics with visualizations
- AI chatbot interface for natural language interaction
- Recent activity feed with timestamped events

### Settings
- Platform integrations management (Xero, QuickBooks, etc.)
- Connection details and status monitoring
- Account preferences and notification settings
- Security and privacy controls

## 🛡️ Security Features

- **Input validation** on all user inputs
- **XSS protection** through proper sanitization
- **CSRF protection** for form submissions
- **Secure authentication** patterns
- **Environment variable** management
- **Dependency vulnerability** monitoring
- **Secret detection** in CI/CD pipeline

## 📊 Performance Optimizations

- **Code splitting** with dynamic imports
- **Image optimization** with Next.js Image component
- **Font optimization** with next/font
- **Bundle analysis** for size optimization
- **Lazy loading** for non-critical components
- **Caching strategies** for API responses

## 🧪 Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Utility function testing
- Hook testing with custom test utilities

### Integration Tests
- Page component testing
- API route testing
- Authentication flow testing

### E2E Tests
- User journey testing with Playwright
- Cross-browser compatibility testing
- Mobile responsiveness testing
- Accessibility testing

## 🔄 CI/CD Pipeline

### Quality Checks (Run on every PR)
- TypeScript compilation
- ESLint with strict rules
- Prettier formatting check
- Security audit with npm audit
- Secret detection with Gitleaks
- CodeQL security analysis

### Build & Test (Run after quality checks)
- Application build verification
- Unit test execution
- Integration test execution
- E2E test execution with Playwright

### Deployment
- **Preview deployments** for every PR
- **Production deployments** from main branch
- **Rollback capabilities** for quick recovery
- **Health checks** for deployment verification

## 👥 Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Maintenance tasks

## 🐛 Reporting Issues

Please use our [Issue Templates](.github/ISSUE_TEMPLATE/) for:
- 🐛 Bug reports
- ✨ Feature requests
- 📚 Documentation improvements

## 🔒 Security

Please report security vulnerabilities via email to security@cazza.ai. See our [Security Policy](SECURITY.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Playwright](https://playwright.dev/) - E2E testing
- [Midday.ai](https://midday.ai/) - Design inspiration