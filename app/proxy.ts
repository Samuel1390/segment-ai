import { NextResponse, NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
