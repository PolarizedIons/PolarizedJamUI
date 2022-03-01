import { CircleConfig } from "konva/lib/shapes/Circle";
import { RectConfig } from "konva/lib/shapes/Rect";
import { FC } from "react";
import { MyCircle } from "./MyCircle";
import { MyRect } from "./MyRect";

export type SHAPE_TYPES = "Rect" | "Circle";

export interface SHAPE_CONFIGS {
    "Rect": RectConfig,
    "Circle": CircleConfig,
}

type SHAPE_COMPONENTS_TYPE = {
    [T in SHAPE_TYPES]: FC<SHAPE_CONFIGS[T]>
}

export const SHAPE_COMPONENTS: SHAPE_COMPONENTS_TYPE = {
    "Rect": MyRect,
    "Circle": MyCircle,
}
