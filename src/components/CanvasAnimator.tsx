import { Point, PointsContext } from "@/store/pointsContext";
import React, { useRef, useState, useEffect, MouseEvent, useCallback, useContext } from "react";

export const CanvasAnimator: React.FC = () => {
    const { setPoints } = useContext(PointsContext);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [startPoint, setStartPoint] = useState<Point | null>(null);
    const btcImage = useRef<HTMLImageElement | null>(null);
    const pointsRef = useRef<Point[]>([]); // Store all points while drawing
    const throttledPointsRef = useRef<Point[]>([]); // Throttled points for 60 FPS
    const lastCanvasSize = useRef<{ width: number; height: number; left: number; top: number } | null>(null);

    // Last timestamp for throttling
    const lastTimestampRef = useRef<number>(0);

    const adjustPointsForParentMovement = useCallback((newLeft: number, newTop: number) => {
        const lastSize = lastCanvasSize.current;
        if (!lastSize) return;

        const deltaX = newLeft - lastSize.left;
        const deltaY = newTop - lastSize.top;

        pointsRef.current = pointsRef.current.map((point) => ({
            x: point.x + deltaX,
            y: point.y + deltaY,
        }));

        throttledPointsRef.current = throttledPointsRef.current.map((point) => ({
            x: point.x + deltaX,
            y: point.y + deltaY,
        }));

        setPoints(throttledPointsRef.current);
    }, [setPoints]);

    const scalePoints = useCallback((newWidth: number, newHeight: number) => {
        const lastSize = lastCanvasSize.current;
        if (!lastSize) return;

        const { width: oldWidth, height: oldHeight, left: oldLeft, top: oldTop } = lastSize;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const scaleX = newWidth / oldWidth;
        const scaleY = newHeight / oldHeight;

        pointsRef.current = pointsRef.current.map((point) => ({
            x: point.x * scaleX - (rect.left - oldLeft),
            y: point.y * scaleY - (rect.top - oldTop),
        }));

        throttledPointsRef.current = throttledPointsRef.current.map((point) => ({
            x: point.x * scaleX - (rect.left - oldLeft),
            y: point.y * scaleY - (rect.top - oldTop),
        }));

        setPoints(throttledPointsRef.current);
    }, [setPoints]);

    const redrawLines = useCallback((ctx: CanvasRenderingContext2D) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(128, 128, 128, 0.1)";
        ctx.lineWidth = 3;
        ctx.beginPath();

        pointsRef.current.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });

        setPoints(throttledPointsRef.current); // Update context
        ctx.stroke();
    }, [setPoints]);

    const resizeCanvasToParent = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;

        if (canvas && container) {
            const { offsetWidth, offsetHeight } = container;
            const rect = container.getBoundingClientRect();
            const ctx = canvas.getContext("2d");

            if (lastCanvasSize.current) {
                // Call the position adjustment function
                adjustPointsForParentMovement(rect.left, rect.top);

                // Scale points based on the new size
                scalePoints(offsetWidth, offsetHeight);
            }

            canvas.width = offsetWidth;
            canvas.height = offsetHeight;
            lastCanvasSize.current = { width: offsetWidth, height: offsetHeight, left: rect.left, top: rect.top };

            if (ctx) redrawLines(ctx);
        }
    }, [adjustPointsForParentMovement, redrawLines, scalePoints]);

    const clearCanvas = (ctx: CanvasRenderingContext2D) => {
        const canvas = canvasRef.current;
        if (!canvas || !btcImage.current) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    useEffect(() => {
        const img = new Image();
        img.src = "/png-icons/btc.png";
        btcImage.current = img;

        const container = containerRef.current;
        const resizeObserver = new ResizeObserver(() => {
            resizeCanvasToParent();
        });

        if (container) {
            resizeObserver.observe(container);
        }

        return () => {
            if (container) {
                resizeObserver.unobserve(container);
            }
        };
    }, [resizeCanvasToParent]);

    const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (!isDrawing) {
            pointsRef.current = [];
            throttledPointsRef.current = [];
            clearCanvas(ctx);
            setStartPoint({ x, y });
            setIsDrawing(true);
        } else {
            redrawLines(ctx);
            setStartPoint(null);
            setIsDrawing(false);
        }
    };

    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !startPoint) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const now = performance.now();
        if (now - lastTimestampRef.current > 1000 / 300) {
            throttledPointsRef.current.push({ x, y });
            lastTimestampRef.current = now;
        }

        ctx.strokeStyle = `hsl(${Math.min(Math.max(70 - (y - startPoint.y) * 3, 0), 120)}, 100%, 50%)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        pointsRef.current.push({ x, y });
        setStartPoint({ x, y });
    };

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                position: "relative",
            }}
        >
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    cursor: `url(/png-icons/btc.png) 16 16, auto`,
                }}
            />
        </div>
    );
};

export default CanvasAnimator;
