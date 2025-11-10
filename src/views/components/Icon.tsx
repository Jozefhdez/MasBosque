import Svg, { Path } from 'react-native-svg';
import { IconProps } from '../../models/IconPropsModel';

export const HomeIcon = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </Svg>
);

export const BackChevronIcon = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      d="M15.75 19.5 8.25 12l7.5-7.5" 
    />
  </Svg>
);