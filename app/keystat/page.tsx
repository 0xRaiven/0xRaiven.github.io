import { notFound, redirect } from "next/navigation";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{}];
}

export default function KeystatRedirect() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  redirect("/keystatic");
}
