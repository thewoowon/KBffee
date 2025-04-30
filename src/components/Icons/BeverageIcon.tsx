import React from 'react';
import Svg, {Path} from 'react-native-svg';

const BeverageIcon = ({width = 24, height = 24, color = '#ffffff'}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7.5 12H16.5L15.6 22H8.4L7.5 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 9H7C6.17157 9 5.5 9.67157 5.5 10.5C5.5 11.3284 6.17157 12 7 12H17C17.8284 12 18.5 11.3284 18.5 10.5C18.5 9.67157 17.8284 9 17 9Z"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M12 4C9.2385 4 7 6.2385 7 9H17C17 6.2385 14.7615 4 12 4Z"
      stroke={color}
      strokeWidth="2"
    />
    <Path d="M14 2L13 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export default BeverageIcon;
