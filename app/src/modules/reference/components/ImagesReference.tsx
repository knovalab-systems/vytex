import { createSignal } from 'solid-js';
import ImagePreviewSelect from '../../../components/ImagePreviewSelect';

const ImagesReference = () => {
    const [, setFrontImage] = createSignal<File | null>(null);
    const [, setBackImage] = createSignal<File | null>(null);

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
        </div >
    );
};

export default ImagesReference;