import * as THREE from 'three';

interface MeshProps {
  target:THREE.Object3D;

  targetHeight:number;
  bobAmplitude:number;

  bobSpeed:number;
  rotationSpeed:number;
}

export class BobbingObject {
  public target;

  public targetHeight:number;
  private bobAmplitude:number;

  private bobSpeed:number;
  private rotationSpeed:number;

  private time = 0;
  readonly TIME_DELTA = 0.05;


  constructor (props:MeshProps) {
    this.target = props.target;

    this.targetHeight=props.targetHeight;
    this.bobAmplitude = props.bobAmplitude;

    this.bobSpeed = props.bobSpeed;
    this.rotationSpeed = props.rotationSpeed;

    this.animation();
  }

  private animation = () => {
    requestAnimationFrame(this.animation);

    this.target.position.setY(this.targetHeight + this.bobAmplitude * Math.sin(this.time * this.bobSpeed));
    this.target.rotateY(this.rotationSpeed * this.TIME_DELTA);

    this.time += this.TIME_DELTA;
  }

  /*const animateCrown = () => {
          requestAnimationFrame(animateCrown);

          crown.position.setY(position.y + 3 + 2 * Math.sin(time));
          time += BOB_SPEED;

          crown.rotateY(ROTATION_SPEED);
        }*/
}