import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      console.log("GET /api/tasks: Unauthorized - No session email");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;

    console.log(`GET /api/tasks: Fetching tasks for email ${userEmail}`);

    const result = await turso.execute({
      sql: "SELECT * FROM tasks WHERE user_email = ? ORDER BY created_at DESC",
      args: [userEmail],
    });

    console.log(`GET /api/tasks: Found ${result.rows.length} tasks`);
    
    const tasks = result.rows.map(row => ({ ...row }));
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks: Error fetching tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, category, deadline } = await request.json();
    const id = uuidv4();
    
    await turso.execute({
      sql: "INSERT INTO tasks (id, title, category, deadline, user_email) VALUES (?, ?, ?, ?, ?)",
      args: [id, title, category, deadline, session.user.email],
    });
    
    return NextResponse.json({ id, title, category, deadline }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks: Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
