import { createContext, SetStateAction } from "react";

export type Point = {
    x: number;
    y: number;
};

export const PointsContext = createContext<{
    points: Point[]
    setPoints: React.Dispatch<SetStateAction<Point[]>>
}>({
    points: [],
    setPoints: () => { }
});
