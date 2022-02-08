import React from "react";
import { useEffect } from "react";
import * as THREE from "three";
import { BufferGeometry, Camera, Color, Vector2, Vector3 } from "three";
import * as BufferGeometryUtils from "../Common/BufferGeometryUtils";
import { calcHexGrid } from "../Common/APIHelper";
import { render } from "@testing-library/react";
import OxygenFontData from "@compai/font-oxygen-mono/data/typefaces/oxygen-mono-normal-400.json";
import { FontLoader } from "../Common/FontLoader";
import { TextGeometry } from "../Common/TextGeometry";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import CrownObj from '../assets/crown.obj';
import './Graph.scss';
import { inverseLerp, lerp } from "three/src/math/MathUtils";
import { HexGraph } from "./HexGraph";
import { OrbitCamera } from "./OrbitCamera";
import {CameraSpinner} from "./CameraSpinner";
import { ColourPicker } from "./ColourPicker";


interface animationProps {
  rad:number;
  rot:number;
  spinSpeed:number;
  drag: number;
}

interface IProps{}

interface IState {
  hueText:string;
}


export class Graph extends React.Component<IProps, IState>{
  private offset = new Vector3();

  mount?:HTMLDivElement;

  camera:OrbitCamera;
  renderer:THREE.WebGLRenderer;
  scene:THREE.Scene;
  
  spinHandler:CameraSpinner;
  colourPicker?:ColourPicker;
  
  constructor(props:IProps) {
    super(props);
    this.state = {
      hueText:"Click on a cell to see its colour",
    }

    this.scene = new THREE.Scene();
    this.camera = new OrbitCamera( 
      {
        fov:75, 
        aspect:1, 
        near:0.1, 
        far:1000,
        position: new Vector3(0, 150, 120),
      });
    this.renderer = new THREE.WebGLRenderer({alpha: true});

    this.spinHandler = new CameraSpinner({
      camera: this.camera,
      scene: this.scene,
      renderer: this.renderer,
    });

    const hexGraph = new HexGraph();

    hexGraph.Make().then(
      graph => {
        this.scene.add(graph);
        this.renderer.render(this.scene, this.camera);
        this.markHeighest(hexGraph);

        this.colourPicker = new ColourPicker({
          camera: this.camera,
          graph: graph,
          renderer: this.renderer,
          labelCallback: (s:string) => {
            this.setState((prev, props) => ({hueText:s}))
          }
        });
      }
    );

    
  }

  componentDidMount = () => {
    if (this.mount === undefined) {
      console.log("An unexpected error has occurred");
      return;
    }
    
    this.renderLoop();
    this.mount.appendChild(this.renderer.domElement );
  }

  private renderLoop = () => {    
    if (this.mount === undefined) {
      console.log("Ensure mount has been set");
      return;
    }

    requestAnimationFrame(this.renderLoop);

    let renderSize = new Vector2();
    this.renderer.getSize(renderSize);

    if (renderSize.x != this.mount.offsetWidth || renderSize.y != this.mount.offsetHeight) {
      this.renderer.setSize( this.mount.offsetWidth, this.mount.offsetHeight );

      const aspect = (this.mount.offsetWidth / this.mount.offsetHeight);
      this.camera.aspect = aspect;
      
      let lerpPerc = inverseLerp(0.85, 0, aspect) ;
      if (lerpPerc > 1) lerpPerc = 1;
      else if (lerpPerc < 0) lerpPerc = 0;

      this.camera.rad = lerp(120, 300, lerpPerc);
      this.camera.position.y = lerp(150, 375, lerpPerc); 

      this.camera.Reposition();

      this.camera.updateProjectionMatrix();
      this.renderer.setPixelRatio(window.devicePixelRatio);
    }

    this.renderer.render(this.scene, this.camera);
  }

  private markHeighest = (graph:HexGraph) => {
    const ROTATION_SPEED = 0.03;
    const BOB_SPEED = 0.05;

    let maxHeight = 0;
    let position:Vector3 = graph.GetHighestPoint();
    
    const loader = new OBJLoader();
    loader.load(CrownObj,
      o=>{
        let crown:THREE.Group=o;
        crown.traverse(o => {
          if (o instanceof THREE.Mesh) {
            o.material = new THREE.MeshBasicMaterial({color: 0xffff00});
          }
        })
        /*crown.position.set(
          position.x - this.offset.x,
          maxHeight + 3,
          position.z - this.offset.z
        );*/

        crown.position.set(
          position.x,
          position.y,
          position.z,
        )

        this.scene!.add(crown);
        
        let time:number = 0;
        const animateCrown = () => {
          requestAnimationFrame(animateCrown);

          crown.position.setY(position.y + 3 + 2 * Math.sin(time));
          time += BOB_SPEED;

          crown.rotateY(ROTATION_SPEED);
        }
        animateCrown();
        
      },
      o=>{},
      o=>{console.log(o)}
      );

  }
  

  public render = () => {
    return (
      <>
      <h1 className="colour-display">{this.state.hueText}</h1>
      <div 
        ref={ref => this.mount = ref!}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
      </>
    );
  }
}

/*this.scene.add(graph);

        this.markHeighest(cells);
          

        this.renderer.render( this.scene, this.camera );
  
        let rot = Math.PI / 2;
        let rad = Math.sqrt(Math.pow(this.camera.position.x, 2) + Math.pow(this.camera.position.z, 2));
      
        var raycaster = new THREE.Raycaster();

        

        

        */