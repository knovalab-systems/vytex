import { AiOutlineArrowsAlt, AiOutlineClose } from 'solid-icons/ai';
import { Show, createSignal } from 'solid-js';
import { Button } from './ui/Button';

interface ImageViewerProps {
    src: string;
    caption: string;
}

const ImageViewer = (props: ImageViewerProps) => {
    const [isLarge, setIsLarge] = createSignal(false);

    const toggleLargeView = () => {
        setIsLarge(!isLarge());
    };

    const closeLargeView = (e: MouseEvent) => {
        if ((e.target as HTMLElement).id === 'large-view-container') {
            setIsLarge(false);
        }
    };

    return (
        <div class='border-dashed border-[3px] border-slate-200 text-gray-500 cursor-pointer w-full h-full p-4 rounded-md text-center flex flex-col justify-center items-center hover:border-slate-400 focus-within:border-sky-600/50'>
            <figure class='flex flex-col items-center justify-center w-full h-full'>
                <div class='w-full h-full flex items-center justify-center overflow-hidden'>
                    <img src={props.src} alt='Preview' class='object-contain max-w-[300px] max-h-[300px]' />
                </div>
                <figcaption class='text-sm text-gray-500 my-2'>
                    {props.caption}
                </figcaption>
                <Button variant='ghost' class='inline-flex gap-2 p-2 pr-3 min-w-16' onClick={toggleLargeView}>
                    Expandir
                    <AiOutlineArrowsAlt size={23} />
                </Button>
            </figure>

            <Show when={isLarge()}>
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                <div id='large-view-container' class='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'
                    onClick={closeLargeView}
                >
                    <div class='relative'>
                        <img src={props.src} alt='Large Preview' class='object-contain max-w-[60vw] max-h-[60vh]' />
                        <Button variant='destructive' onClick={toggleLargeView} class='absolute top-2 right-2 p-2 gap-2' >
                            Cerrar
                            <AiOutlineClose size={23} />
                        </Button>
                    </div>
                </div>
            </Show>
        </div>
    );
};

export default ImageViewer;