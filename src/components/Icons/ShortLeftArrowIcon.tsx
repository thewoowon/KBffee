import React from 'react';
import Svg, {Path} from 'react-native-svg';

const ShortLeftArrowIcon = ({width = 20, height = 20, color = 'black'}) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M4.53125 10H15.4688M4.53125 10L9.58388 15M4.53125 10L9.58388 5"
      stroke="#3A3A3A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ShortLeftArrowIcon;
