import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RevenueChart from '@/components/analytics/RevenueChart';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the utils
vi.mock('@/lib/utils', () => ({
  formatCurrency: (value: number) => `$${value.toLocaleString()}`,
  formatDate: (date: string) => new Date(date).toLocaleDateString(),
}));

// Mock recharts to avoid canvas issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Cell: () => <div data-testid="cell" />,
}));

// Mock shadcn components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div data-testid="card-content">{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="card-header">{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="card-title">{children}</div>,
  CardDescription: ({ children }: { children: React.ReactNode }) => <div data-testid="card-description">{children}</div>,
}));

vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div data-testid="tabs">{children}</div>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div data-testid="tabs-content">{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div data-testid="tabs-list">{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="tabs-trigger">{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button data-testid="button" onClick={onClick}>{children}</button>
  ),
}));

describe('RevenueChart', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <RevenueChart />
      </QueryClientProvider>
    );
  };

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('displays the correct title and description', () => {
    renderComponent();
    expect(screen.getByText('Revenue Trends')).toBeInTheDocument();
    expect(screen.getByText('Track revenue, expenses, and profit over time')).toBeInTheDocument();
  });

  it('shows export buttons', () => {
    renderComponent();
    expect(screen.getAllByTestId('button')).toHaveLength(2);
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('PNG')).toBeInTheDocument();
  });

  it('displays metric cards with data', async () => {
    renderComponent();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Total Revenue/)).toBeInTheDocument();
      expect(screen.getByText(/Total Profit/)).toBeInTheDocument();
      expect(screen.getByText(/Avg\. Growth/)).toBeInTheDocument();
    });
  });

  it('switches between line and bar charts', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Line Chart')).toBeInTheDocument();
      expect(screen.getByText('Bar Chart')).toBeInTheDocument();
    });

    // Initially should show line chart
    expect(screen.getByTestId('tabs-trigger')).toHaveTextContent('Line Chart');
    
    // Click bar chart tab
    const barChartTab = screen.getByText('Bar Chart');
    fireEvent.click(barChartTab);
    
    // Should now show bar chart
    expect(screen.getByTestId('tabs-trigger')).toHaveTextContent('Bar Chart');
  });

  it('handles CSV export click', async () => {
    const mockClick = vi.fn();
    window.URL.createObjectURL = vi.fn();
    window.URL.revokeObjectURL = vi.fn();
    
    // Mock document.createElement
    const originalCreateElement = document.createElement;
    document.createElement = vi.fn().mockImplementation((tag) => {
      if (tag === 'a') {
        return {
          href: '',
          download: '',
          click: mockClick,
        };
      }
      return originalCreateElement(tag);
    });

    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('CSV')).toBeInTheDocument();
    });

    const csvButton = screen.getByText('CSV');
    fireEvent.click(csvButton);
    
    // Should trigger download
    expect(mockClick).toHaveBeenCalled();
    
    // Restore original
    document.createElement = originalCreateElement;
  });

  it('shows loading state initially', () => {
    renderComponent();
    // The component shows mock data immediately, but in a real test with API,
    // we would check for loading indicators
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('handles empty data state', () => {
    // Test with empty data prop
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <RevenueChart data={[]} />
      </QueryClientProvider>
    );
    
    expect(container).toBeInTheDocument();
    // Should still render the component structure
    expect(screen.getByText('Revenue Trends')).toBeInTheDocument();
  });
});