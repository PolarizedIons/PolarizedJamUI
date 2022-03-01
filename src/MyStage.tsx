import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Text, Image} from 'react-konva'
import { Hotbar } from './components/Hotbar';
import { ShapeRenderer } from './components/Shapes/ShapeRenderer';
import { SHAPE_TYPES } from './components/Shapes/ShapeTypes';
import {v4 as uuid} from 'uuid';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { UserInfoAtom as UserInfoAtom } from './atoms/UserInfoAtom';
import { LiveHub } from './SignalR';
import { KonvaEventObject } from 'konva/lib/Node';
import { Stage } from 'konva/lib/Stage';
import useImage from 'use-image';
import cursorImg from './cursor.png';

var stringToColour = function(str: string) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

const RATE_LIMIT = 75;


type ShapeData = {
  shapes?: {
    type: SHAPE_TYPES,
    x: number;
    y: number;
    id: string;
  }[]
}

type NamesData = {
  username: string;
  x: number;
  y: number;
}

const MyStage: FC<{stageRef?: Stage}> = (props) => {
  const {stageRef} = props;
  const id = useMemo(() => location.hash.replace("#", ""), []);
  const [data, setData] = useState<ShapeData>({shapes: []});
  const [names, setNames] = useState<NamesData[]>([]);
  const hub = useRef<LiveHub | null>(null);

  const [cursor] = useImage(cursorImg);

  const [userInfo, setUserInfo] = useRecoilState(UserInfoAtom);

  const lastUpdate = useRef(new Date());
  const lastMove = useRef(new Date());

  useEffect(()=> {
    if (!id) {
      fetch('http://localhost:5000/Jam', {
        method: 'POST'
      })
        .then(res => res.json())
        .then(res => {
          location.href = location.href + "#" + res
          location.reload();
        });
    }
    else {
      let username = localStorage.getItem('username');
      while (!username) {
        username = prompt("Name?");
      }
      hub.current = new LiveHub(`http://localhost:5000/Jam/${id}/live`);
      hub.current.connect().then(() => {
        const updateHandler = (shapeId: string, shapeType: string, x: number, y: number) => {
            setData(prev => {
              const next = JSON.parse(JSON.stringify(prev)) as ShapeData;
              let found = false;
              for (const shape of next.shapes || []) {
                if (shape.id === shapeId) {
                  found = true;
                  shape.x = x;
                  shape.y = y;
                }
              }
              if (!found) {
                next.shapes?.push({id: shapeId, type: shapeType as SHAPE_TYPES, x, y})
              }
    
              return next;
            });
        };
    
        const moveHandler = (username: string, x: number, y: number) => {
          setNames(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as NamesData[];
            let found = false;
            for (const name of next) {
              if (name.username === username) {
                found = true;
                name.x = x;
                name.y = y;
              }
            }

            if (!found) {
              next.push({username, x, y});
            }

            return next;
          })
        };
    
        hub.current?.on('Update', updateHandler)
        hub.current?.on('Move', moveHandler)
      });  

      setUserInfo({name: username, color: stringToColour(username)});
      localStorage.setItem('username', username)

      fetch(`http://localhost:5000/Jam/${id}`)
        .then(res => res.json())
        .then(res => {
          setData(res.data);
        });

        return () => {
          hub.current?.disconnect(); 
        }
    }    
  }, [])

  useEffect(() => {    
    if (!stageRef) {
      return;
    }

    const hander = (e: KonvaEventObject<MouseEvent>) => {
      const shouldUpdate = (new Date().getTime() - lastMove.current.getTime()) > RATE_LIMIT;
      if (shouldUpdate) {
        hub.current?.invoke('Move', userInfo.name, e.evt.x, e.evt.y)
        lastMove.current = new Date();
      }
    }

    stageRef.on('mousemove', hander);
    return () => {
      stageRef.off('mousemove', hander);
    }
  }, [stageRef]);

  const onPlace = useCallback((id, type, x, y) => {
    const shouldUpdate = (new Date().getTime() - lastUpdate.current.getTime()) > RATE_LIMIT;
    if (shouldUpdate) {
      hub.current?.invoke('Update', id, type, x, y);
      lastUpdate.current = new Date();
    }

    setData(prev => ({
      ...prev,
      shapes: [
        ...(prev.shapes || []),
        {id, type, x, y}
      ]
    }));
  }, []);

  const onDrag = useCallback((e: KonvaEventObject<DragEvent>) => {
    const shouldUpdate = (new Date().getTime() - lastUpdate.current.getTime()) > RATE_LIMIT;
    console.log(new Date().getTime() - lastUpdate.current.getTime());
    
    
    if (shouldUpdate) {
      const type = data.shapes?.find(x => x.id === e.target.id())?.type;
      hub.current?.invoke('Update', e.target.id(), type, e.target.x(), e.target.y());
      lastUpdate.current = new Date();
    }
  }, [data])

  return (
    <Layer>
      {data.shapes?.map((shape, i) => (
        <ShapeRenderer key={i} type={shape.type} props={{x: shape.x, y: shape.y, id: shape.id, draggable: true, onDragMove:onDrag}}/>
      ))}
      {names.map((name, i) => <><Image image={cursor} x={name.x} y={name.y + 25} width={20} height={20} /><Text key={i} x={name.x + 15} y={name.y + 20} text={name.username} /></>)}
      <Hotbar onPlace={onPlace} stageRef={stageRef} />
    </Layer>
  )
}

export default MyStage;
