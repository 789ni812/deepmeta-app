import React, { useEffect, useState } from 'react';
import { api } from "~/utils/api";

import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Item from './ItemToSort';

import { type Task as TaskType } from "../types"; 
import { Task as TaskComponent } from './Task';

export function Tasks() {
    const { data: tasks, isLoading, isError } = api.task.all.useQuery();
    const { mutate: updateTaskOrder } = api.task.updateOrder.useMutation();

    const [activeId, setActiveId] = useState<number | null>(null); 
    const [localTasks, setLocalTasks] = useState<TaskType[]>([]); 

    useEffect(() => {
      if (tasks) {
        setLocalTasks([...tasks].sort((a, b) => a.order - b.order)); 
      }
    }, [tasks]);

    function handleDragStart(event: DragStartEvent) { 
        const { active } = event;
        setActiveId(active.id as number);
    }

    function handleDragEnd(event: DragEndEvent) { 
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setLocalTasks(currentItems => {
                const oldIndex = currentItems.findIndex((item) => item.id === active.id);
                const newIndex = currentItems.findIndex(item => item.id === over.id);
                const reorderedItems = arrayMove(currentItems, oldIndex, newIndex);
                const updatedOrder = reorderedItems.map((item, index) => ({
                    id: item.id,
                    order: index
                }));
                
                updateTaskOrder(updatedOrder);
                return [...reorderedItems];
            });
        }
        setActiveId(null);
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching tasks</div>;

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SortableContext items={localTasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
                {localTasks.map(task => (
                    <TaskComponent key={task.id} task={task} setLocalTasks={setLocalTasks} />
                ))}
            </SortableContext>
            <DragOverlay>
                {activeId ? <Item id={activeId.toString()} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
