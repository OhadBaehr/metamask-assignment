import { useEffect, useRef } from 'react';
import {throttle} from 'lodash';

export function useThrottledEffect(
    effect: () => void | (() => void),
    dependencies: unknown[],
    delay: number
): void {
    const effectRef = useRef(effect);
    const cleanupRef = useRef<(() => void) | void>();

    useEffect(() => {
        effectRef.current = effect;
    }, [effect]);

    useEffect(() => {
        const throttledEffect = throttle(() => {
            cleanupRef.current?.();
            cleanupRef.current = effectRef.current();
        }, delay);

        throttledEffect();

        return () => {
            throttledEffect.cancel();
            cleanupRef.current?.();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencies, delay]);
}
