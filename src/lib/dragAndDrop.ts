import { Task } from "@/lib/types";
import { supabase } from "@/lib/supabase";

export function reorderTasks(
  tasks: Task[],
  sourceId: number,
  destinationId: number
): Task[] {
  const sourceIndex = tasks.findIndex((task) => task.id === sourceId);
  const destinationIndex = tasks.findIndex((task) => task.id === destinationId);
  const reorderedTasks = Array.from(tasks);
  const [movedTask] = reorderedTasks.splice(sourceIndex, 1);
  reorderedTasks.splice(destinationIndex, 0, movedTask);
  return reorderedTasks.map((task, index) => ({ ...task, order: index }));
}

export async function updateTaskOrder(tasks: Task[]) {
  await Promise.all(
    tasks.map((task) =>
      supabase.from("tasks").update({ order: task.order }).eq("id", task.id)
    )
  );
}
