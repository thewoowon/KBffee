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
}

interface Store {
  last_logged: string;
}

interface Log {
  action: string;
  phone_number: string;
  timestamp: string;
}
