# Advanced Analytics Components

Phase 3 implementation of the advanced analytics and reporting system. This suite includes predictive analytics, custom report building, executive dashboards, and anomaly detection.

## Components

### 1. AdvancedCharts
Enhanced charting component with multiple visualization types and interactive features.

**Features:**
- Multiple chart types (line, bar, area, scatter, pie, radar)
- Interactive filtering and controls
- Fullscreen mode
- Multiple export formats (CSV, PNG, JSON)
- Real-time data updates
- Confidence intervals and forecasting

**Usage:**
```tsx
import AdvancedCharts from '@/components/analytics/AdvancedCharts';

<AdvancedCharts 
  title="Revenue Analytics"
  description="Multi-dimensional analysis"
  chartTypes={["line", "bar", "area", "pie"]}
/>
```

### 2. PredictiveAnalytics
Time series forecasting with anomaly detection and model performance metrics.

**Features:**
- Multiple forecasting models (Exponential Smoothing, ARIMA, Prophet, LSTM)
- Confidence intervals and bounds
- Anomaly detection and scoring
- Model performance metrics (MAE, RMSE, MAPE, R²)
- Interactive forecast horizon adjustment
- Export functionality

**Usage:**
```tsx
import PredictiveAnalytics from '@/components/analytics/PredictiveAnalytics';

<PredictiveAnalytics 
  title="Revenue Forecasting"
  description="90-day predictions"
  forecastHorizon={90}
/>
```

### 3. ReportBuilder
Drag-and-drop custom report builder with template management.

**Features:**
- Drag-and-drop widget placement (@dnd-kit)
- Multiple widget types (charts, tables, metrics, text, images)
- Template saving and loading
- Multiple export formats (PDF, Excel, CSV)
- Scheduling and email delivery
- Responsive grid layout

**Usage:**
```tsx
import ReportBuilder from '@/components/analytics/ReportBuilder';

<ReportBuilder 
  onSave={(report) => console.log('Saved:', report)}
  onExport={(report, format) => console.log('Exporting:', format)}
/>
```

### 4. ExecutiveDashboard
Executive-focused dashboard with KPI tracking and strategic overview.

**Features:**
- KPI tracking with targets and progress
- Strategic initiative tracking
- Risk assessment and mitigation
- Financial performance overview
- Efficiency metrics
- Export and refresh functionality

**Usage:**
```tsx
import ExecutiveDashboard from '@/components/analytics/ExecutiveDashboard';

<ExecutiveDashboard 
  timeRange="quarter"
  department="all"
/>
```

### 5. DataExport
Comprehensive data export system with scheduling and template management.

**Features:**
- Multiple export formats (CSV, Excel, PDF, JSON, PNG)
- Data type selection and filtering
- Export scheduling (daily, weekly, monthly)
- Email delivery configuration
- Export history and job tracking
- Compression and metadata options

**Usage:**
```tsx
import DataExport from '@/components/analytics/DataExport';

<DataExport 
  onExport={(config) => console.log('Export config:', config)}
  onSchedule={(schedule) => console.log('Schedule:', schedule)}
/>
```

### 6. AnomalyDetection
Real-time anomaly detection and alerting system.

**Features:**
- Real-time anomaly detection
- Configurable alert rules
- Multiple notification channels (email, Slack, webhook, SMS)
- Severity classification (low, medium, high, critical)
- Alert history and resolution tracking
- System health monitoring

**Usage:**
```tsx
import AnomalyDetection from '@/components/analytics/AnomalyDetection';

<AnomalyDetection 
  onAlert={(anomaly) => console.log('Alert:', anomaly)}
  onRuleChange={(rule) => console.log('Rule changed:', rule)}
/>
```

## Architecture

### Dependencies
- **@dnd-kit/core**: Drag-and-drop functionality for ReportBuilder
- **@dnd-kit/sortable**: Sortable lists for widget management
- **@dnd-kit/utilities**: Utility functions for drag-and-drop
- **recharts**: Advanced charting library
- **@tanstack/react-query**: Server state management
- **zustand**: Global state management
- **date-fns**: Date manipulation utilities

### State Management
- **Component State**: Local state for UI interactions
- **React Query**: Server state and caching
- **Zustand**: Global preferences and user settings
- **URL State**: Time ranges and filters in URL parameters

### Data Flow
1. **Data Fetching**: React Query hooks for API calls
2. **Data Processing**: Client-side aggregation and transformation
3. **Visualization**: Recharts for rendering charts
4. **User Interactions**: Event handlers for filtering and configuration
5. **Export**: Client-side generation of export files

## Performance Optimizations

### Code Splitting
- Dynamic imports for heavy components
- Lazy loading of chart libraries
- Route-based code splitting

### Memoization
- React.memo for expensive components
- useMemo for derived data
- useCallback for event handlers
- React Query caching for API responses

### Virtualization
- Virtualized lists for large datasets
- Windowed rendering for tables
- Progressive loading for charts

### Bundle Optimization
- Tree shaking enabled
- Dynamic imports for @dnd-kit
- Minimal re-renders with proper dependency arrays

## Accessibility

### WCAG 2.1 AA Compliance
- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

### Keyboard Navigation
- Tab navigation through all controls
- Arrow keys for chart interactions
- Enter/Space for actions
- Escape to close modals and dialogs

## Testing

### Unit Tests
```bash
npm test -- AdvancedCharts.test.tsx
npm test -- PredictiveAnalytics.test.tsx
```

### Integration Tests
```bash
npx playwright test analytics-advanced.spec.ts
```

### Test Coverage
- Component rendering
- User interactions
- Data visualization
- Error handling
- Accessibility
- Performance

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

## Setup

### Installation
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Configuration
1. Ensure React Query provider is set up
2. Configure error boundaries
3. Set up theme provider for dark/light mode
4. Configure API endpoints in analytics-queries.ts

## Usage Examples

### Complete Advanced Analytics Page
```tsx
import AdvancedAnalyticsDashboard from '@/app/analytics/advanced/page';

// This provides the complete advanced analytics experience
// with all components integrated and connected
```

### Individual Component Usage
```tsx
import { PredictiveAnalytics, ReportBuilder } from '@/components/analytics';

function CustomDashboard() {
  return (
    <div className="space-y-8">
      <PredictiveAnalytics />
      <ReportBuilder />
    </div>
  );
}
```

## API Integration

### Mock Data
Components include mock data for development. Replace with real API calls:

```tsx
import { useForecastData } from '@/lib/api/analytics-queries';

function RevenueForecast() {
  const { data, isLoading, error } = useForecastData('90d');
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState />;
  
  return <PredictiveAnalytics data={data} />;
}
```

### Real API Integration
Update the API functions in `lib/api/analytics-queries.ts`:

```ts
export const fetchForecastData = async (horizon: number) => {
  const response = await fetch(`/api/analytics/forecast?horizon=${horizon}`);
  return response.json();
};

export const fetchAnomalies = async () => {
  const response = await fetch('/api/analytics/anomalies');
  return response.json();
};
```

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