"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col space-y-1">
      <Link
        href="/api-docs"
        className={cn(
          "px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100",
          pathname === "/api-docs" ? "bg-gray-100 font-medium" : "text-gray-500",
        )}
      >
        Overview
      </Link>
      <Link
        href="/api-docs/authentication"
        className={cn(
          "px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100",
          pathname === "/api-docs/authentication" ? "bg-gray-100 font-medium" : "text-gray-500",
        )}
      >
        Authentication
      </Link>
      <Link
        href="/api-docs/users"
        className={cn(
          "px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100",
          pathname === "/api-docs/users" ? "bg-gray-100 font-medium" : "text-gray-500",
        )}
      >
        Users
      </Link>
      <Link
        href="/api-docs/addresses"
        className={cn(
          "px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100",
          pathname === "/api-docs/addresses" ? "bg-gray-100 font-medium" : "text-gray-500",
        )}
      >
        Addresses
      </Link>
      <Link
        href="/api-docs/notifications"
        className={cn(
          "px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100",
          pathname === "/api-docs/notifications" ? "bg-gray-100 font-medium" : "text-gray-500",
        )}
      >
        Notifications
      </Link>
      <Link
        href="/api-docs/grocery-items"
        className={cn(
          "px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100",
          pathname === "/api-docs/grocery-items" ? "bg-gray-100 font-medium" : "text-gray-500",
        )}
      >
        Grocery Items
      </Link>
      <Link
        href="/api-docs/owner-identifications"
        className={cn(
          "px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100",
          pathname === "/api-docs/owner-identifications" ? "bg-gray-100 font-medium" : "text-gray-500",
        )}
      >
        Owner Identifications
      </Link>
      <Link
        href="/api-docs/owner-bank-accounts"
        className={cn(
          "px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100",
          pathname === "/api-docs/owner-bank-accounts" ? "bg-gray-100 font-medium" : "text-gray-500",
        )}
      >
        Owner Bank Accounts
      </Link>
      <Link
        href="/api-docs/shop-owner-documents"
        className={cn(
          "px-3 py-2 rounded-md text-sm transition-colors hover:bg-gray-100",
          pathname === "/api-docs/shop-owner-documents" ? "bg-gray-100 font-medium" : "text-gray-500",
        )}
      >
        Shop Owner Documents
      </Link>
    </nav>
  )
}
