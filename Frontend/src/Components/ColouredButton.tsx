import {HSL} from "../Components/Colour";
import { AnimatedBorder } from "./AnimatedBorder";
import "./ColouredButton.scss";

interface buttonProps {
  colour: HSL;
  side: "left" | "right";
  clickResult(colour:HSL): void;
}

export const ColouredButton = (props: buttonProps) => {
  const borderColor:HSL = {
    hue: props.colour.hue,
    saturation: props.colour.saturation,
    lightness: 70
  }
  return (
    <div 
      className="colour-button" 
      style={{
        backgroundColor: `hsl(
          ${props.colour.hue}, 
          ${props.colour.saturation}%, 
          ${props.colour.lightness}%
          )`,
      }}
      onClick={() => props.clickResult(props.colour)}
    >
      <AnimatedBorder 
        targetWidth={4}
        duration={0.3}
        flip={props.side != "left"}
        colour={borderColor}
      />
    </div>
  );
}