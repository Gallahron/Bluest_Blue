import * as THREE from 'three';
import {Vector3} from 'three';

interface CameraProps {
  fov?: number; 
  aspect?: number; 
  near?: number; 
  far?: number;

  position:Vector3;
}

export class OrbitCamera extends THREE.PerspectiveCamera {
  public rad = 0;
  public rot = 0;
  
  constructor (cameraProps:CameraProps) {
    super(
      cameraProps.fov, 
      cameraProps.aspect, 
      cameraProps.near, 
      cameraProps.far
    );
    
    const pos = cameraProps.position;
    this.position.set(pos.x, pos.y, pos.z);

    this.rad = Math.sqrt(Math.pow(this.position.x, 2) + Math.pow(this.position.z,2));
    this.rot = Math.PI/2;

    this.lookAt(new THREE.Vector3(0,0,0));
  }

  public Reposition = () => {
    this.position.set(
      this.rad * Math.cos(this.rot),
      this.position.y,
      this.rad * Math.sin(this.rot)
    );
    this.lookAt(new THREE.Vector3(0,0,0));
  }


}