import { NextResponse } from "next/server";

const GHOST_SITE = "https://www.eliothectorson.com";
const CONTENT_API_KEY = "13fb83241bac28b7e283f1843f";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase() ?? "";

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    const payload = {
      email,
      emailType: "subscribe",
      labels: ["triviamoji"],
    };

    const endpoints = [
      `${GHOST_SITE}/members/api/send-magic-link/`,
      `${GHOST_SITE}/members/api/send-magic-link/?key=${CONTENT_API_KEY}`,
    ];

    let lastError = "Unable to subscribe right now.";

    for (const endpoint of endpoints) {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Version": "v5.0",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      if (response.ok) {
        return NextResponse.json({ message: "Success. Check your inbox to confirm your subscription." });
      }

      try {
        const errorJson = (await response.json()) as { errors?: Array<{ message?: string }> };
        lastError = errorJson.errors?.[0]?.message ?? lastError;
      } catch {
        // Ignore non-JSON errors.
      }
    }

    return NextResponse.json({ message: lastError }, { status: 502 });
  } catch {
    return NextResponse.json({ message: "Unexpected error while subscribing." }, { status: 500 });
  }
}
