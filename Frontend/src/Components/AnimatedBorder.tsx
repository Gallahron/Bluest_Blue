import "./AnimatedBorder.scss"
import { useEffect } from "react";
import {HSL} from "./Colour";

interface borderProps {
  targetWidth:number;
  duration:number;
  flip:boolean;
  colour:HSL;
}

export const AnimatedBorder = (props:borderProps) => {
  let border:SVGSVGElement;
  const verticals:SVGPathElement[] = [];
  const horizontals:SVGPathElement[] = [];

  useEffect(() => {
    if (border !== undefined) {
      const bounds = border.getBoundingClientRect();
      const modifier = props.targetWidth / bounds.width;
      const modHeight = bounds.height * modifier;
      const ratio = bounds.height / bounds.width;
      horizontals.forEach(x => {
        x.setAttribute("stroke-width", props.targetWidth.toString());
        x.style.transition = `${props.duration}s`;
      })
      verticals.forEach(x => {
        x.setAttribute("stroke-width", modHeight.toString());
        x.style.transition = `${props.duration}s`;
      })
    }
  }, [])


  return (
      <svg
        className='animated-border'
        width='100%' 
        height='100%' 
        viewBox='0 0 100 100' 
        preserveAspectRatio="none"
        fill='none' 
        xmlns='http://www.w3.org/2000/svg'
        transform={`scale(${props.flip? "-1" : "1"},1)`}
        ref={(ref)=>{
          ref !== null && (border = ref);
        }} 
      >
        <g stroke={`hsl(
          ${props.colour.hue}, 
          ${props.colour.saturation}%, 
          ${props.colour.lightness}%
          )`}>
          <path 
            ref={(ref) => {
              ref !== null && verticals.push(ref);
            }}
            d='M0 0 l 0 100' 
            strokeLinecap='square' 
            strokeDasharray={200}
          /> 
          <path 
            ref={(ref) => {
              ref !== null && verticals.push(ref);
            }}
            d='M100 0 l 0 100' 
            strokeLinecap='square' 
            strokeDasharray={200}
          /> 
          <path 
            ref={(ref) => {
              ref !== null && horizontals.push(ref);
            }}
            d='M0 0 l 100 0' 
            strokeLinecap='square' 
            strokeDasharray={200}
          /> 
          <path 
            ref={(ref) => {
              ref !== null && horizontals.push(ref);
            }}
            d='M0 100 l 100 0' 
            strokeLinecap='square' 
            strokeDasharray={200}
          /> 
        </g>
      </svg>
  );
}