import { Accordion, Text } from '@mantine/core';
import { Positioning } from './Positioning';

export function PositioningAccordion() {
    return (
        <Accordion.Item value="Positioning">
            <Accordion.Control>
                <div>
                    <Text fw={500}>Positioning</Text>
                    <Text size="sm" c="dimmed" fw={400}>
                        Change the positioning of the app
                    </Text>
                </div>
            </Accordion.Control>
            <Accordion.Panel>
                <Positioning />
            </Accordion.Panel>
        </Accordion.Item>
    );
}
