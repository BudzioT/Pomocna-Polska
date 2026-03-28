import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("user_role")?.value;
  const isAuth = !!role;
  const url = request.nextUrl.clone();

  const publicPaths = ["/", "/onboarding", "/login", "/register", "/role", "/pass"];
  const isPublicPath = publicPaths.includes(url.pathname);
  const isEditingRole = url.pathname === "/role" && url.searchParams.get("edit") === "true";

  // Zalogowana osoba nie może wchodzić na podstrony autoryzacji / onboarding
  // (chyba że właśnie zamierza edytować swoją rolę)
  if (isAuth && isPublicPath && !isEditingRole) {
    // Pierwsza opcja od lewej na pasku:
    // Dla WOLONTARIUSZA lub OBU (BOTH) -> /map
    // Dla Ptrzebującego (SEEKER), który nie ma mapy -> /new-request
    url.pathname = role === "SEEKER" ? "/new-request" : "/map";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
