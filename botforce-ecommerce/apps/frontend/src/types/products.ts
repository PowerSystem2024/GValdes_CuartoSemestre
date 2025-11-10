export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  currency: string;          // "ARS"
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  imageUrl?: string | null;
  features?: string[] | null;
  createdAt?: string;
};
