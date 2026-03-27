import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Dashboard | Cazza.ai",
  description: "Real-time analytics and business intelligence dashboard",
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}