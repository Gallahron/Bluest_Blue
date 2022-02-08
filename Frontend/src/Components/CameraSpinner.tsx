import { Vector2, Vector3 } from "three";
import * as THREE from "three";
import {OrbitCamera} from "./OrbitCamera";

interface SpinProps {
  camera:OrbitCamera;
  scene:THREE.Scene;
  renderer:THREE.WebGLRenderer;
}

export class CameraSpinner {
  private camera:OrbitCamera;
  private renderer:THREE.WebGLRenderer;
  private scene:THREE.Scene;

  private prevMousePos?:THREE.Vector2;
  private touchDown:boolean = false;

  private spinSpeed = 0;
  readonly drag = 0.05;
  
  private pointerWithinWindow = (e:Vector2) => {
    const x = (e.x) / window.innerWidth;
    const y = (e.y) / window.innerHeight;
    return new Vector2(x,y);
  }


  constructor (props:SpinProps) {
    this.camera = props.camera;
    this.renderer = props.renderer;
    this.scene = props.scene;


    window.addEventListener('pointerdown', (e) => {
      this.touchDown = true;
      //raycastGraph(new Vector2(e.x, e.y));
    });
    window.addEventListener('pointermove', (e) => {
      this.SpinGraph(new Vector2(e.x, e.y));
    });
    window.addEventListener('pointerup', (e) => {
      this.prevMousePos = undefined;
      this.touchDown = false;
    });
    window.addEventListener('touchstart', (e) => {
      this.touchDown = true;
      const touch = e.changedTouches[0];
      //this.raycastGraph(new Vector2(touch.clientX, touch.clientY));
    })
    window.addEventListener('touchmove', (e) => {
      const touch = e.changedTouches[0];
      this.SpinGraph(new Vector2(touch.clientX, touch.clientY));
    })
    window.addEventListener('touchend', (e) => {
      this.prevMousePos = undefined;
      this.touchDown = false;
    })
  }


  public SpinGraph = (pos:Vector2) => {
    if (!this.touchDown) return;

    const mousePos = this.pointerWithinWindow(pos);
    if (this.prevMousePos === undefined) {
      this.prevMousePos = mousePos;
      return;
    }

    const delta = mousePos.x - this.prevMousePos.x;
    this.prevMousePos.setX(mousePos.x);
    
    const prevSpeed = this.spinSpeed;
    if (Math.abs(delta) > Math.abs(prevSpeed)) {
      this.spinSpeed = delta;

      if (Math.abs(prevSpeed) < 0.0005) {
        this.animate();
      }
    }
    
  }

  private animate = () => {
    if (Math.abs(this.spinSpeed) < 0.0005) return;

    this.camera.rot += this.spinSpeed;
    this.spinSpeed *= 1-this.drag;

    this.camera.Reposition();

    requestAnimationFrame(this.animate);
    //this.renderer!.render(this.scene!, this.camera!);
  }
}