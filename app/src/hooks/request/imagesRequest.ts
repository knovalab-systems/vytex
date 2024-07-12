import { uploadImages } from '@vytex/client';
import { client } from '~/utils/client';

export async function uploadImagesRequest(formData: FormData) {
	return await client.request(uploadImages(formData));
}

export type imageResponse = Awaited<ReturnType<typeof uploadImagesRequest>>;
