import React from 'react';
import Svg, {Path} from 'react-native-svg';

const LeftArrowIcon = ({width = 24, height = 24, color = 'black'}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
      fill="#1F1F1F"
    />
  </Svg>
);

export default LeftArrowIcon;
