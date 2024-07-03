import { uploadFiles } from '@vytex/client';
import { client } from '~/utils/client';

export async function uploadFilesRequest(formData: FormData) {
	console.log(formData);
	return await client.request(uploadFiles(formData));
}

export type fileResponse = Awaited<ReturnType<typeof uploadFilesRequest>>;
