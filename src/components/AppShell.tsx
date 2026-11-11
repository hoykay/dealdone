"use client";

import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AppShellProps = {
  children: ReactNode;
};

type IconName =
  | "deals"
  | "evidence"
  | "negotiation"
  | "settlements"
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

  if (name === "negotiation") {
  return (
    <svg {...common}>
      <path d="M4 7.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v4A3.5 3.5 0 0 1 16.5 15H11l-4.5 4v-4.3A3.5 3.5 0 0 1 4 11.5z" />
      <path d="M8 9.5h8" />
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

  const router = useRouter();

async function handleLogout() {
  const supabase = createClient();

  await supabase.auth.signOut();

  router.push("/login");
  router.refresh();
}

  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

const currentPath = mounted ? pathname : "";

const [notificationsOpen, setNotificationsOpen] = useState(false);

const [userRole, setUserRole] = useState<
  "buyer" | "supplier" | null
>(null);

const [settlementState, setSettlementState] = useState<{
  status: string;
  buyerApproved: boolean;
  supplierApproved: boolean;
} | null>(null);

useEffect(() => {
  async function loadRole() {
    try {
      const response = await fetch(
        "/api/auth/me?dealId=DEAL-1048"
      );

      const data = await response.json();

      if (
        data.role === "buyer" ||
        data.role === "supplier"
      ) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error(
        "Could not load notification role:",
        error
      );
    }
  }

  loadRole();
}, []);

useEffect(() => {
  async function loadSettlementState() {
    try {
      const response = await fetch(
        "/api/settlements/current?dealId=DEAL-1048"
      );

      const data = await response.json();

      if (data.success && data.settlement) {
        setSettlementState({
          status: data.settlement.status,
          buyerApproved:
            data.settlement.buyerApproved,
          supplierApproved:
            data.settlement.supplierApproved,
        });
      }
    } catch (error) {
      console.error(
        "Could not load notification settlement state:",
        error
      );
    }
  }

  loadSettlementState();
}, []);

  const navItems = [
    {
      label: "Deals",
      icon: "deals" as IconName,
      href: "/deals",
      active: currentPath === "/deals",
    },

    {
      label: "Evidence",
      icon: "evidence" as IconName,
      href: "/deals/dd-1048",
      active:
  currentPath === "/deals/dd-1048" ||
  currentPath.includes("/deals/dd-1048/evidence"),
    },
    {
  label: "Negotiation",
  icon: "negotiation" as IconName,
  href: "/deals/dd-1048/negotiation",
  active: pathname.includes("/deals/dd-1048/negotiation"),
},
    {
  label: "Settlements",
  icon: "settlements" as IconName,
  href: "/deals/dd-1048/settlement",
  active:
    pathname.includes("/settlement") ||
    pathname.includes("/complete") ||
    pathname.includes("/payment-record"),
},
  ];

  return (
    <div className="min-h-screen bg-[#F8F8FC] text-[#171332]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[218px] border-r border-[#EBE8F2] bg-white lg:flex lg:flex-col">
        {/* Brand */}
        <div className="flex h-[78px] items-center px-6">
          <Link href="/" className="flex items-center">
  <img
    src="/dealdone-logo.png"
    alt="DealDone"
    className="h-[42px] w-auto object-contain"
  />
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
              onClick={() => setNotificationsOpen(true)}
              className="flex h-[44px] w-full items-center justify-between rounded-[10px] px-3 text-[13px] font-medium text-[#6E687D] transition hover:bg-[#F8F7FB] hover:text-[#251F39]"
            >
              <span className="flex items-center gap-3">
                <span className="text-[#898397]">
                  <NavIcon name="notifications" />
                </span>
                Notifications
              </span>
            </button>

            <Link
              href="/settings"
              className={[
                "flex h-[44px] items-center gap-3 rounded-[10px] px-3 text-[13px] font-medium transition",
                currentPath === "/settings"
                  ? "bg-[#F0ECFF] text-[#4D35F3]"
                  : "text-[#6E687D] hover:bg-[#F8F7FB] hover:text-[#251F39]",
              ].join(" ")}
            >
              <span
                className={
                  currentPath === "/settings"
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
          <Link href="/" className="flex items-center lg:hidden">
  <img
    src="/dealdone-logo.png"
    alt="DealDone"
    className="h-[40px] w-auto object-contain"
  />
</Link>

          <div className="hidden lg:block" />

          <div className="ml-auto flex items-center gap-3">
  {/* Company selector */}
  <button
    type="button"
    className="flex items-center gap-3 rounded-[10px] px-2 py-1.5 transition hover:bg-[#F8F7FB]"
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

  <div className="h-6 w-px bg-[#E8E4EE]" />

  <button
    type="button"
    onClick={() => void handleLogout()}
    className="rounded-[9px] px-3 py-2 text-[12px] font-semibold text-[#6E687D] transition hover:bg-[#F8F7FB] hover:text-[#251F39]"
  >
    Log out
  </button>
</div>
</header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-72px)]">
          {children}
        </main>
      </div>
      {notificationsOpen && (
  <>
    {/* Backdrop */}
    <button
      type="button"
      aria-label="Close notifications"
      onClick={() => setNotificationsOpen(false)}
      className="fixed inset-0 z-40 bg-[#171332]/15 backdrop-blur-[2px]"
    />

    {/* Drawer */}
    <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-[420px] border-l border-[#E8E4EE] bg-white shadow-[-20px_0_60px_rgba(35,27,73,0.12)]">
      <div className="flex h-[72px] items-center justify-between border-b border-[#ECE9F1] px-6">
        <div>
          <p className="text-[17px] font-semibold tracking-[-0.02em] text-[#171332]">
            Notifications
          </p>

          <p className="mt-0.5 text-[11px] text-[#8A8495]">
            Deal activity and actions
          </p>
        </div>

        <button
          type="button"
          onClick={() => setNotificationsOpen(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[20px] text-[#756F81] transition hover:bg-[#F5F3F8]"
        >
          ×
        </button>
      </div>

      <div className="h-[calc(100vh-72px)] overflow-y-auto px-6 py-6">
        {/* Action required */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8B8496]">
            Action required
          </p>

          <div className="mt-3 rounded-[14px] border border-[#E8E4EE] bg-[#FAF9FC] px-4 py-5">
  <div className="flex items-start gap-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-[#F1EDFF] text-[16px] text-[#4D35F3]">
      ✓
    </div>

    <div>
      <p className="text-[13px] font-semibold text-[#211C37]">
        No action required
      </p>

      <p className="mt-1 text-[12px] leading-5 text-[#756F81]">
        This demo run is ready. New actions will appear here as DealDone moves through evidence review, negotiation, and approval.
      </p>
    </div>
  </div>
</div>
        </section>

        {/* Recent */}
<section className="mt-8">
  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8B8495]">
    Recent
  </p>

  <div className="mt-3 rounded-[12px] border border-dashed border-[#E4DFEA] bg-[#FAF9FC] px-4 py-5 text-center">
    <p className="text-[12px] font-semibold text-[#514B5D]">
      No activity yet
    </p>

    <p className="mt-1 text-[11px] leading-5 text-[#8B8495]">
      Evidence analysis, negotiation, approvals, and settlement activity will appear here during this demo run.
    </p>
  </div>
</section>
      </div>
    </aside>
  </>
)}
    </div>
  );
}