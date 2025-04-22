import tailwindColors from 'tailwindcss/colors';

const colors: {[key:string]: string} = {
  // black: tailwindColors.black, // 0
  white: tailwindColors.white, // 1
  red: tailwindColors.red[600], // 2
  purple: tailwindColors.purple[500], // 3
  yellow: tailwindColors.yellow[500], // 4
  green: tailwindColors.green[600], // 5
  brown: tailwindColors.amber[500], // 6
  blue: tailwindColors.blue[500], // 7
  gray: tailwindColors.slate[500], // 8
  // silver: tailwindColors.zinc[500], // 9
  // lightRed: tailwindColors.red[300], // 10
  // lightPurple: tailwindColors.purple[300], // 11
  // cyan: tailwindColors.cyan[500], // 12
  // lightGreen: tailwindColors.lime[300], // 13
  // lightBrown: tailwindColors.amber[300], // 14
  // lightBlue: tailwindColors.blue[300], // 15
};

const randomColorPair = (): { color: string, otherColor: string } => {
  const colorValues = Object.values(colors);
  const colorRand = Math.floor(Math.random() * colorValues.length);
  const color: string = colorValues[colorRand];
  const otherColor = complementerColorOf(color);
  return {color, otherColor};
}

const complementerColorOf = (color: string): string => {
  const colorValues = Object.values(colors);
  const colorRand = colorValues.indexOf(color);
  const colorCount = Math.floor(Object.keys(colors).length/2);
  // return colorValues[colorRand < 8 ? colorRand + 8 : colorRand - 8];
  return colorValues[colorRand < colorCount ? colorRand + colorCount : colorRand - colorCount];
}

export {colors, randomColorPair, complementerColorOf};
