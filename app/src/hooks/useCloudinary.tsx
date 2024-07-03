import { createSignal } from "solid-js";
import { CLOUD_API_KEY, CLOUD_NAME, CLOUD_PRESET } from "~/utils/env";
import { CLOUDINARY_PATH, CLOUDINARY_UPLOAD } from "~/utils/paths";

const url = `${CLOUDINARY_PATH}${CLOUD_NAME}${CLOUDINARY_UPLOAD}`;

const useCloudinary = () => {
    const [isUploading, setIsUploading] = createSignal(false);
    const [uploadError, setUploadError] = createSignal<string | null>(null);

    const uploadImages = async (files: File[]) => {
        setIsUploading(true);
        setUploadError(null);

        try {
            const uploadPromises = files.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', CLOUD_PRESET);
                formData.append("api_key", CLOUD_API_KEY);

                return fetch(url, {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (!response.ok) {
                        throw new Error('Error al subir imagen a Cloudinary');
                    }
                    return response.json();
                }).then(data => data.secure_url);
            });

            const urls = await Promise.all(uploadPromises);
            setIsUploading(false);
            return urls;
        } catch (error) {
            setIsUploading(false);
            setUploadError(error instanceof Error ? error.message : "Error");
            return null;
        }
    };

    return { uploadImages, isUploading, uploadError };
};

export default useCloudinary;