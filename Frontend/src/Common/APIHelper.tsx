import { HSL } from "../Components/Colour";

const apiURL = process.env.NODE_ENV == 'development' ?
  "http://localhost:5000/api/blueblue" :
  "http://bluestblue.co.uk/api/blueblue";

export const genUserID = ():Promise<number> => {
  return new Promise<number>((resolve, reject) => {
    fetch(`${apiURL}/userid`)
    .then((res) => res.text())
    .then((res) => {resolve(Number(res))});
  });
}

export const updateColour = (colour:HSL) => {
  fetch(`${apiURL}/addColour`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'userID': localStorage.getItem('userID')!,
      'hue': colour.hue,
      'sat': colour.saturation,
      'val': colour.lightness
    })
  });
}

interface HexGridProps{
  hues:number[];
  lightnesses:number[];
  hueDist:number;
  lightnessDist:number;
}

export const calcHexGrid = (props: HexGridProps):Promise<number[]> => {
  console.log("Calculating Hex Grid");
  return new Promise<number[]>((resolve, reject) => {fetch(`${apiURL}/getHexGrid`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'userID': localStorage.getItem('userID')!,
        'hue': props.hues.map(o=>o * 360),
        'lightness': props.lightnesses.map(o=>o*100),
        'hueDist': props.hueDist,
        'lightnessDist': props.lightnessDist,
      }),
    })
    .then((res) => res.json())
    .then((res) => {
      var r = res as number[];
      console.log(r.length);
      resolve(r)
    });
  });
}