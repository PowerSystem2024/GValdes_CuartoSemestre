"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cartCount } from "@/lib/cart";

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(cartCount());
    refresh();
    window.addEventListener("cart:change", refresh);
    window.addEventListener("storage", refresh); // otros tabs
    window.addEventListener("auth:change", refresh);
    return () => {
      window.removeEventListener("cart:change", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("auth:change", refresh);
    };
  }, []);

  return (
    <Link href="/cart" className="relative inline-flex items-center gap-2">
      <span>Carrito</span>
      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
        {count}
      </span>
    </Link>
  );
}
