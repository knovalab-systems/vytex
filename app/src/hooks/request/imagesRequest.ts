import { uploadImages } from '@vytex/client';
import { client } from '~/lib/client';

export async function uploadImagesRequest(formData: FormData) {
	return await client.request(uploadImages(formData));
}

export type ImageResponse = Awaited<ReturnType<typeof uploadImagesRequest>>;
