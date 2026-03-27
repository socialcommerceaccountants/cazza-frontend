"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { Breadcrumb } from "@/components/dashboard/Breadcrumb";
import { QuickActions } from "@/components/dashboard/QuickActions";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  showBreadcrumb?: boolean;
  showQuickActions?: boolean;
}

export function DashboardLayout({
  children,
  title,
  description,
  showBreadcrumb = true,
  showQuickActions = false,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNav 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {(title || description) && (
            <div className="mb-6">
              {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
              {description && (
                <p className="text-muted-foreground mt-2">{description}</p>
              )}
            </div>
          )}
          
          {showBreadcrumb && <Breadcrumb className="mb-6" />}
          
          {showQuickActions && <QuickActions className="mb-6" />}
          
          {children}
        </main>
        
        <footer className="border-t py-4 px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div>
              <p>© {new Date().getFullYear()} Cazza.ai. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="/support" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}