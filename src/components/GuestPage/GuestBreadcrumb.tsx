"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconChevronRight, IconHome } from "@tabler/icons-react";

interface BreadcrumbItem {
  title: string;
  link: string;
}

interface GuestBreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export function GuestBreadcrumb({
  items,
  separator = <IconChevronRight className="h-4 w-4 text-secondaryTextV1" />,
  className,
  ...props
}: GuestBreadcrumbProps) {
  return (
    <nav
      className={cn(
        "flex w-full items-center overflow-auto flex-nowrap no-scrollbar",
        className
      )}
      aria-label="breadcrumb"
      {...props}
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          
          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && <span className="mx-2">{separator}</span>}
              
              {isLastItem ? (
                <span className="text-mainTextV1 font-medium truncate max-w-[250px]">
                  {item.title}
                </span>
              ) : (
                <Link
                  href={item.link}
                  className="text-secondaryTextV1 hover:text-mainTextHoverV1 transition-colors duration-200 truncate max-w-[200px]"
                >
                  {index === 0 ? (
                    <span className="flex items-center">
                      <IconHome className="h-4 w-4 mr-1" />
                      {item.title}
                    </span>
                  ) : (
                    item.title
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
} 