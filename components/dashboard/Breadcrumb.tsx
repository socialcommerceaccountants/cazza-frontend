import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items = [], className }: BreadcrumbProps) {
  const defaultItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/" },
    ...items,
  ];

  return (
    <nav className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center gap-2">
        {defaultItems.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {index === 0 ? (
              <Link
                href={item.href || "#"}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground font-medium">{item.label}</span>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}