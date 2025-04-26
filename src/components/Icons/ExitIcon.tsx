import React from 'react';
import Svg, {Path} from 'react-native-svg';

const ExitIcon = ({width = 20, height = 20, color = '#63656D'}) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M11.6667 6.66634V4.99967C11.6667 4.55765 11.4911 4.13372 11.1785 3.82116C10.866 3.5086 10.442 3.33301 10 3.33301H4.16667C3.72464 3.33301 3.30072 3.5086 2.98816 3.82116C2.67559 4.13372 2.5 4.55765 2.5 4.99967V14.9997C2.5 15.4417 2.67559 15.8656 2.98816 16.1782C3.30072 16.4907 3.72464 16.6663 4.16667 16.6663H10C10.442 16.6663 10.866 16.4907 11.1785 16.1782C11.4911 15.8656 11.6667 15.4417 11.6667 14.9997V13.333"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7.5 10H17.5M17.5 10L15 7.5M17.5 10L15 12.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ExitIcon;
