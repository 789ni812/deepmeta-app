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
    const { id, text, done, order }: TaskType = task;


  
  const doneMutation = api.task.toggle.useMutation({
    onSuccess: () => {
      toast.success("Task status updated");
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
      setLocalTasks(currentTasks => 
        currentTasks.filter(t => t.id !== id)
      );
    },
    onError: () => {
      toast.error("Error deleting task");
    },
  });

  const handleCheckboxChange = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation();
    doneMutation.mutate({ id, done: (e as React.ChangeEvent<HTMLInputElement>).target.checked });
  };

  const handleDeleteClick = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };


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
        <span>☰</span>
      </div>
      <div className="flex my-3 items-center">
        <input
          className="cursor-pointer w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-green-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-green-600 dark:ring-offset-gray-800"
          type="checkbox" name="done" id={`checkbox-${id}`} checked={done}
          onChange={handleCheckboxChange}
        />
        <label htmlFor={`checkbox-${id}`} className={`cursor-pointer ${done ? "line-through" : ""}`}>
          {text} - order: {order}
        </label>
      </div>
      <button
        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-1 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        onClick={handleDeleteClick}
      >
        Delete
      </button>
    </div>
  );
}
