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

export const OpenEyeIcon = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <Path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" 
    />
  </Svg>
);

export const CloseEyeIcon = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" 
    />
  </Svg>
);

export const XIcon = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      d="M6 18 18 6M6 6l12 12" 
    />

  </Svg>
);

export const SOSButton = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 251 274" fill={color} stroke="none">
    <Path 
      d="M100.141 6.69874C115.611 -2.2329 134.671 -2.2329 150.141 6.69874L225.281 50.0812C240.751 59.0129 250.281 75.5192 250.281 93.3825V180.147C250.281 198.011 240.751 214.517 225.281 223.449L150.141 266.831C134.671 275.763 115.611 275.763 100.141 266.831L25 223.449C9.52991 214.517 -4.57764e-05 198.011 -4.57764e-05 180.147V93.3825C-4.57764e-05 75.5192 9.5299 59.0129 25 50.0812L100.141 6.69874Z" 
      fill="#BB0003"
    />
  </Svg>
);

export const SOSButtonDesign = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 162 162" fill="none">
    <Path 
      d="M80.5743 159.149C123.97 159.149 159.149 123.97 159.149 80.5743C159.149 37.1789 123.97 2 80.5743 2C37.1789 2 2 37.1789 2 80.5743C2 123.97 37.1789 159.149 80.5743 159.149Z" 
      stroke="#FAFAFF" 
      stroke-width="4"
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <Path 
      d="M80.5743 127.719C106.611 127.719 127.719 106.611 127.719 80.5743C127.719 54.537 106.611 33.4297 80.5743 33.4297C54.537 33.4297 33.4297 54.537 33.4297 80.5743C33.4297 106.611 54.537 127.719 80.5743 127.719Z" 
      stroke="#FAFAFF" 
      stroke-width="4" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
    <Path 
      d="M80.5743 96.2891C89.2533 96.2891 96.2891 89.2533 96.2891 80.5743C96.2891 71.8952 89.2533 64.8594 80.5743 64.8594C71.8952 64.8594 64.8594 71.8952 64.8594 80.5743C64.8594 89.2533 71.8952 96.2891 80.5743 96.2891Z" 
      stroke="#FAFAFF" 
      stroke-width="4" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
  </Svg>
);

export const Pencil = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" strokeWidth={2}>
    <Path 
      d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" 
    />
  </Svg>
);

export const MinusCircle = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
    />
  </Svg>
);

export const PlusCircle = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
    />

  </Svg>
);

export const UserIcon = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none" strokeWidth={2}>
    <Path 
      fill-rule="evenodd"
      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
      clip-rule="evenodd"
    />
  </Svg>
);

export const PinIcon = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" 
    />
    <Path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" 
    />
  </Svg>
);

export const BluetoothIcon = ({ size = 24, color = '#fafafa' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <Path 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      d="m8.25 4.5 7.5 7.5-7.5 7.5V4.5ZM12 12.75l3 3m-3-10.5 3 3" 
    />
  </Svg>
);