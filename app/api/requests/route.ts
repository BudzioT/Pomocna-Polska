import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
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

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const body = await req.json();
    const { helpType, description, location, latitude, longitude } = body;

    if (!description?.trim()) {
      return NextResponse.json({ error: "Opis jest wymagany." }, { status: 400 });
    }

    const type = helpType === "remote" ? "REMOTE" : "IN_PERSON";
    let title = description.trim();
    if (title.length > 30) {
      title = title.substring(0, 30) + "...";
    }

    let finalLat = latitude ? parseFloat(latitude) : null;
    let finalLng = longitude ? parseFloat(longitude) : null;

    if (type === "IN_PERSON" && location && !finalLat && !finalLng && location !== "Moja bieżąca lokalizacja (GPS)") {
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(location)}`, {
          headers: { "User-Agent": "PomocnaPolskaApp/1.0" }
        });
        if (geoRes.ok) {
          const data = await geoRes.json();
          if (data && data.length > 0) {
            finalLat = parseFloat(data[0].lat);
            finalLng = parseFloat(data[0].lon);
          }
        }
      } catch (err) {
        console.error("Geocoding failed:", err);
      }
    }

    const request = await prisma.helpRequest.create({
      data: {
        title,
        description,
        type,
        address: location || null,
        latitude: finalLat && !isNaN(finalLat) ? finalLat : null,
        longitude: finalLng && !isNaN(finalLng) ? finalLng : null,
        status: "OPEN",
        category: "OTHER",
        authorId: userId,
      } as any
    });

    return NextResponse.json({ ok: true, id: request.id });
  } catch (error) {
    console.error("Failed to create request:", error);
    return NextResponse.json({ error: "Wystąpił błąd podczas dodawania prośby" }, { status: 500 });
  }
}

