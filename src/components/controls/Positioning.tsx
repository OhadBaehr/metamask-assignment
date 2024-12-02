import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '@/store/storeContext';

// Define types for layout and wrapper items
type LayoutItem = {
  id: 'header' | 'wrapper';
  label: string;
  children?: string[];
};

type WrapperItem = {
  id: 'sidebar' | 'main';
  label: string;
};

export function Positioning() {
  const { store, setStore } = useContext(StoreContext);

  // State for layout and wrapper
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [wrapper, setWrapper] = useState<WrapperItem[]>([]);

  // Sync layout with isHeaderTop flag
  useEffect(() => {
    const updatedLayout: LayoutItem[] = store.isHeaderTop
      ? [
          { id: 'header', label: 'Header' },
          { id: 'wrapper', label: 'Wrapper', children: ['sidebar', 'main'] },
        ]
      : [
          { id: 'wrapper', label: 'Wrapper', children: ['sidebar', 'main'] },
          { id: 'header', label: 'Header' },
        ];
    setLayout(updatedLayout);
  }, [store.isHeaderTop]);

  // Sync wrapper with isSideNavLeft flag
  useEffect(() => {
    const updatedWrapper: WrapperItem[] = store.isSideNavLeft
      ? [
          { id: 'sidebar', label: 'Sidebar' },
          { id: 'main', label: 'Main Content' },
        ]
      : [
          { id: 'main', label: 'Main Content' },
          { id: 'sidebar', label: 'Sidebar' },
        ];
    setWrapper(updatedWrapper);
  }, [store.isSideNavLeft]);

  // Helper to move items within a list
  const reorderList = <T,>(list: T[], sourceIndex: number, destinationIndex: number): T[] => {
    const reordered = [...list];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(destinationIndex, 0, moved);
    return reordered;
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) return;

    if (type === 'LAYOUT') {
      const reordered = reorderList(layout, source.index, destination.index);
      setLayout(reordered);

      // Update `isHeaderTop` flag based on new position
      const headerIndex = reordered.findIndex((item) => item.id === 'header');
      setStore((prev) => ({ ...prev, isHeaderTop: headerIndex === 0 }));
    } else if (type === 'WRAPPER') {
      const reordered = reorderList(wrapper, source.index, destination.index);
      setWrapper(reordered);

      // Update `isSideNavLeft` flag based on new position
      const sidebarIndex = reordered.findIndex((item) => item.id === 'sidebar');
      setStore((prev) => ({ ...prev, isSideNavLeft: sidebarIndex === 0 }));
    }
  };

  // Helper to render draggable items
  const renderDraggableItem = (
    item: LayoutItem | WrapperItem,
    index: number
  ) => (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            padding: '16px',
            width: '100%',
            minWidth: '90px',
            flex: item.id === 'main' ? '1' : '0',
            border: '1px solid black',
            background: '#f9f9f9',
            borderRadius: '4px',
            ...provided.draggableProps.style,
          }}
        >
          <div style={{ marginBottom: '8px', fontWeight: '500' }}>{item.label}</div>
          {item.id === 'wrapper' && renderWrapper()}
        </div>
      )}
    </Draggable>
  );

  // Helper to render the wrapper
  const renderWrapper = () => (
    <Droppable droppableId="wrapper" direction="horizontal" type="WRAPPER">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{
            display: 'flex',
            fontSize: 13,
            gap: '2px',
            borderRadius: '4px',
            background: '#e9e9e9',
          }}
        >
          {wrapper.map((child, idx) => renderDraggableItem(child, idx))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="layout" direction="vertical" type="LAYOUT">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}
          >
            {layout.map((section, index) => renderDraggableItem(section, index))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
