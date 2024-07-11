import { createSignal } from 'solid-js';
import toast from 'solid-toast';
import { CLOUD_API_KEY, CLOUD_NAME, CLOUD_PRESET } from '~/envs/cloudinary';
import { CLOUDINARY_PATH, CLOUDINARY_UPLOAD } from '~/constants/paths';
import { uploadFilesRequest } from './request/filesRequest';
import type { fileResponse } from './request/filesRequest';

const url = `${CLOUDINARY_PATH}${CLOUD_NAME}${CLOUDINARY_UPLOAD}`;

const useImageUploader = () => {
	const [uploading, setUploading] = createSignal(false);
	const [error, setError] = createSignal(false);
	const [uploadedFiles, setUploadedFiles] = createSignal<fileResponse | null>(null);
	const [uploadedCloudinaryUrls, setUploadedCloudinaryUrls] = createSignal<string[]>([]);

	const isFileSizeValid = (file: File) => {
		const MAX_SIZE_MB = 5;
		return file.size / 1024 / 1024 < MAX_SIZE_MB;
	};

	/**
	 * upload local images
	 * @param files FILE[]
	 */
	const uploadLocalImages = async (files: File[]) => {
		for (const file of files) {
			if (!isFileSizeValid(file)) {
				toast.error(`${file.name} supera los 5MB permitidos.`);
				return;
			}
		}

		setUploading(true);
		setError(false);

		const formData = new FormData();
		for (const file of files) {
			formData.append('files', file);
		}

		try {
			const responses = await uploadFilesRequest(formData);
			setUploadedFiles(responses);
		} catch (err) {
			setError(true);
		} finally {
			setUploading(false);
		}
	};

	/**
	 * upload cloudinary images
	 * @param files FILE[]
	 */
	const uploadCloudinaryImages = async (files: File[]) => {
		for (const file of files) {
			if (!isFileSizeValid(file)) {
				toast.error(`${file.name} supera los 5MB permitidos.`);
				return;
			}
		}

		setUploading(true);
		setError(false);

		try {
			const uploadPromises = files.map(file => {
				const formData = new FormData();
				formData.append('file', file);
				formData.append('upload_preset', CLOUD_PRESET);
				formData.append('api_key', CLOUD_API_KEY);

				return fetch(url, {
					method: 'POST',
					body: formData,
				})
					.then(response => {
						if (!response.ok) {
							throw new Error('Error al subir a cloudinary');
						}
						return response.json();
					})
					.then(data => data.secure_url);
			});

			const urls = await Promise.all(uploadPromises);
			setUploadedCloudinaryUrls(urls);
		} catch (err) {
			setError(true);
		} finally {
			setUploading(false);
		}
	};

	return {
		uploadLocalImages,
		uploadCloudinaryImages,
		uploading,
		error,
		uploadedFiles,
		uploadedCloudinaryUrls,
	};
};

export default useImageUploader;
