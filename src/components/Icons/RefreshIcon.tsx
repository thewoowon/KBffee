import React from 'react';
import Svg, {Path} from 'react-native-svg';

const RefreshIcon = ({width = 20, height = 20, color = 'black'}) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M16 9.2486C15.8166 7.92629 15.2043 6.70108 14.2575 5.76171C13.3107 4.82233 12.0818 4.22089 10.7603 4.05005C9.43869 3.87921 8.09772 4.14843 6.9439 4.81625C5.79009 5.48407 4.88744 6.51344 4.375 7.74579M4 4.74018V7.74579H7M4 10.7514C4.18342 12.0737 4.7957 13.2989 5.74252 14.2383C6.68934 15.1777 7.91818 15.7791 9.23975 15.9499C10.5613 16.1208 11.9023 15.8516 13.0561 15.1837C14.2099 14.5159 15.1126 13.4866 15.625 12.2542M16 15.2598V12.2542H13"
      stroke="#595959"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default RefreshIcon;
