import { FiTrash2 } from 'solid-icons/fi';
import { Show, createSignal } from 'solid-js';
import toast from 'solid-toast';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';

interface ImagePreviewSelectProps {
	onFileSelected: (file: File | null) => void;
	id: string;
	width?: string;
	height?: string;
}

const ImagePreviewSelect = (props: ImagePreviewSelectProps) => {
	const [, setImageFile] = createSignal<File | null>(null);
	const [imageUrl, setImageUrl] = createSignal<string>('');
	const [imageName, setImageName] = createSignal<string>('');

	const handleSelect = (event: Event) => {
		event.preventDefault();
		const target = event.target as HTMLInputElement;
		const file: File | null = target.files?.[0] ?? null;

		if (file) {
			if (validateImage(file)) {
				setImageFile(file);
				setImageName(file.name);
				const reader = new FileReader();
				reader.onload = e => {
					setImageUrl(e.target?.result as string);
				};
				reader.readAsDataURL(file);
				props.onFileSelected(file);
			} else {
				setImageFile(null);
				setImageUrl('');
				setImageName('');
				props.onFileSelected(null);
			}
		}
	};

	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		if (event.dataTransfer != null) {
			event.dataTransfer.dropEffect = 'copy';
		}
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		const file: File | null = event.dataTransfer?.files?.[0] ?? null;

		if (file) {
			if (validateImage(file)) {
				setImageFile(file);
				setImageName(file.name);
				const reader = new FileReader();
				reader.onload = e => {
					setImageUrl(e.target?.result as string);
				};
				reader.readAsDataURL(file);
				props.onFileSelected(file);
			} else {
				setImageFile(null);
				setImageUrl('');
				setImageName('');
				props.onFileSelected(null);
			}
		}
	};

	const validateImage = (file: File) => {
		const maxSize = 1024 * 1024 * 5;
		if (file.size > maxSize) {
			toast.error('Tamaño máximo permitido es de 5MB.');
			return false;
		}

		const validExtensions = ['jpeg', 'jpg', 'png'];
		const extension = file.name.split('.').pop()?.toLowerCase();
		if (!extension || !validExtensions.includes(extension)) {
			toast.error('Formatos permitidos: jpeg, jpg, png.');
			return false;
		}

		return true;
	};

	const handleRemoveImage = () => {
		setImageFile(null);
		setImageUrl('');
		setImageName('');
		props.onFileSelected(null);
	};

	return (
		<div
			class='my-4 border border-gray-300 p-4 rounded-md text-center flex flex-col justify-center items-center'
			style={{ width: props.width, height: props.height }}
			onDragOver={handleDragOver}
			onDrop={handleDrop}
		>
			<Input
				class='hidden'
				accept='image/jpeg, image/jpg, image/png'
				type='file'
				id={props.id}
				onChange={handleSelect}
			/>
			<Label for={props.id} class='block cursor-pointer w-full h-full'>
				<Show
					when={imageUrl()}
					fallback={<span class='text-gray-500'>Arrastra y suelta aquí o selecciona una imagen</span>}
				>
					<figure class='flex flex-col items-center justify-center w-full h-full'>
						<div class='w-full h-full flex items-center justify-center overflow-hidden'>
							<img
								src={imageUrl()}
								alt='Preview'
								class='object-contain'
								style={{ 'max-width': '100%', 'max-height': '100%' }}
							/>
						</div>
						<figcaption class='text-sm text-gray-500 mt-2'>{imageName()}</figcaption>
					</figure>
				</Show>
			</Label>
			<Show when={imageUrl()}>
				<div class='mt-2 flex justify-center w-full'>
					<Button class='bg-red-500 hover:bg-red-600' onClick={handleRemoveImage}>
						<FiTrash2 size={22} />
						<span class='xl:block'> Eliminar foto</span>
					</Button>
				</div>
			</Show>
		</div>
	);
};

export default ImagePreviewSelect;
