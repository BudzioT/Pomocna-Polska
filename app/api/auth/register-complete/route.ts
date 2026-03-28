import { prisma } from "@/lib/db";
import { resolveRole } from "@/lib/permissions";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { name, phoneNumber, password, seeker, volunteer } = await req.json();

    if (!name || !phoneNumber || !password) {
      return NextResponse.json({ error: "Brakuje wymaganych danych." }, { status: 400 });
    }

    const passRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!passRegex.test(password)) {
      return NextResponse.json({ error: "Hasło nie spełnia wymagań bezpieczeństwa." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { phoneNumber } });
    if (existing) {
      return NextResponse.json({ error: "Numer telefonu jest już zarejestrowany." }, { status: 409 });
    }

    const role = resolveRole(!!seeker, !!volunteer);

    const user = await prisma.user.create({
      data: {
        name,
        phoneNumber,
        password: hashPassword(password),
        role,
      },
    });

    const response = NextResponse.json({ 
      ok: true, 
      userId: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      role: user.role
    });
    response.cookies.set("user_id", user.id, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
    response.cookies.set("user_name", user.name, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    response.cookies.set("user_phone", user.phoneNumber ?? "", { path: "/", maxAge: 60 * 60 * 24 * 30 });
    response.cookies.set("user_role", role, { path: "/", maxAge: 60 * 60 * 24 * 30 });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
