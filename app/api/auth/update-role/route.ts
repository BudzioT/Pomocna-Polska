import { prisma } from "@/lib/db";
import { resolveRole } from "@/lib/permissions";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    
    if (!userId) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const { seeker, volunteer } = await req.json();
    const role = resolveRole(!!seeker, !!volunteer);

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    const response = NextResponse.json({ ok: true, role });
    response.cookies.set("user_role", role, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
