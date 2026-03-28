import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the conversation to get the related requestId
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { request: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Nie znaleziono konwersacji" },
        { status: 404 }
      );
    }

    // Check if it's already completed
    if (conversation.request.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Prośba została już zakończona" },
        { status: 400 }
      );
    }

    // Update the help request to COMPLETED
    await prisma.helpRequest.update({
      where: { id: conversation.requestId },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing request:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas kończenia zgłoszenia" },
      { status: 500 }
    );
  }
}
