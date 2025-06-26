import { supabaseServer } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        {
          error: "Email, password, dan username diperlukan ",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan server";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
