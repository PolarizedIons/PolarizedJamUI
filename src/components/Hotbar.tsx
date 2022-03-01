import { KonvaEventObject } from "konva/lib/Node";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Rect } from "react-konva";
import { useSetRecoilState } from "recoil";
import { MyCircle } from "./Shapes/MyCircle";
import { MyRect } from "./Shapes/MyRect";
import { ShapeRenderer } from "./Shapes/ShapeRenderer";
import { SHAPE_TYPES } from "./Shapes/ShapeTypes";
import {v4 as uuid} from 'uuid';
import { Stage } from "konva/lib/Stage";

const HOTBAR_WIDTH = 800;
const HOTBAR_HEIGHT = 150;
const HOTBAR_BORDER_RADIUS = 20;
const ITEM_SIZE = 160;

type Props = {
    stageRef?: Stage;
    onPlace: (id: string, type: SHAPE_TYPES, x: number, y: number) => void;
}

export const Hotbar: FC<Props> = (props) => {
    const {onPlace, stageRef} = props;
    const [stageOffset, setStageOffset] = useState({x: 0, y: 0});
    const [draggingShape, setDraggingShape] = useState<{initialX: number, initialY: number, type: SHAPE_TYPES} | null>(null);

    const onDragEnd = useCallback((e: KonvaEventObject<DragEvent>, type: SHAPE_TYPES, initialX: number, initialY: number)=> {
        onPlace(uuid(), type, e.target.x(), e.target.y());
        e.target.x(initialX);
        e.target.y(initialY);
        setDraggingShape(null);
    }, []);

    const calcInitialPos = useCallback((i: number) => {
        const x = (window.innerWidth - HOTBAR_WIDTH) / 2 + (i * (ITEM_SIZE  + 60) + 60);
        const y = window.innerHeight - (HOTBAR_HEIGHT * 4 / 5);
        return {x, y};
    }, [])

    const components = useMemo<Record<SHAPE_TYPES, FC<any>>>(()=> ({
        'Rect': (props: any) => <MyRect {...props} />,
        'Circle': (props: any) => <MyCircle {...props} />,
    }), []);

    useEffect(() => {
        const handler = (e: KonvaEventObject<DragEvent>) => {
            if (e.target === e.currentTarget) {
                setStageOffset({x: e.target.x(), y: e.target.y()});
            }
        };

        stageRef?.on('dragmove', handler);

        return () => {
            stageRef?.off('dragmove', handler)
        };
    }, [stageRef])

    return <>
        <Rect 
            x={((window.innerWidth - HOTBAR_WIDTH) / 2)}
            y={window.innerHeight - HOTBAR_HEIGHT}
            width={HOTBAR_WIDTH}
            height={HOTBAR_HEIGHT + HOTBAR_BORDER_RADIUS}
            fill="#a1a1a1"
            cornerRadius={20}
            offset={stageOffset}
        />
        {Object.entries(components).map(([type, Component], i)=> {
            const {x, y} = calcInitialPos(i);
            return <Component 
                key={i}
                onDragStart={() => setDraggingShape({initialX: x, initialY: y, type: type as SHAPE_TYPES})}
                onDragEnd={(e: KonvaEventObject<DragEvent>) => onDragEnd(e, type as any, x, y)}
                draggable
                x={x}
                y={y}
                offset={stageOffset}
            />;
        }
        )}
        {draggingShape && <ShapeRenderer type={draggingShape.type} props={{x: draggingShape.initialX, y: draggingShape.initialY}} />}
    </>
}
