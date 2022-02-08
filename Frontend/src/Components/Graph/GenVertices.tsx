import { start } from "repl";
import * as THREE from "three";

interface Vector2 {
  x:number;
  y:number;
}

interface PolygonProps {
  sides: number;
  radius: number;
  top: "edge" | "vertex";
  height: number;
}

export const genPolygon = (props:PolygonProps):THREE.BufferGeometry => {
  const geom = new THREE.BufferGeometry();
  const verts:number[] = [0,0,0];
  const tris:number[] = [];

  const stepAngle = 2 * Math.PI / props.sides;
  const startAngle = props.top == "edge" ? stepAngle / 2 : 0;
  for (let theta = startAngle; theta < 2 * Math.PI; theta += stepAngle) {
    const x = props.radius * Math.sin(theta);
    const y = -props.radius * Math.cos(theta);
    verts.push(
      x,
      0,
      y,
      x,
      -props.height,
      y,
    );
  }
  for (let i = 1; i < props.sides-1; i++) {
    tris.push(
      1,
      i * 2 + 3,
      i * 2 + 1,
    )
  }

  for (let i = 0; i < props.sides-1; i++) {
    tris.push(
      i*2 + 3,
      i*2 + 2,
      i*2 + 1,
    )
    tris.push(
      i*2 + 3,
      i*2 + 4,
      i*2 + 2,
    )
  }
  tris.push(
    1,
    (props.sides)*2,
    (props.sides-1)*2+1,
  )
  tris.push(
    1,
    2,
    (props.sides)*2,
  )
  geom.setAttribute(
    'position', 
    new THREE.BufferAttribute(
      new Float32Array(verts),
      3
    )
  );

  geom.setIndex(tris);
  geom.computeVertexNormals();

  return geom;
}