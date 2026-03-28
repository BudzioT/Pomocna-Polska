import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const currentUserId = cookieStore.get("user_id")?.value;

    if (!currentUserId) {
      return NextResponse.json({ error: "Nieautoryzowany" }, { status: 401 });
    }

    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id },
    });

    if (!helpRequest) {
      return NextResponse.json(
        { error: "Nie znaleziono zgłoszenia" },
        { status: 404 }
      );
    }

    if (helpRequest.authorId !== currentUserId) {
      return NextResponse.json(
        { error: "Brak uprawnień do edycji" },
        { status: 403 }
      );
    }

    if (helpRequest.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Zgłoszenie zostało już zakończone" },
        { status: 400 }
      );
    }

    await prisma.helpRequest.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    // Optionally you could redirect or just return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing help request:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas kończenia zgłoszenia" },
      { status: 500 }
    );
  }
}
