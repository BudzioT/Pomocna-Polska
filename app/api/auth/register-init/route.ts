import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, phoneNumber, seeker, volunteer } = await req.json();

    if (!name || !phoneNumber) {
      return NextResponse.json({ error: "Brakuje imienia lub numeru telefonu." }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { phoneNumber } });
    if (existing) {
      return NextResponse.json({ error: "Numer telefonu jest już zarejestrowany." }, { status: 409 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
