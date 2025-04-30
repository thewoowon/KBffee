import React from 'react';
import Svg, {Path} from 'react-native-svg';

const LeftBigArrowIcon = ({width = 57, height = 57, color = '#4B4D55'}) => (
  <Svg width={width} height={height} viewBox="0 0 57 57" fill="none">
    <Path
      d="M14.5 28.5H42.5M14.5 28.5L26.5 40.5M14.5 28.5L26.5 16.5"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default LeftBigArrowIcon;
