import React from 'react';
import Svg, {Path} from 'react-native-svg';

const AmericanoIcon = ({width = 24, height = 24, color = '#ffffff'}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.5 3H6C4.9 3 4 3.9 4 5V10.71C4 14.54 6.95 17.89 10.78 18C14.74 18.12 18 14.94 18 11V10H18.5C20.43 10 22 8.43 22 6.5C22 4.57 20.43 3 18.5 3ZM16 5V8H6V5H16ZM18.5 8H18V5H18.5C19.33 5 20 5.67 20 6.5C20 7.33 19.33 8 18.5 8ZM5 19H19C19.55 19 20 19.45 20 20C20 20.55 19.55 21 19 21H5C4.45 21 4 20.55 4 20C4 19.45 4.45 19 5 19Z"
      fill={color}
    />
  </Svg>
);

export default AmericanoIcon;
