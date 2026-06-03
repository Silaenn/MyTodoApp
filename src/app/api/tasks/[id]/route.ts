import { turso } from "@/lib/turso";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, category, deadline, is_done } = await request.json();

    await turso.execute({
      sql: `UPDATE tasks 
            SET title = COALESCE(?, title), 
                category = COALESCE(?, category), 
                deadline = COALESCE(?, deadline), 
                is_done = COALESCE(?, is_done) 
            WHERE id = ?`,
      args: [title, category, deadline, is_done, id],
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
    const { id } = await params;
    await turso.execute({
      sql: "DELETE FROM tasks WHERE id = ?",
      args: [id],
    });
    return NextResponse.json({ message: "Task deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
