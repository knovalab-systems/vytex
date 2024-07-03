import { createSignal } from 'solid-js';
import { uploadFilesRequest } from './request/filesRequest';
import type { fileResponse } from './request/filesRequest';

type FileResponse = fileResponse;
type UploadError = string | null;

const useLocal = () => {
    const [uploading, setUploading] = createSignal(false);
    const [error, setError] = createSignal<UploadError>(null);
    const [uploadedFiles, setUploadedFiles] = createSignal<FileResponse[]>([]);

    const uploadImage = async (files: File[]) => {
        setUploading(true);
        setError(null);
        try {
            const formData = new FormData();

            for (const file of files) {
                formData.append("files", file);
            }

            const responses = await Promise.all(files.map(() => uploadFilesRequest(formData)));
            setUploadedFiles(responses);
        } catch (err) {
            console.error("Error al subir archivo", err);
            setError(`Error al subir archivo: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading, error, uploadedFiles };
};

export default useLocal;