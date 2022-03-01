import { RectConfig } from "konva/lib/shapes/Rect";
import { FC } from "react";
import { Rect } from "react-konva";
import { useRecoilValue } from "recoil";
import { UserInfoAtom } from "../../atoms/UserInfoAtom";
import { SHAPE_SIZE } from "./ShapeConsts";

export const MyRect: FC<RectConfig> = (props) => {
    const userInfo = useRecoilValue(UserInfoAtom)

    return <Rect 
        opacity={0.7} 
        fill={userInfo.color}
        width={SHAPE_SIZE}
        height={SHAPE_SIZE}
        {...props}
    />
}
