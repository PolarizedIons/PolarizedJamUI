import { FC } from "react";
import { SHAPE_COMPONENTS, SHAPE_CONFIGS, SHAPE_TYPES } from "./ShapeTypes";

type Props = {
    [Key in SHAPE_TYPES]: {
        type: Key,
        props: SHAPE_CONFIGS[Key],
    }
}[SHAPE_TYPES]

export const ShapeRenderer: FC<Props> = (props) => {
    const Component = SHAPE_COMPONENTS[props.type];
    return <Component {...props.props} />
};
