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
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Item from './ItemToSort';

import { Task as TaskComponent } from './Task';

export function TestSorting() {
    const { data: tasks, isLoading, isError } = api.task.all.useQuery();
    const { mutate: updateTaskOrder } = api.task.updateOrder.useMutation();

    const [activeId, setActiveId] = useState(null);
    const [localTasks, setLocalTasks] = useState([]);

    useEffect(() => {
      if (tasks) {
        setLocalTasks(tasks.sort((a, b) => a.order - b.order));
      }
    }, [tasks]);

    function handleDragStart(event) {
        const { active } = event;
        setActiveId(active.id);
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        if (active.id !== over.id) {
            setLocalTasks(currentItems => {
                const oldIndex = currentItems.findIndex(item => item.id === active.id);
                const newIndex = currentItems.findIndex(item => item.id === over.id);
                const reorderedItems = arrayMove(currentItems, oldIndex, newIndex);
                // Prepare the data for updating the order in the database
                const updatedOrder = reorderedItems.map((item, index) => ({
                    id: item.id,
                    order: index
                }));
                // Update the order on the server
                updateTaskOrder(updatedOrder);
                return reorderedItems;
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
                {activeId ? <Item id={activeId} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
