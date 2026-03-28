import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/requests/:id
 * Returns a single help request with author and volunteer details.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            role: true,
          },
        },
        volunteer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    if (!helpRequest) {
      return NextResponse.json(
        { error: "Help request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(helpRequest);
  } catch (error) {
    console.error("Failed to fetch help request:", error);
    return NextResponse.json(
      { error: "Failed to fetch help request" },
      { status: 500 }
    );
  }
}
