import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/messages?conversationId=<id>
 * Returns all messages for a given conversation, ordered chronologically.
 */
export async function GET(request: NextRequest) {
  const conversationId = request.nextUrl.searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json(
      { error: "conversationId query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages
 * Creates a new message. Body: { conversationId, senderId, body }
 */
export async function POST(request: NextRequest) {
  try {
    const { conversationId, senderId, body } = await request.json();

    if (!conversationId || !senderId || !body) {
      return NextResponse.json(
        { error: "conversationId, senderId, and body are required" },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { request: true },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Nie znaleziono konwersacji" }, { status: 404 });
    }

    if (conversation.request.status === "COMPLETED") {
      return NextResponse.json({ error: "Nie można wysyłać wiadomości w zakończonej sprawie" }, { status: 403 });
    }

    const message = await prisma.message.create({
      data: {
        body,
        senderId,
        conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Failed to create message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
