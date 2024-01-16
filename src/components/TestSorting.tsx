import React, {useEffect, useState} from 'react';
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

import {SortableItem} from './SortableItem';
import Item from './ItemToSort';

export function TestSorting() {
    const { data: tasks, isLoading, isError } = api.task.all.useQuery();
    const [activeId, setActiveId] = useState(null);
    const [localTasks, setLocalTasks] = useState([]);

    useEffect(() => {
      if (tasks) {
        setLocalTasks(tasks.sort((a, b) => a.order - b.order));
      }
    }, [tasks]);

 // Sort tasks based on their 'order' property
 const sortedTasks = tasks?.sort((a, b) => a.order - b.order);

 const sensors = useSensors(
   useSensor(PointerSensor),
   useSensor(KeyboardSensor, {
     coordinateGetter: sortableKeyboardCoordinates,
   })
 );

 useEffect(() => {
    console.log("Updated tasks:", tasks);
  }, [tasks]);
  

 if (isLoading) return <div>Loading...</div>;
 if (isError) return <div>Error fetching tasks</div>;

 
 console.log("Tasks:", tasks);

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={sortedTasks.map(task => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {sortedTasks.map(task => <SortableItem key={task.id} id={task.id} task={task} />)}
      </SortableContext>
      <DragOverlay>
        {activeId ? <Item id={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
  
  function handleDragStart(event) {
    const {active} = event;
    
    setActiveId(active.id);
  }
  
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setLocalTasks((currentItems) => {
        const oldIndex = currentItems.findIndex(item => item.id === active.id);
        const newIndex = currentItems.findIndex(item => item.id === over.id);

        const reorderedItems = arrayMove(currentItems, oldIndex, newIndex);
        // Update the order on the server here
        // For example: updateTaskOrder(reorderedItems);
        return reorderedItems;
      });
    }

    setActiveId(null);
  }
}