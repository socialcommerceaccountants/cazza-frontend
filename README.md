# Cazza.ai Frontend

A modern Next.js 14 dashboard application for Cazza.ai - an AI-powered business assistant platform.

## Features

- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Dark/Light mode** toggle
- **Dashboard layout** with collapsible sidebar
- **Dynamic module cards** based on connected platforms
- **AI Chatbot interface** placeholder
- **Xero integration** settings page
- **Responsive design** for all screen sizes

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
cazza-frontend/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with sidebar
│   ├── page.tsx           # Dashboard home page
│   └── settings/          # Settings pages
│       └── page.tsx       # Settings with Xero integration
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── sidebar.tsx       # Main sidebar navigation
│   ├── dashboard-header.tsx
│   ├── module-grid.tsx   # Platform modules
│   ├── chatbot-interface.tsx
│   ├── stats-overview.tsx
│   ├── recent-activity.tsx
│   └── theme-provider.tsx
├── lib/                   # Utility functions
│   └── utils.ts          # shadcn utilities
└── public/               # Static assets
```

## Design Principles

Follows Midday.ai's minimalist, clean, modern aesthetic:
- Generous whitespace
- Clean typography
- Subtle animations
- Consistent spacing
- Accessible color palette

## Key Components

### Sidebar
- Collapsible navigation
- Connected platforms status
- User profile and theme toggle
- Quick stats overview

### Dashboard
- Module grid with platform connections
- Performance metrics
- AI chatbot interface
- Recent activity feed

### Settings
- Platform integrations management
- Xero connection details
- Account preferences
- Notification settings

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **next-themes** - Dark/light mode
- **lucide-react** - Icons

## License

MIT