import { Accordion, Slider, InputLabel, Text } from '@mantine/core';
import { useContext, useMemo } from 'react';
import { StoreContext } from '@/store/storeContext';

export function SizesAccordion() {
    const { store, setStore } = useContext(StoreContext);

    const marks = useMemo(() => [
        { value: 0, label: 'xs' },
        { value: 25, label: 'sm' },
        { value: 50, label: 'md' },
        { value: 75, label: 'lg' },
        { value: 100, label: 'xl' },
    ], []);

    const marksMapping = useMemo(() => marks.reduce<Record<number, string>>((acc, m) => {
        acc[m.value] = m.label;
        return acc;
    }, {}), [marks]);

    const marksReverseMapping = useMemo(() => marks.reduce<Record<string, number>>((acc, m) => {
        acc[m.label] = m.value;
        return acc;
    }, {}), [marks]);
    return (
        <Accordion.Item value="Sizes">
            <Accordion.Control>
                <div>
                    <Text fw={500}>Sizes</Text>
                    <Text size="sm" c="dimmed" fw={400}>
                        Change the sizes of the app
                    </Text>
                </div>
            </Accordion.Control>
            <Accordion.Panel>
                <InputLabel>Topnav Size</InputLabel>
                <Slider
                    value={store.topnavHeight}
                    label={(value) => `${value}px`}
                    min={60}
                    max={100}
                    onChange={(value) => setStore((prev) => ({ ...prev, topnavHeight: value }))}
                />
                <InputLabel>Sidebar Size</InputLabel>
                <Slider
                    value={store.sideNavWidth}
                    label={(value) => `${value}px`}
                    min={270}
                    max={400}
                    onChange={(value) => setStore((prev) => ({ ...prev, sideNavWidth: value }))}
                />
                <InputLabel>Button Size</InputLabel>
                <Slider
                    h={30}
                    value={marksReverseMapping[store.buttonSize]}
                    marks={marks}
                    step={25}
                    label={(value) => marksMapping[value]}
                    onChange={(value) => setStore((prev) => ({ ...prev, buttonSize: marksMapping[value] }))}
                />
            </Accordion.Panel>
        </Accordion.Item>
    );
}
