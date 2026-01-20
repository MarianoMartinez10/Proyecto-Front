"use client";

import { ComparatorProvider } from "@/context/ComparatorContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/hooks/use-auth";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <ComparatorProvider>
          {children}
        </ComparatorProvider>
      </CartProvider>
    </AuthProvider>
  );
}