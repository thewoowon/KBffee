import React from 'react';
import Svg, {Path} from 'react-native-svg';

const NewXIcon = ({width = 20, height = 20, color = 'black'}) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M15 4.99976L5 14.9998M5 4.99976L15 14.9998"
      stroke="#4E5056"
      strokeWidth="1.791"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default NewXIcon;
