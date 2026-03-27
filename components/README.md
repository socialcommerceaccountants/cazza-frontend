# Cazza.ai Admin Dashboard Components

## Overview
This directory contains all UI components for the Cazza.ai admin dashboard. The components are built with:
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for base components
- **Lucide React** for icons

## Component Structure

### 1. Authentication Components (`/components/auth/`)
Components for user authentication flows:

- **`LoginForm.tsx`** - User login with email/password
  - Email and password fields
  - Show/hide password toggle
  - Remember me checkbox
  - Demo account button
  - Form validation
  - Responsive design

- **`RegisterForm.tsx`** - New user registration
  - Multi-field registration form
  - Password strength indicator
  - Terms acceptance
  - Marketing preferences
  - Form validation

- **`ForgotPasswordForm.tsx`** - Password recovery
  - Email input for reset link
  - Success state with instructions
  - Resend functionality
  - Security information

### 2. Client Management (`/components/clients/`)
Components for managing client relationships:

- **`ClientManagement.tsx`** - Comprehensive client management interface
  - Client table with search and filters
  - Status badges (active, inactive, pending)
  - Subscription tier indicators
  - Revenue tracking
  - Bulk actions
  - Quick stats dashboard
  - Responsive table design

### 3. Onboarding Flow (`/components/onboarding/`)
Components for new user onboarding:

- **`OnboardingWizard.tsx`** - Multi-step setup wizard
  - 5-step progressive onboarding
  - Company profile setup
  - Team configuration
  - Business goals selection
  - Integration connections
  - AI preferences
  - Progress tracking
  - Completion state

### 4. Dashboard Layout (`/components/dashboard/`)
Enhanced dashboard layout components:

- **`DashboardLayout.tsx`** - Main dashboard wrapper
  - Sidebar integration
  - Top navigation
  - Breadcrumb navigation
  - Quick actions panel
  - Responsive footer

- **`TopNav.tsx`** - Top navigation bar
  - Search functionality
  - Notifications dropdown
  - User menu
  - Theme toggle
  - Mobile responsive

- **`Breadcrumb.tsx`** - Navigation breadcrumbs
  - Hierarchical navigation
  - Home indicator
  - Responsive design

- **`QuickActions.tsx`** - Frequently used actions
  - Grid of common actions
  - Import/export buttons
  - Responsive grid layout

### 5. Settings Interface (`/components/settings/`)
Comprehensive settings management:

- **`SettingsPanel.tsx`** - Tabbed settings interface
  - Profile management
  - Notification preferences
  - Integration management
  - Appearance customization
  - Security settings
  - API access management
  - Data export/import

### 6. Design System (`/components/design-system/`)
Design system documentation and examples:

- **`DesignSystemShowcase.tsx`** - Interactive component showcase
  - Button variants and states
  - Form elements
  - Card layouts
  - Feedback components
  - Navigation patterns
  - Data display examples
  - Responsive design guidelines
  - Accessibility features

### 7. UI Components (`/components/ui/`)
Base UI components (extended from shadcn/ui):

- **`alert.tsx`** - Alert/notification components
- **`button.tsx`** - Button with loading states
- **`checkbox.tsx`** - Checkbox inputs
- **`progress.tsx`** - Progress indicators
- **`radio-group.tsx`** - Radio button groups
- **`table.tsx`** - Data tables
- **`tabs.tsx`** - Tabbed interfaces
- **`textarea.tsx`** - Multi-line text inputs

## Design Principles

### Responsive Design
- **Mobile First**: Components designed for mobile then enhanced for larger screens
- **Breakpoints**: 
  - `sm`: 640px (mobile)
  - `md`: 768px (tablet)
  - `lg`: 1024px (desktop)
- **Fluid Layouts**: Flexible grids and spacing

### Accessibility
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color ratios
- **Focus Management**: Clear focus states for all interactive elements
- **Reduced Motion**: Respects user motion preferences

### Consistency
- **Design Tokens**: Consistent use of Tailwind CSS classes
- **Component API**: Consistent prop naming and patterns
- **Spacing System**: 4px base unit system
- **Typography**: Consistent font sizes and weights

## Usage Examples

### Authentication Flow
```tsx
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
```

### Client Management
```tsx
import { ClientManagement } from "@/components/clients/ClientManagement";

export default function ClientsPage() {
  return <ClientManagement />;
}
```

### Onboarding Wizard
```tsx
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
```

### Dashboard Layout
```tsx
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Dashboard"
      description="Your AI business assistant"
      showBreadcrumb={true}
      showQuickActions={true}
    >
      {/* Page content */}
    </DashboardLayout>
  );
}
```

## Development Guidelines

### Adding New Components
1. Place components in appropriate category directories
2. Follow existing naming conventions
3. Include TypeScript interfaces
4. Add proper accessibility attributes
5. Test responsive behavior
6. Document component usage

### Styling Guidelines
1. Use Tailwind CSS utility classes
2. Follow design system tokens
3. Maintain consistent spacing (4px multiples)
4. Use semantic color classes
5. Implement dark mode support

### Testing
1. Test keyboard navigation
2. Verify screen reader compatibility
3. Check responsive breakpoints
4. Validate form inputs
5. Test loading and error states

## Component Dependencies

### Required Packages
- `@base-ui/react`: Base UI components
- `class-variance-authority`: Variant management
- `lucide-react`: Icons
- `next-themes`: Theme management
- `@radix-ui/react-*`: UI primitives

### Internal Dependencies
- `@/lib/utils`: Utility functions
- `@/components/ui/*`: Base UI components

## Performance Considerations

### Code Splitting
- Components are lazy-loaded where appropriate
- Large components split into smaller chunks
- Dynamic imports for heavy components

### Bundle Size
- Tree-shaking enabled
- Icon imports optimized
- Unused CSS purged

### Rendering Optimization
- Client components marked with "use client"
- Server components used where possible
- Memoization for expensive computations

## Future Enhancements

### Planned Features
1. **Advanced Filtering**: More sophisticated client filtering
2. **Bulk Operations**: Enhanced bulk editing capabilities
3. **Real-time Updates**: WebSocket integration for live data
4. **Offline Support**: Progressive web app capabilities
5. **Advanced Analytics**: More detailed reporting components

### Component Library
1. **Storybook Integration**: Component documentation
2. **Visual Testing**: Automated visual regression tests
3. **Design Tokens**: CSS custom properties for theming
4. **Component Playground**: Interactive component testing

## Support

For component-related issues:
1. Check the component documentation
2. Review existing usage examples
3. Test in isolation
4. Consult design system guidelines

For accessibility concerns:
1. Test with screen readers
2. Verify keyboard navigation
3. Check color contrast ratios
4. Validate ARIA attributes