import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task as TaskType } from "../types";
import toast from "react-hot-toast";
import { api } from "../utils/api";

type TaskProps = {
  task: TaskType;
  setLocalTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
}

export function Task({ task, setLocalTasks }: TaskProps) {
  const { id, text, done, order } = task;

  // Define the mutations
  const doneMutation = api.task.toggle.useMutation({
    onSuccess: () => {
      toast.success("Task status updated");
      // Update local state
      setLocalTasks(currentTasks =>
        currentTasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
      );
    },
    onError: () => {
      toast.error("Error updating task status");
    },
  });

  const deleteMutation = api.task.delete.useMutation({
    onSuccess: () => {
      toast.success("Task deleted");
      // Update local state
      setLocalTasks(currentTasks => 
        currentTasks.filter(t => t.id !== id)
      );
    },
    onError: () => {
      toast.error("Error deleting task");
    },
  });

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    doneMutation.mutate({ id, done: e.target.checked });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  // Drag and drop handlers
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex gap-2 items-center justify-between">
      <div {...listeners} {...attributes} className="drag-handle">
        {/* Icon or element to use as the drag handle */}
        <span>☰</span>
      </div>
      <div className="flex gap-2 items-center">
        <input
          className="cursor-pointer w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
          type="checkbox" name="done" id={`checkbox-${id}`} checked={done}
          onChange={handleCheckboxChange}
        />
        <label htmlFor={`checkbox-${id}`} className={`cursor-pointer ${done ? "line-through" : ""}`}>
          {text} - order: {order}
        </label>
      </div>
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={handleDeleteClick}
      >
        Delete
      </button>
    </div>
  );
}
