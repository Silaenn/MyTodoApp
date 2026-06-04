import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await turso.execute({
      sql: "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
      args: [session.user.id],
    });
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, category, deadline } = await request.json();
    const id = uuidv4();
    
    await turso.execute({
      sql: "INSERT INTO tasks (id, title, category, deadline, user_id) VALUES (?, ?, ?, ?, ?)",
      args: [id, title, category, deadline, session.user.id],
    });
    
    return NextResponse.json({ id, title, category, deadline }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
