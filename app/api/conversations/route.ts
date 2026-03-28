import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/conversations
 * Creates or fetches an existing conversation for a given request and volunteer.
 * Body: { requestId, volunteerId }
 */
export async function POST(request: NextRequest) {
  try {
    const { requestId, volunteerId } = await request.json();

    if (!requestId || !volunteerId) {
      return NextResponse.json(
        { error: "requestId and volunteerId are required" },
        { status: 400 }
      );
    }

    // Check if conversation already exists
    let conversation = await prisma.conversation.findUnique({
      where: {
        requestId_volunteerId: {
          requestId,
          volunteerId,
        },
      },
    });

    if (!conversation) {
      // Validate that the request exists and isn't the volunteer's own
      const helpRequest = await prisma.helpRequest.findUnique({
        where: { id: requestId },
      });

      if (!helpRequest) {
        return NextResponse.json(
          { error: "Help request not found" },
          { status: 404 }
        );
      }

      if (helpRequest.authorId === volunteerId) {
        return NextResponse.json(
          { error: "You cannot start a conversation on your own request" },
          { status: 400 }
        );
      }

      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          requestId,
          volunteerId,
        },
      });
    }

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error("Failed to process conversation:", error);
    return NextResponse.json(
      { error: "Failed to process conversation" },
      { status: 500 }
    );
  }
}
