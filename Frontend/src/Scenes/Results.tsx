import React, { useState } from "react";
import { Graph } from "../Components/Graph";
import { RoundButton } from "../Components/RoundButton";
import './Results.scss';

export const Results = () => {
  let graph:Graph;
  const [hue, setHue] = useState("");

  return (
    <div className='result-container'>
      <a href="/">
        <RoundButton 
          className="back-button"
          text="<"
          onClick={o=>{}}
        />
      </a>
      <Graph ref={o => graph = o!}/>
    </div>
  );
}