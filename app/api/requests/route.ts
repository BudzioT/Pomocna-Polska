import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/requests?status=OPEN
 * Returns help requests filtered by status, with author and volunteer info.
 * Defaults to returning all requests if no status filter provided.
 */
export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status");

  try {
    const where: Record<string, string> = {};
    if (status) {
      where.status = status;
    }

    const requests = await prisma.helpRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Failed to fetch requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
