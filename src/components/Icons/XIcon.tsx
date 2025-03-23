import React from 'react';
import Svg, {Path} from 'react-native-svg';

const XIcon = ({width = 12, height = 12, color = 'black'}) => (
  <Svg width={width} height={height} viewBox="0 0 12 12" fill="none">
    <Path
      d="M1 1L11 11M1 11L11 1"
      stroke="#191D2B"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </Svg>
);

export default XIcon;
