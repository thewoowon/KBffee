declare module '@env' {
  export const FIREBASE_API_KEY: string;
  export const API_URL: string;
}

declare module '*.svg' {
  import {FC, SVGProps} from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

interface Attendance {
  created_at: string;
}

interface User {
  last_used: string;
  level: number;
  stamps: number;
  phase: 'americano' | 'beverage';
  americanoCoupons: number;
  beverageCoupons: number;
}

interface UserContext {
  selectedCoupon: {
    americano: number;
    beverage: number;
  };
  possibleCoupons: {
    americano: number;
    beverage: number;
  };
}

interface Store {
  last_logged: string;
}

interface Log {
  action: 'stamp_saved' | 'stamp_used';
  phone_number: string;
  timestamp: Date;
  stamp: number;
  note: string;
}

interface LogDto {
  action: 'stamp_saved' | 'stamp_used';
  phone_number: string;
  timestamp: Timestamp;
  stamp: number;
  note: string;
}

interface Session {
  isConfirmed: boolean;
  last_used: string;
  phone: string;
  mode: string;
}
