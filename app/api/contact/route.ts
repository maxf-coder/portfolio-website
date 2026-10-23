import { NextResponse } from "next/server";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = { name: 80, email: 254, message: 5000 } as const;
const MAX_BODY_BYTES = 10_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

type Field = keyof typeof LIMITS;
type Code = "required" | "invalid" | "too_long";

const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 5000) {
    const oldest = hits.keys().next().value;
    if (oldest) hits.delete(oldest);
  }

  return false;
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return json({ ok: false, code: "forbidden" }, 403);
      }
    } catch {
      return json({ ok: false, code: "forbidden" }, 403);
    }
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, code: "invalid" }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ ok: false, code: "invalid" }, 413);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return json({ ok: false, code: "rate_limited" }, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, code: "invalid" }, 400);
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return json({ ok: false, code: "invalid" }, 400);
  }

  const data = body as Record<string, unknown>;

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  const fields: Partial<Record<Field, Code>> = {};

  if (!name) fields.name = "required";
  else if (name.length > LIMITS.name) fields.name = "too_long";

  if (!email) fields.email = "required";
  else if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) fields.email = "invalid";

  if (!message) fields.message = "required";
  else if (message.length > LIMITS.message) fields.message = "too_long";

  if (Object.keys(fields).length > 0) {
    return json({ ok: false, code: "invalid", fields }, 422);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is missing");
    return json({ ok: false, code: "send_failed" }, 500);
  }

  const to = process.env.CONTACT_TO ?? "max@maximf.com";
  const from = process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";
  const subject = `New message from ${name.replace(/[\r\n]+/g, " ")}`;

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      console.error("[contact] Resend responded", response.status, await response.text());
      return json({ ok: false, code: "send_failed" }, 500);
    }
  } catch (error) {
    console.error("[contact] Resend request failed", error);
    return json({ ok: false, code: "send_failed" }, 500);
  }

  return json({ ok: true });
}