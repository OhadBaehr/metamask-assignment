'use client';

import CanvasAnimator from '@/components/CanvasAnimator';
import DancingMetaMaskLogo from '@/components/DancingMetamaskLogo';
import { Center, Stack } from '@mantine/core';

export default function HomePage() {


  return (
    <Center h={'100%'} w={'100%'}>
      <CanvasAnimator />
      <Stack style={{position: 'absolute', pointerEvents: 'none'}} align="center">
        <DancingMetaMaskLogo />
      </Stack>
    </Center>
  );
}
