import { HSL } from "./Colour"

const randomBetweenValues = (min:number, max:number):number => {
  const diff:number = max - min;
  return Math.random() * diff + min;
}

export const genRandomBlue = ():HSL => {
  const result:HSL = {
    hue: randomBetweenValues(180, 300),
    saturation: 100,
    lightness: randomBetweenValues(20,80)
  };

  return result;
}