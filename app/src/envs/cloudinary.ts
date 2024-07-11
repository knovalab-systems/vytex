import { getEnv } from './getEnv';

export const CLOUD_NAME: string = getEnv('VITE_CLOUDINARY_CLOUD_NAME');
export const CLOUD_PRESET: string = getEnv('VITE_CLOUDINARY_UPLOAD_PRESET');
export const CLOUD_API_KEY: string = getEnv('VITE_CLOUDINARY_APY_KEY');
