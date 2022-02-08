import { useState } from "react";
import { ColouredButton } from "../Components/ColouredButton";
import { genRandomBlue } from "../Components/RandomColour";
import { HSL } from "../Components/Colour";
import "./ColourSelector.scss";
import { updateColour } from "../Common/APIHelper";
import { RoundButton } from "../Components/RoundButton";

const feedback = (side:string) => {
  alert(side);
}

export const ColourSelector = () => {
  const [leftColour, setLeftColour] = useState<HSL>(genRandomBlue());
  const [rightColour, setRightColour] = useState<HSL>(genRandomBlue());

  const updateColours = () => {
    setLeftColour(genRandomBlue());
    setRightColour(genRandomBlue());
  }

  const clickHandler = (colour:HSL) => {
    updateColour(
      colour
    );
    updateColours();
  }

  return (
    <div className="colour-selector">
      <ColouredButton 
        colour={leftColour} 
        side="left"
        clickResult={clickHandler}
      />
      <ColouredButton 
        colour={rightColour} 
        side="right"
        clickResult={clickHandler}
      />
      <a 
        className="result-button"
        href="/result"
      >
        <RoundButton
          text='Results'
          onClick={o => {
            
          }}
        />
      </a>
    </div>
  );
}