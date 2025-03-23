import React from 'react';
import Svg, {Path} from 'react-native-svg';

const ShortRightArrowIcon = ({width = 20, height = 20, color = 'black'}) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M16 10H4M16 10L10.9474 15M16 10L10.9474 5"
      stroke="#3A3A3A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ShortRightArrowIcon;
