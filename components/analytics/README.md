# Analytics Dashboard Components

A comprehensive set of React components for building world-class analytics dashboards with real-time data visualization, interactive charts, and advanced business metrics.

## Components

### 1. RevenueChart
Interactive revenue trends visualization with line/bar charts, export functionality, and performance metrics.

**Features:**
- Line and bar chart views
- Revenue, expenses, and profit tracking
- CSV/PNG export
- Real-time data updates
- Responsive design
- Dark/light theme support

**Usage:**
```tsx
import RevenueChart from '@/components/analytics/RevenueChart';

<RevenueChart 
  timeRange="30d"
  data={revenueData}
/>
```

### 2. CACCalculator
Customer Acquisition Cost calculator with multi-channel analysis and ROI calculations.

**Features:**
- Multi-channel CAC comparison
- Interactive data editing
- LTV:CAC ratio analysis
- ROI calculations
- Add/remove channels
- Export functionality

**Usage:**
```tsx
import CACCalculator from '@/components/analytics/CACCalculator';

<CACCalculator 
  initialData={cacData}
/>
```

### 3. ROIAnalysis
Return on Investment analysis with risk assessment, projections, and multi-dimensional visualization.

**Features:**
- Investment category breakdown
- Risk assessment (low/medium/high)
- ROI projections
- Radar chart for multi-dimensional analysis
- Payback period calculation
- Investment recommendations

**Usage:**
```tsx
import ROIAnalysis from '@/components/analytics/ROIAnalysis';

<ROIAnalysis />
```

### 4. PlatformPerformance
Multi-platform comparison dashboard for e-commerce and SaaS platforms.

**Features:**
- Platform comparison (Shopify, Amazon, Etsy, etc.)
- Revenue, users, conversion metrics
- Interactive filtering
- Time series analysis
- Efficiency metrics (LTV:CAC, ROI)
- Responsive design

**Usage:**
```tsx
import PlatformPerformance from '@/components/analytics/PlatformPerformance';

<PlatformPerformance />
```

### 5. RealTimeMetrics
WebSocket-powered real-time metrics dashboard with live updates and alert system.

**Features:**
- Real-time data streaming
- WebSocket connection management
- Live alerts and notifications
- Performance monitoring
- System health metrics
- Simulation mode for testing

**Usage:**
```tsx
import RealTimeMetrics from '@/components/analytics/RealTimeMetrics';

<RealTimeMetrics />
```

## Architecture

### State Management
- **Zustand**: Global state management for user preferences and UI state
- **React Query**: Server state management with caching, background updates, and error handling
- **WebSocket**: Real-time data streaming for live metrics

### Data Visualization
- **Recharts**: Comprehensive charting library built on D3
- **Chart.js**: Alternative charting for specific use cases
- **Responsive Design**: All charts are fully responsive
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels

### Design System
- **shadcn/ui**: Consistent component library
- **Tailwind CSS**: Utility-first styling
- **Dark/Light Theme**: Full theme support with next-themes
- **Loading States**: Skeleton loaders for all components
- **Error Boundaries**: Graceful error handling

## Installation

```bash
npm install recharts @tanstack/react-query zustand chart.js react-chartjs-2 date-fns
```

## Setup

### 1. Query Client Provider
Wrap your app with React Query provider:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}
```

### 2. Error Boundary
Wrap analytics components with error boundary:

```tsx
import { AnalyticsErrorBoundary } from '@/components/analytics/ErrorBoundary';

<AnalyticsErrorBoundary>
  <YourAnalyticsComponent />
</AnalyticsErrorBoundary>
```

### 3. Theme Provider
Ensure theme provider is set up for dark/light mode:

```tsx
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  <YourApp />
</ThemeProvider>
```

## API Integration

### Mock Data
Components include mock data for development. Replace with real API calls:

```tsx
import { useRevenueData } from '@/lib/api/analytics-queries';

function RevenueDashboard() {
  const { data, isLoading, error } = useRevenueData('30d');
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState />;
  
  return <RevenueChart data={data} />;
}
```

### Real API Integration
Update the API functions in `lib/api/analytics-queries.ts`:

```ts
export const fetchRevenueData = async (timeRange: string) => {
  const response = await fetch(`/api/analytics/revenue?range=${timeRange}`);
  return response.json();
};
```

## Testing

### Unit Tests
```bash
npm test -- RevenueChart.test.tsx
```

### E2E Tests
```bash
npx playwright test analytics-dashboard.spec.ts
```

### Test Coverage
- Component rendering
- User interactions
- Data visualization
- Error handling
- Responsive design
- Accessibility

## Performance

### Optimization
- **Code Splitting**: Components are lazy-loaded
- **Memoization**: Expensive calculations are memoized
- **Virtualization**: Large datasets use virtualization
- **Debouncing**: User inputs are debounced
- **Caching**: API responses are cached

### Bundle Size
- Tree-shaking enabled
- Dynamic imports for heavy libraries
- Minimal dependencies

## Accessibility

### WCAG 2.1 AA Compliance
- Proper ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance
- Focus management

### Keyboard Navigation
- Tab navigation through all interactive elements
- Arrow key support for charts
- Enter/Space for actions
- Escape to close modals

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Mobile Support

- Responsive design
- Touch gestures
- Mobile-optimized charts
- Performance on low-end devices

## Contributing

### Development
```bash
npm run dev
```

### Building
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

## License

MIT

## Support

For issues and feature requests, please create an issue in the repository.