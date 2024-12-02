import { Accordion, ColorInput,Text } from '@mantine/core';
import { useContext } from 'react';
import { StoreContext } from '@/store/storeContext';

export function ColorsAccordion() {
    const { store, setStore } = useContext(StoreContext);

    return (
        <Accordion.Item value="Colors">
            <Accordion.Control>
                <div>
                    <Text fw={500}>Colors</Text>
                    <Text size="sm" c="dimmed" fw={400}>
                        Change the colors of the app
                    </Text>
                </div>
            </Accordion.Control>
            <Accordion.Panel>
                <ColorInput
                    label="Topnav Color"
                    value={store.topNavColor}
                    onChange={(value) => setStore({ ...store, topNavColor: value })}
                />
                <ColorInput
                    label="Button Color"
                    value={store.buttonColor}
                    onChange={(value) => setStore({ ...store, buttonColor: value })}
                />
                <ColorInput
                    label="Sidebar Color"
                    value={store.sideNavColor}
                    onChange={(value) => setStore({ ...store, sideNavColor: value })}
                />
                <ColorInput
                    label="Canvas Color"
                    value={store.canvasColor}
                    onChange={(value) => setStore({ ...store, canvasColor: value })}
                />
            </Accordion.Panel>
        </Accordion.Item>
    );
}
