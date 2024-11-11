import JSZip from 'jszip';
import { For, Show, createSignal, onCleanup, onMount } from 'solid-js';
import ImageViewer from '~/components/ImageViewer';
import { LabelSpan } from '~/components/ui/Label';
import type { GetReferenceImageType } from '../requests/referenceGet';

type ReferenceImagesProps = {
	pieces: GetReferenceImageType;
};

function ReferenceImages({ pieces }: ReferenceImagesProps) {
	const [frontImageUrl, setFrontImageUrl] = createSignal('');
	const [backImageUrl, setBackImageUrl] = createSignal('');
	const [pieceImageUrls, setPieceImageUrls] = createSignal<string[]>([]);

	onMount(async () => {
		try {
			const zipBlob = pieces as Blob;
			const zip = await JSZip.loadAsync(zipBlob);

			const tempPieceUrls: string[] = [];
			const objectUrls: string[] = [];

			for (const fileName in zip.files) {
				const file = zip.files[fileName];
				const fileContent = await file.async('blob');
				const url = URL.createObjectURL(fileContent);
				objectUrls.push(url);

				if (fileName.includes('front')) {
					setFrontImageUrl(url);
				} else if (fileName.includes('back')) {
					setBackImageUrl(url);
				} else {
					tempPieceUrls.push(url);
				}
			}

			setPieceImageUrls(tempPieceUrls);

			onCleanup(() => {
				objectUrls.forEach(URL.revokeObjectURL);
			});
		} catch (error) {
			console.error('Error loading images:', error);
		}
	});

	return (
		<div class='flex flex-row gap-2'>
			<div class='flex gap-2 w-1/2 h-fit'>
				<div class='text-center w-[26rem] h-[28rem] p-4 gap-2 bg-white flex flex-col rounded-md border border-gray-100 shadow-md'>
					<Show when={frontImageUrl()} fallback={<h1>Sin imagen</h1>}>
						<ImageViewer src={frontImageUrl()} caption='Foto frontal' />
					</Show>
				</div>
				<div class='text-center w-[26rem] h-[28rem] p-4 gap-2 bg-white flex flex-col rounded-md border border-gray-100 shadow-md'>
					<Show when={backImageUrl()} fallback={<h1>Sin imagen</h1>}>
						<ImageViewer src={backImageUrl()} caption='Foto posterior' />
					</Show>
				</div>
			</div>
			<div class='text-center w-full p-4 bg-white rounded-md border border-gray-100 shadow-md'>
				<LabelSpan>Piezas</LabelSpan>
				<div class='grid grid-cols-3 gap-2'>
					<For each={pieceImageUrls()}>
						{(url, index) => (
							<div class='mt-2 w-[20rem] h-[20rem]'>
								<ImageViewer src={url} caption={`Pieza ${index() + 1}`} />
							</div>
						)}
					</For>
				</div>
			</div>
		</div>
	);
}

export default ReferenceImages;
