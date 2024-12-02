'use client';

import { useRef, useContext, useMemo } from 'react';
import ModelViewer from '@metamask/logo';
import { PointsContext } from '@/store/pointsContext';
import { StoreContext } from '@/store/storeContext';
import { useThrottledEffect } from '@/helpers/hooks';

export default function DancingMetaMaskLogo() {
    const { store } = useContext(StoreContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<ReturnType<typeof ModelViewer> | null>(null);
    const userHoverRef = useRef<boolean>(false);
    const { points } = useContext(PointsContext);
    const mouseMoveIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useThrottledEffect(() => {
        if (!viewerRef.current) {
            const viewer = ModelViewer({
                pxNotRatio: true,
                width: 300,
                height: 300,
                followMouse: true,
                slowDrift: false,
            });
            viewerRef.current = viewer;
        }
    
        if (containerRef.current && !containerRef.current.contains(viewerRef.current!.container)) {
            // Append the viewer container only if it's not already appended
            containerRef.current.appendChild(viewerRef.current!.container);
        }
    
        if (!viewerRef.current.container) return;
    
        let boundingRect = viewerRef.current.container.getBoundingClientRect();
        const centerXRef = { current: boundingRect.left + boundingRect.width / 2 };
        const centerYRef = { current: boundingRect.top + boundingRect.height / 2 - 300 };
    
        let t = 0;
        let pointIndex = 0;
    
        const observer = new ResizeObserver(() => {
            boundingRect = viewerRef.current!.container.getBoundingClientRect();
            centerXRef.current = boundingRect.left + boundingRect.width / 2;
            centerYRef.current = boundingRect.top + boundingRect.height / 2 - 300;
        });
    
        observer.observe(viewerRef.current.container);
    
        mouseMoveIntervalRef.current = setInterval(() => {
            if (userHoverRef.current) return;
    
            let x, y;
    
            if (points.length > 0 && pointIndex < points.length) {
                const point = points[pointIndex];
                x = point.x + (!store.sideNavOpen || store.isSideNavLeft ? store.sideNavWidth : 0 );
                y = point.y;
                pointIndex = (pointIndex + 1) % points.length;
            } else {
                const amplitudeX = 300;
                const amplitudeY = 400;
    
                x = centerXRef.current + amplitudeX * Math.sin(t);
                y =
                    centerYRef.current +
                    amplitudeY *
                    (1 - Math.pow(Math.sin(t), 2));
    
                t += 0.06;
                if (t >= 2 * Math.PI) t = 0;
            }
    
            const event = new MouseEvent('mousemove', {
                clientX: x,
                clientY: y,
                bubbles: true,
                cancelable: true,
            });
    
            viewerRef.current!.container.dispatchEvent(event);
        }, 16);
    
        const handleMouseEnter = () => {
            userHoverRef.current = true;
        };
    
        const handleMouseLeave = () => {
            userHoverRef.current = false;
        };
    
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);
    
        const event = new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(event);
    
        return () => {
            if (viewerRef.current) {
                viewerRef.current.stopAnimation();
                viewerRef.current.container.remove();
            }
    
            if (mouseMoveIntervalRef.current) {
                clearInterval(mouseMoveIntervalRef.current);
            }
    
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [points, store.isSideNavLeft, store.sideNavOpen, store.sideNavWidth], 1000);
    


    const renderer = useMemo(() => {
        return <div ref={containerRef} />;
    }, []);

    return renderer;
}
