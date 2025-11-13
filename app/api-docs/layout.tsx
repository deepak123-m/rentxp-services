"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === `/api-docs/${path}`
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>

      <div className="flex flex-wrap gap-2 mb-10 p-4 bg-muted/30 rounded-lg min-h-[120px]">
        {/* First row: Inventory Management API */}
        <div className="w-full mb-2">
          <span className="text-sm font-medium text-muted-foreground px-2 py-1 bg-muted rounded">
            Inventory Management API
          </span>
        </div>
        <Link
          href="/api-docs/articles"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("articles") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Articles
        </Link>
        <Link
          href="/api-docs/vendors"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("vendors") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Vendors API
        </Link>
        <Link
          href="/api-docs/purchase-orders"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("purchase-orders") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Purchase Orders
        </Link>
        <Link
          href="/api-docs/grn"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("grn") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          GRN
        </Link>
        <Link
          href="/api-docs/orders"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("orders") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Orders
        </Link>
        <Link
          href="/api-docs/return-orders"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("return-orders") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Return Orders
        </Link>
        <Link
          href="/api-docs/payments"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("payments") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Payments
        </Link>

        {/* Second row: Original API */}
        <div className="w-full mt-2 mb-2">
          <span className="text-sm font-medium text-muted-foreground px-2 py-1 bg-muted rounded">Grocery API</span>
        </div>
        <Link
          href="/api-docs/authentication"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("authentication") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Authentication
        </Link>
        <Link
          href="/api-docs/products"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("products") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Products
        </Link>
        <Link
          href="/api-docs/categories"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("categories") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Categories
        </Link>
        <Link
          href="/api-docs/customer-orders"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("customer-orders") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Customer Orders
        </Link>
        <Link
          href="/api-docs/addresses"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("addresses") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Addresses
        </Link>
        <Link
          href="/api-docs/notifications"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("notifications") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Notifications
        </Link>
        <Link
          href="/api-docs/cart"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("cart") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Cart
        </Link>
        <Link
          href="/api-docs/shop-owner-registrations"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("shop-owner-registrations") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Shop Owner Registrations
        </Link>
        <Link
          href="/api-docs/owner-identifications"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("owner-identifications") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Owner Identifications
        </Link>
        <Link
          href="/api-docs/owner-bank-accounts"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("owner-bank-accounts") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Owner Bank Accounts
        </Link>
        <Link
          href="/api-docs/shop-owner-documents"
          className={cn(
            "px-4 py-2 rounded-md",
            isActive("shop-owner-documents") ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
          )}
        >
          Shop Owner Documents
        </Link>
      </div>

      {children}
    </div>
  )
}
