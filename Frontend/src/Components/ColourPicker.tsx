import * as THREE from "three";
import {Vector2} from "three";

interface colourPickerProps {
  camera:THREE.Camera;
  graph:THREE.Object3D;

  renderer:THREE.WebGLRenderer;

  labelCallback:(s:string)=>any;
}

export class ColourPicker {
  private raycaster:THREE.Raycaster = new THREE.Raycaster();

  private camera:THREE.Camera;
  private graph:THREE.Object3D;
  private renderer:THREE.WebGLRenderer;

  private callback:(s:string)=>any;

  constructor(props:colourPickerProps) {
    this.camera = props.camera;
    this.graph = props.graph;
    this.renderer = props.renderer;

    this.callback = props.labelCallback;
    
    window.addEventListener('pointerdown', (e) => {
      this.raycastGraph(new Vector2(e.x, e.y));
    });
    window.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches[0];
      this.raycastGraph(new Vector2(touch.clientX, touch.clientY));
    })
  }

  private pointerWithinCanvas = (e:Vector2) => {
    const rect:DOMRect = this.renderer.domElement.getBoundingClientRect();
    const x = (e.x - rect.x) / rect.width * 2 - 1;
    const y = (e.y - rect.y) / rect.height * - 2 + 1;
    return new Vector2(x,y);
  }

  public raycastGraph = (pos:Vector2) => {
    const mousePos = this.pointerWithinCanvas(pos);
    this.raycaster.setFromCamera(
      mousePos,
      this.camera,
    )
    const obj = this.raycaster.intersectObject(this.graph);
    if (obj.length > 0) {
      this.callback(`HSL(${Math.round(obj[0].uv!.x * 360)}, 100, ${Math.round(obj[0].uv!.y * 100)})`);
    }
  }
}