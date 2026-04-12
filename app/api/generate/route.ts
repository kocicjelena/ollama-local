import { NextRequest, NextResponse } from "next/server";
import type { GenerateRequest, GenerateResponse } from "@/lib/types/generate";
import { ApiError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body, stream: false }),
    });

    const data: GenerateResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
