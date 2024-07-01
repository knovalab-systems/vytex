import { Show, createSignal } from 'solid-js';
import toast from 'solid-toast';
import useCloudinary from '~/hooks/useCloudinary';
import ImagePreviewSelect from '../../../components/ImagePreviewSelect';

const ImagesReference = () => {
    const [frontImage, setFrontImage] = createSignal<File | undefined>(undefined);
    const [backImage, setBackImage] = createSignal<File | undefined>(undefined);
    const { isUploading, uploadError, uploadImage } = useCloudinary();

    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        const frontImg = frontImage();
        const backImg = backImage();

        if (!frontImg || !backImg) {
            toast.error('Selecione ambas imágenes')
            return;
        }

        try {
            const [frontUrl, backUrl] = await Promise.all([
                uploadImage(frontImg),
                uploadImage(backImg),
            ]);

            if (uploadError()) {
                toast.error(uploadError());
                return;
            }

            toast.success('Images uploaded successfully');
            console.log('Front image url:', frontUrl);
            console.log('Back image url:', backUrl);

        } catch (error) {
            toast.error('Error en la subida de imágenes');
            console.error(error);
        }
    };

    return (
        <div class='flex justify-center space-x-4'>
            <div class='text-center'>
                <p class='mb-2'>Foto frontal</p>
                <ImagePreviewSelect
                    id='front'
                    onFileSelected={setFrontImage}
                    width='36rem'
                    height='36rem'
                />
            </div>
            <div class='text-center'>
                <p class='mb-2'>Foto posterior</p>
                <ImagePreviewSelect
                    id='back'
                    onFileSelected={setBackImage}
                    width='36rem'
                    height='36rem'
                />
            </div>
            <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleSubmit}
                disabled={isUploading()}
            >
                <Show when={isUploading()} fallback={'Guardar Imágenes'}>
                    Subiendo...
                </Show>
            </button>
        </div>
    );
};


export default ImagesReference;