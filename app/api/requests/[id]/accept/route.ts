import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/requests/:id/accept
 * Body: { volunteerId: string }
 *
 * Accepts a help request: assigns the volunteer and transitions status to IN_PROGRESS.
 * Only works if the request is currently OPEN.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { volunteerId } = await request.json();

    if (!volunteerId) {
      return NextResponse.json(
        { error: "volunteerId is required" },
        { status: 400 }
      );
    }

    // Fetch the current request
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id },
    });

    if (!helpRequest) {
      return NextResponse.json(
        { error: "Help request not found" },
        { status: 404 }
      );
    }

    if (helpRequest.status !== "OPEN") {
      return NextResponse.json(
        { error: "This request is no longer open for acceptance" },
        { status: 409 }
      );
    }

    if (helpRequest.authorId === volunteerId) {
      return NextResponse.json(
        { error: "You cannot volunteer for your own request" },
        { status: 400 }
      );
    }

    // Transition to IN_PROGRESS with the assigned volunteer
    const updated = await prisma.helpRequest.update({
      where: { id },
      data: {
        volunteerId,
        status: "IN_PROGRESS",
      },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true },
        },
        volunteer: {
          select: { id: true, name: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to accept help request:", error);
    return NextResponse.json(
      { error: "Failed to accept help request" },
      { status: 500 }
    );
  }
}
