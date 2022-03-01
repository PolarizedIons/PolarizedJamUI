import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva'
import { Hotbar } from './components/Hotbar';
import { ShapeRenderer } from './components/Shapes/ShapeRenderer';
import { SHAPE_TYPES } from './components/Shapes/ShapeTypes';
import {v4 as uuid} from 'uuid';
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from 'recoil';
import MyStage from './MyStage';
import { Stage as KStage } from 'konva/lib/Stage';

type ShapeData = {
  shapes?: {
    type: SHAPE_TYPES,
    x: number;
    y: number;
    id: string;
  }[]
}

const App: FC = () => {
	const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()
  const [stageRef, setStageRef] = useState<KStage | null>(null);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} draggable ref={(ref) => setStageRef(ref)}>
      <RecoilBridge>
        <MyStage stageRef={stageRef || undefined} />
      </RecoilBridge>
    </Stage>
  )
}

export default App
