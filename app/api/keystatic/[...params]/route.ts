import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "@/keystatic.config";
import { notFound } from "next/navigation";


export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ params: ["keystatic"] }];
}

const handler = makeRouteHandler({ config });

export const GET = (request: Request) => {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  const headers = new Headers(request.headers);
  headers.set("no-cors", "1");
  const forwardReq = new Request(request.url, {
    method: request.method,
    headers,
  });
  return handler.GET(forwardReq);
};

export const POST = async (request: Request) => {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  const headers = new Headers(request.headers);
  headers.set("no-cors", "1");
  const body = await request.blob();
  const forwardReq = new Request(request.url, {
    method: request.method,
    headers,
    body,
  });
  return handler.POST(forwardReq);
};
