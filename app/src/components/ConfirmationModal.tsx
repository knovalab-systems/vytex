import { createSignal } from 'solid-js';

interface ConfirmationModalProps {
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

const ConfirmationModal = (props: ConfirmationModalProps) => {
	const [show, setShow] = createSignal(true);

	const confirm = () => {
		props.onConfirm();
		setShow(false);
	};

	const cancel = () => {
		props.onCancel();
		setShow(false);
	};

	return (
		show() && (
			<div class='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
				<div class='p-6 bg-white rounded-lg shadow-gray-900 w-100'>
					<h1 class='text-center text-3xl font-semibold text-black'>{props.title}</h1>
					<p class='mt-2 text-xl text-black'>{props.message}</p>

					<div class='flex justify-between gap-4 mt-4'>
						<button
							type='button'
							class='px-4 py-2 text-black bg-gray-300 rounded-lg hover:bg-gray-400'
							onclick={cancel}
						>
							Cancelar
						</button>
						<button type='button' class='px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600' onclick={confirm}>
							Confirmar
						</button>
					</div>
				</div>
			</div>
		)
	);
};

export default ConfirmationModal;
