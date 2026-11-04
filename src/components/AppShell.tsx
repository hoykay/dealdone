"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

type AppShellProps = {
  children: ReactNode;
};

type IconName =
  | "deals"
  | "counterparties"
  | "evidence"
  | "settlements"
  | "analytics"
  | "notifications"
  | "settings";

function NavIcon({ name }: { name: IconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "deals") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="6" height="6" rx="1.5" />
        <rect x="14" y="4" width="6" height="6" rx="1.5" />
        <rect x="4" y="14" width="6" height="6" rx="1.5" />
        <rect x="14" y="14" width="6" height="6" rx="1.5" />
      </svg>
    );
  }

  if (name === "counterparties") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="3" />
        <path d="M6.5 19c.8-3.1 2.7-4.7 5.5-4.7s4.7 1.6 5.5 4.7" />
      </svg>
    );
  }

  if (name === "evidence") {
    return (
      <svg {...common}>
        <path d="M7 3.5h7l4 4V20H7z" />
        <path d="M14 3.5V8h4" />
        <path d="M10 12h5" />
        <path d="M10 15.5h5" />
      </svg>
    );
  }

  if (name === "settlements") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="8" />
        <path d="m8.8 12.1 2.1 2.1 4.6-4.7" />
      </svg>
    );
  }

  if (name === "analytics") {
    return (
      <svg {...common}>
        <path d="M5 19V12" />
        <path d="M10 19V8" />
        <path d="M15 19V5" />
        <path d="M20 19V10" />
      </svg>
    );
  }

  if (name === "notifications") {
    return (
      <svg {...common}>
        <path d="M7 10a5 5 0 0 1 10 0v3.2l1.4 2.3H5.6L7 13.2z" />
        <path d="M10 18a2.2 2.2 0 0 0 4 0" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7.5 7.5 0 0 0-.1-1l2-1.5-2-3.4-2.5 1a8 8 0 0 0-1.7-1L14.4 3h-4.8l-.4 3.1a8 8 0 0 0-1.7 1L5 6.1 3 9.5 5 11a7.5 7.5 0 0 0 0 2l-2 1.5 2 3.4 2.5-1a8 8 0 0 0 1.7 1l.4 3.1h4.8l.4-3.1a8 8 0 0 0 1.7-1l2.5 1 2-3.4L19 13a7.5 7.5 0 0 0 .1-1Z" />
    </svg>
  );
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Deals",
      icon: "deals" as IconName,
      href: "/deals",
      active: pathname === "/deals",
    },
    {
      label: "Counterparties",
      icon: "counterparties" as IconName,
      href: "/deals",
      active: false,
    },
    {
      label: "Evidence",
      icon: "evidence" as IconName,
      href: "/deals/dd-1048",
      active:
        pathname === "/deals/dd-1048" ||
        pathname.includes("/deals/dd-1048/evidence"),
    },
    {
      label: "Settlements",
      icon: "settlements" as IconName,
      href: "/deals/dd-1048/settlement",
      active:
        pathname.includes("/settlement") ||
        pathname.includes("/complete"),
    },
    {
      label: "Analytics",
      icon: "analytics" as IconName,
      href: "/deals",
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8FC] text-[#171332]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[218px] border-r border-[#EBE8F2] bg-white lg:flex lg:flex-col">
        {/* Brand */}
        <div className="flex h-[78px] items-center px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#4936F3] text-[13px] font-bold text-white shadow-[0_5px_14px_rgba(73,54,243,0.22)]">
              ✦
            </div>

            <span className="text-[18px] font-semibold tracking-[-0.035em] text-[#171332]">
              DealDone
            </span>
          </Link>
        </div>

        {/* Main navigation */}
        <nav className="mt-2 flex flex-1 flex-col px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "group flex h-[44px] items-center gap-3 rounded-[10px] px-3 text-[13px] font-medium transition",
                  item.active
                    ? "bg-[#F0ECFF] text-[#4D35F3]"
                    : "text-[#6E687D] hover:bg-[#F8F7FB] hover:text-[#251F39]",
                ].join(" ")}
              >
                <span
                  className={
                    item.active
                      ? "text-[#4D35F3]"
                      : "text-[#898397] group-hover:text-[#615A70]"
                  }
                >
                  <NavIcon name={item.icon} />
                </span>

                {item.label}
              </Link>
            ))}
          </div>

          {/* Bottom navigation */}
          <div className="mb-5 mt-auto space-y-1 border-t border-[#F0EDF4] pt-4">
            <button
              type="button"
              className="flex h-[44px] w-full items-center justify-between rounded-[10px] px-3 text-[13px] font-medium text-[#6E687D] transition hover:bg-[#F8F7FB] hover:text-[#251F39]"
            >
              <span className="flex items-center gap-3">
                <span className="text-[#898397]">
                  <NavIcon name="notifications" />
                </span>
                Notifications
              </span>

              <span className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#FF69B6] px-1.5 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            <Link
              href="/settings"
              className={[
                "flex h-[44px] items-center gap-3 rounded-[10px] px-3 text-[13px] font-medium transition",
                pathname === "/settings"
                  ? "bg-[#F0ECFF] text-[#4D35F3]"
                  : "text-[#6E687D] hover:bg-[#F8F7FB] hover:text-[#251F39]",
              ].join(" ")}
            >
              <span
                className={
                  pathname === "/settings"
                    ? "text-[#4D35F3]"
                    : "text-[#898397]"
                }
              >
                <NavIcon name="settings" />
              </span>

              Settings
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main area */}
      <div className="lg:pl-[218px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-[#EBE8F2] bg-white/95 px-5 backdrop-blur-xl sm:px-7 lg:px-8">
          {/* Mobile brand */}
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#4936F3] text-xs font-bold text-white">
              ✦
            </div>

            <span className="font-semibold tracking-[-0.03em]">
              DealDone
            </span>
          </Link>

          <div className="hidden lg:block" />

          {/* Company selector */}
          <button
            type="button"
            className="ml-auto flex items-center gap-3 rounded-[10px] px-2 py-1.5 transition hover:bg-[#F8F7FB]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEEAFE] text-[11px] font-semibold text-[#4D35F3]">
              AM
            </div>

            <span className="hidden text-[12px] font-medium text-[#393348] sm:block">
              Acme Manufacturing
            </span>

            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#8A8495]"
            >
              <path d="m8 10 4 4 4-4" />
            </svg>
          </button>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-72px)]">
          {children}
        </main>
      </div>
    </div>
  );
}