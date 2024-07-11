import { getEnv } from './getEnv';

export const ADMIN_ROLE: string = getEnv('VITE_ADMIN_ROLE');
export const NO_ROLE: string = getEnv('VITE_NO_ROLE');
export const DESIGNER_ROLE: string = getEnv('VITE_DESIGNER_ROLE');
