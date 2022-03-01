import { CircleConfig } from "konva/lib/shapes/Circle";
import { FC } from "react";
import { Circle } from "react-konva";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "../../atoms/UserInfoAtom";
import { SHAPE_SIZE } from "./ShapeConsts";


export const MyCircle: FC<CircleConfig> = (props) => {
    const userInfo = useRecoilValue(UserInfoAtom)

    return <Circle 
        opacity={0.7} 
        fill={userInfo.color}
        width={SHAPE_SIZE}
        height={SHAPE_SIZE}
        {...props}
        offset={{x: (props.offset?.x ?? 0) + SHAPE_SIZE / -2, y: (props.offset?.y ?? 0) + SHAPE_SIZE / -2}}
    />
}
