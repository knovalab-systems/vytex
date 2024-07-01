import { createSignal } from "solid-js";
import { CLOUD_API_KEY, CLOUD_NAME, CLOUD_PRESET } from "~/utils/env";
import { CLOUDINARY_PATH, CLOUDINARY_UPLOAD } from "~/utils/paths";

const url = CLOUDINARY_PATH + CLOUD_NAME + CLOUDINARY_UPLOAD;

const useCloudinary = () => {
    const [isUploading, setIsUploading] = createSignal(false);
    const [uploadError, setUploadError] = createSignal<string | null>(null);


    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUD_PRESET);
        formData.append("api_key", CLOUD_API_KEY);

        setIsUploading(true);
        setUploadError(null);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                throw new Error('Failed to upload image');
            }

            setIsUploading(false);

            return data.secure_url;
        } catch (error) {
            setIsUploading(false);
            setUploadError(error instanceof Error ? error.message : "Error");
            return null;
        }
    };

    return { uploadImage, isUploading, uploadError };
};

export default useCloudinary;