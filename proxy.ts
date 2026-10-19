import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const chosen = request.cookies.get("NEXT_LOCALE")?.value;

  if (request.nextUrl.pathname === "/" && (chosen === "en" || chosen === "ro")) {
    return NextResponse.redirect(new URL(`/${chosen}`, request.url));
  }

  return intl(request);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};