import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, password } = await req.json();

    if (!phoneNumber || !password) {
      return NextResponse.json({ error: "Brakuje numeru lub hasła." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { phoneNumber } });

    if (!user || user.password !== hashPassword(password)) {
      return NextResponse.json({ error: "Nieprawidłowy numer telefonu lub hasło." }, { status: 401 });
    }

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
    response.cookies.set("user_role", user.role, { path: "/", maxAge: 60 * 60 * 24 * 30 });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
