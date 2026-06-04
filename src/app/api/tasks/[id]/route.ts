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
    const { title, category, deadline, is_done } = await request.json();

    await turso.execute({
      sql: `UPDATE tasks 
            SET title = COALESCE(?, title), 
                category = COALESCE(?, category), 
                deadline = COALESCE(?, deadline), 
                is_done = COALESCE(?, is_done) 
            WHERE id = ? AND user_id = ?`,
      args: [title, category, deadline, is_done, id, session.user.id],
    });

    return NextResponse.json({ message: "Task updated" });
  } catch {
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
