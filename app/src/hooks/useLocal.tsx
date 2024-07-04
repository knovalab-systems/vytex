import { createSignal } from 'solid-js';
import { uploadFilesRequest } from './request/filesRequest';
import type { fileResponse } from './request/filesRequest';

const useLocal = () => {
    const [uploading, setUploading] = createSignal(false);
    const [error, setError] = createSignal(false);
    const [uploadedFiles, setUploadedFiles] = createSignal<fileResponse>();

    const uploadImage = async (files: File[]) => {
        setUploading(true);
        setError(false);
        try {
            const formData = new FormData();

            for (const file of files) {
                formData.append("files", file);
            }

            const responses = await uploadFilesRequest(formData);
            setUploadedFiles(responses);
        } catch (err) {
            console.error("Error al subir archivo", err);
            setError
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading, error, uploadedFiles };
};

export default useLocal;