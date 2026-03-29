import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";
import { SecurityProvider } from "@/components/security/AuthProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const inter = Inter({ subsets: ["latin"] });

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

export const metadata: Metadata = {
  title: "Cazza.ai - AI Business Assistant",
  description: "Your AI-powered business assistant for automating workflows and connecting platforms",
  // Security-related meta tags
  keywords: ["AI", "business", "automation", "secure", "enterprise"],
  authors: [{ name: "Cazza.ai" }],
  creator: "Cazza.ai",
  publisher: "Cazza.ai",
  robots: "index, follow",
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cazza.ai",
    title: "Cazza.ai - AI Business Assistant",
    description: "Your AI-powered business assistant for automating workflows and connecting platforms",
    siteName: "Cazza.ai",
  },
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Cazza.ai - AI Business Assistant",
    description: "Your AI-powered business assistant for automating workflows and connecting platforms",
    creator: "@cazza_ai",
  },
  // Security headers (some are set via middleware)
  other: {
    "x-ua-compatible": "IE=edge,chrome=1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Additional security meta tags */}
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Preconnect to API domain for performance */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SecurityProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  {children}
                </main>
              </div>
            </SecurityProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}