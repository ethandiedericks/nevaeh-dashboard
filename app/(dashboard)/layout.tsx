"use client";

import type React from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { X, Home, FileText, CreditCard, Receipt } from "lucide-react";

import { Suspense } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Contracts", href: "/dashboard/contract", icon: FileText },
  { name: "Payments", href: "/dashboard/payment", icon: CreditCard },
  { name: "Invoices", href: "/dashboard/invoice", icon: Receipt },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={classNames(
          sidebarOpen ? "fixed inset-0 z-50 lg:hidden" : "hidden"
        )}
      >
        <div
          className="fixed inset-0 bg-gray-900/80"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">RM</span>
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">
                Retainer Manager
              </span>
            </div>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-8">
            <ul className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        isActive
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={classNames(
                          isActive
                            ? "text-gray-500"
                            : "text-gray-400 group-hover:text-gray-500",
                          "mr-3 h-5 w-5"
                        )}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 py-6 border-r border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">RM</span>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">
              Retainer Manager
            </span>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="space-y-1">
                  {navigationItems.map((item) => {
                    const isActive = isActiveRoute(item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            isActive
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              isActive
                                ? "text-gray-500"
                                : "text-gray-400 group-hover:text-gray-500",
                              "mr-3 h-5 w-5"
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
          <div className="flex flex-col w-full items-start p-4">
            {/* Left: Show Sign In Button when Signed Out */}
            <div>
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </div>

            {/* Right: Show User Button above email when Signed In */}
            <div>
              <SignedIn>
                <div className="flex flex-col items-start gap-2">
                  <UserButton />
                  <span className="text-black text-sm">
                    {user?.emailAddresses[0].emailAddress}
                  </span>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Main content area */}
        <main className="py-6">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            <Suspense>{children}</Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
