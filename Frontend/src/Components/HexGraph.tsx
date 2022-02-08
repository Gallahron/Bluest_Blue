import * as THREE from "three";
import { BufferGeometry, Camera, Color, Vector2, Vector3 } from "three";
import * as BufferGeometryUtils from "../Common/BufferGeometryUtils";
import { genPolygon } from "./GenVertices";
import { calcHexGrid } from "../Common/APIHelper";
import './Graph.scss';
import {lerp } from "three/src/math/MathUtils";



interface Cell {
  hue:number;
  lightness:number;
  position:THREE.Vector3;
  dist:number;
  height?:number;
}

export class HexGraph {
  private cells:Cell[] = [];
  public offset:Vector3 = new Vector3();

  constructor () {
    const minHue:number = 180 / 360;
    const maxHue:number = 300 / 360;
  
    const minLightness:number = 0;
    const maxLightness:number = 1;
  
    const graphThickness:number = 25;
    const holeRad:number = 0;
  
    const sideLength = Math.sin(Math.PI / 3);

    for (let i = -30; i < 30; i++) {
      for (let j = -1; j > -30; j--) {
        const x = i * ( 2 + sideLength) + (j % 2) * 1.5;
        const y =  j * (sideLength);
        const dist = Math.sqrt(x * x + y * y);
        if (dist <= graphThickness + holeRad && dist >= holeRad) {
          this.cells.push({
            position:new THREE.Vector3(x, 0, y),
            hue: lerp(minHue, maxHue, Math.atan(x / y) / (Math.PI) + 1 / 2),
            lightness: maxLightness - (dist-holeRad) / graphThickness * (maxLightness - minLightness),
            dist: dist,
          });
        }
      }
    }
  }

  private genHexMesh = ():Promise<THREE.BufferGeometry> => {
    const maxHeight = 70;
    const hexRad = 4;
    const hexes:THREE.BufferGeometry[] = [];
  
    return new Promise<THREE.BufferGeometry>((resolve, reject) => {
      calcHexGrid({
        hues: this.cells.map(o=>o.hue),
        lightnesses: this.cells.map(o=>o.lightness),
        hueDist: 20,
        lightnessDist: 15,
      }).then(
        (heights) => {
          let max = 0;
          heights.forEach(element => {
            if (element > max) max = element
          });
          for (let i = 0; i < this.cells.length; i++) {
            const height = heights[i] / max * maxHeight;
            
            this.cells[i].height = height;

            let hex:THREE.BufferGeometry = genPolygon({sides: 6, top: "edge", radius: hexRad, height: height});
            const dx = this.cells[i].position.x * hexRad;
            const dy = this.cells[i].position.z * hexRad;
  
            const dist = Math.sqrt(dx * dx + dy * dy)
            hex.translate(dx,height,dy);
            const uvs:number[] = [];
            const uv2s:number[] = [];
            for (let j = 0; j < 13; j++) {
              uvs.push(this.cells[i].hue, this.cells[i].lightness);
              uv2s.push(i, height);
            }
            hex.setAttribute(
              'uv', 
              new THREE.BufferAttribute(
                new Float32Array(uvs),
                2
              )
            );
            hex.setAttribute(
              'uv2', 
              new THREE.BufferAttribute(
                new Float32Array(uv2s),
                2
              )
            );
            
            this.cells[i].position.set(dx, height, dy);
            hexes.push(hex);
          }
          const buffer:BufferGeometry = BufferGeometryUtils.mergeBufferGeometries(hexes);
          
          buffer.name = "Graph";

          buffer.computeBoundingBox();
          buffer.boundingBox?.getCenter(this.offset);
  
          buffer.center();
          buffer.translate(0,this.offset.y,0);
          resolve( buffer);
        }
      )
    });

  }

  public Make = ():Promise<THREE.Mesh> => {
    return new Promise((resolve, reject) => {
      this.genHexMesh().then(
        (geometry) => {
          var material = new THREE.ShaderMaterial({
            uniforms: {
              bboxMin: {
                value: geometry.boundingBox!.min
              },
              bboxMax: {
                value: geometry.boundingBox!.max
              }
            },
            vertexShader: `
              uniform vec3 bboxMin;
              uniform vec3 bboxMax;
            
              varying vec2 vUv;
          
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
              }
            `,
            fragmentShader: `
              uniform vec3 color1;
              uniform vec3 color2;
            
              varying vec2 vUv;
        
              vec3 HUEtoRGB(in float hue)
              {
                  vec3 rgb = abs(hue * 6. - vec3(3, 2, 4)) * vec3(1, -1, -1) + vec3(-1, 2, 2);
                  return clamp(rgb, 0., 1.);
              }
              
              vec3 HSLtoRGB(in vec3 hsl)
              {
                  vec3 rgb = HUEtoRGB(hsl.x);
                  float c = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
                  return (rgb - 0.5) * c + hsl.z;
              }
        
              void main() {
                gl_FragColor = vec4(HSLtoRGB(vec3(vUv.x, 1, vUv.y)), 1.0);
              }
            `,
          });
        
          resolve(new THREE.Mesh( geometry, material ));
        }
      )
    });
  }

  public GetHighestPoint = ():Vector3 => {
    if (this.cells[0].height === undefined) {
      console.log("Ensure that heights have been set");
      return new Vector3(0,0,0);
    }
    let heighest:Cell = this.cells[0];
    
    this.cells.forEach(
      cell => {
        heighest = cell.height! > heighest.height! ? cell : heighest;
      }
    );
    
    let out = heighest.position;
    
    out.x -= this.offset.x;
    out.y = heighest.height!;
    out.z -= this.offset.z;
    

    return out;
  }
}