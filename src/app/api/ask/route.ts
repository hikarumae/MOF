import { NextResponse } from "next/server";
import { auth } from "@/src/auth";

export async function GET(req: Request) {
  let session: any;

  try {
    session = await auth();
  } catch (e: any) {
    console.error("auth() failed:", e?.message ?? e, e?.stack);
    return NextResponse.json({ error: "auth() failed" }, { status: 500 });
  }

  console.log("BACKEND_API_URL:", process.env.BACKEND_API_URL ? "set" : "MISSING");
  console.log("BFF_BACKEND_SHARED_SECRET:", process.env.BFF_BACKEND_SHARED_SECRET ? "set" : "MISSING");

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const idToken = session?.idToken as string | undefined;

  // ★切り分けのため：idTokenが無い場合は「500」ではなく「401」に落とす（ログインやり直しを促す）
  if (!idToken) {
    console.warn("Missing idToken in session:", { hasUser: !!session?.user, email: session?.user?.email });
    return NextResponse.json({ error: "Missing idToken" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 });

  const backendBase = process.env.BACKEND_API_URL;
  if (!backendBase) {
    return NextResponse.json({ error: "BACKEND_API_URL is not set" }, { status: 500 });
  }

  const bffSecret = process.env.BFF_BACKEND_SHARED_SECRET;
  if (!bffSecret) {
    return NextResponse.json({ error: "BFF_BACKEND_SHARED_SECRET is not set" }, { status: 500 });
  }

  const url = `${backendBase.replace(/\/$/, "")}/ask?q=${encodeURIComponent(q)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${idToken}`,
        "x-bff-secret": bffSecret,
        // 切り分け用に残すなら両方
        "X-BFF-SECRET": bffSecret,
      },
      cache: "no-store",
    });
  } catch (e: any) {
    console.error("fetch backend failed:", url, e?.message ?? e);
    return NextResponse.json({ error: "fetch backend failed" }, { status: 502 });
  }

  const text = await res.text();

  // バックエンドのステータスをそのまま返す（ここ超重要）
  if (!res.ok) {
    return NextResponse.json(
      { error: `backend error: ${res.status}`, raw: text },
      { status: res.status }
    );
  }

  try {
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({ error: "Invalid JSON from backend", raw: text }, { status: 502 });
  }
}
