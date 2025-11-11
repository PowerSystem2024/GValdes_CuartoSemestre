import CheckoutClient from "./CheckoutClient";


export default function CheckoutPage({
  searchParams,
}: {
  searchParams?: { productId?: string; [k: string]: string | string[] | undefined };
}) {
  const productId = typeof searchParams?.productId === "string" ? searchParams.productId : "";

  return <CheckoutClient productId={productId} />;
}
