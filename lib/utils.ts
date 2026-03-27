import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency with optional compact notation
export function formatCurrency(value: number, compact: boolean = false): string {
  if (compact && Math.abs(value) >= 1000) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    return formatter.format(value);
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
}

// Format number with optional compact notation
export function formatNumber(value: number, compact: boolean = false): string {
  if (compact && Math.abs(value) >= 1000) {
    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    return formatter.format(value);
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 1): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return formatter.format(value / 100);
}

// Format date
export function formatDate(date: string | Date, format: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'MMM dd') {
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  if (format === 'MMM dd, yyyy') {
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  
  return dateObj.toLocaleDateString('en-US');
}

// Format time
export function formatTime(timestamp: number, format: string = 'HH:mm:ss'): string {
  const date = new Date(timestamp);
  
  if (format === 'HH:mm') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  
  if (format === 'HH:mm:ss') {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  }
  
  return date.toLocaleTimeString('en-US');
}

// Calculate percentage change
export function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
