import React from 'react';
import Svg, {
  G,
  Ellipse,
  Defs,
  Filter,
  FeBlend,
  FeFlood,
  FeGaussianBlur,
} from 'react-native-svg';

// 메인 -> #FFBED4
// 노란색 -> #FFF1C5
const EllipseDeco = ({width = 677, height = 697, color = '#FFBED4'}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 678 697" fill="none">
      <G opacity="0.2" filter="url(#filter0_f_202_4)">
        <Ellipse cx="339" cy="348.5" rx="276" ry="285.5" fill={color} />
      </G>
      <Defs>
        <Filter
          id="filter0_f_202_4"
          x="0.5"
          y="0.5"
          width="677"
          height="696"
          filterUnits="userSpaceOnUse">
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <FeGaussianBlur
            stdDeviation="31.25"
            result="effect1_foregroundBlur_202_4"
          />
        </Filter>
      </Defs>
    </Svg>
  );
};

export default EllipseDeco;
