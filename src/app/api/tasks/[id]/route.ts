import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // Build dynamic query to only update provided fields
    const updates: string[] = [];
    const args: (string | number | boolean | null)[] = [];

    if (body.title !== undefined) {
      updates.push("title = ?");
      args.push(body.title);
    }
    if (body.category !== undefined) {
      updates.push("category = ?");
      args.push(body.category);
    }
    if (body.deadline !== undefined) {
      updates.push("deadline = ?");
      args.push(body.deadline);
    }
    if (body.is_done !== undefined) {
      updates.push("is_done = ?");
      args.push(body.is_done ? 1 : 0); // Ensure boolean is stored as 0/1 for SQLite
    }

    if (updates.length === 0) {
      return NextResponse.json({ message: "No fields to update" });
    }

    args.push(id, session.user.id);

    await turso.execute({
      sql: `UPDATE tasks SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
      args,
    });

    return NextResponse.json({ message: "Task updated" });
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await turso.execute({
      sql: "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      args: [id, session.user.id],
    });
    return NextResponse.json({ message: "Task deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
