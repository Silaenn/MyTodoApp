import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const result = await turso.execute("SELECT * FROM tasks ORDER BY created_at DESC");
    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, category, deadline } = await request.json();
    const id = uuidv4();
    
    await turso.execute({
      sql: "INSERT INTO tasks (id, title, category, deadline) VALUES (?, ?, ?, ?)",
      args: [id, title, category, deadline],
    });
    
    return NextResponse.json({ id, title, category, deadline }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
