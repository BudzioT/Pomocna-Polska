import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/messages?requestId=<id>
 * Returns all messages for a given help request, ordered chronologically.
 */
export async function GET(request: NextRequest) {
  const requestId = request.nextUrl.searchParams.get("requestId");

  if (!requestId) {
    return NextResponse.json(
      { error: "requestId query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const messages = await prisma.message.findMany({
      where: { requestId },
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
 * Creates a new message. Body: { requestId, senderId, body }
 */
export async function POST(request: NextRequest) {
  try {
    const { requestId, senderId, body } = await request.json();

    if (!requestId || !senderId || !body) {
      return NextResponse.json(
        { error: "requestId, senderId, and body are required" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        body,
        senderId,
        requestId,
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
