import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import toast from 'solid-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ImagePreviewSelect from '../ImagePreviewSelect';

// mocks
const fileSelected = vi.fn();
const mockFile = (name: string, size: number, type: string) => {
	const file = new File([new Blob(['a'.repeat(size)])], name, { type });
	Object.defineProperty(file, 'size', { get: () => size });
	return file;
};

describe('ImagePreviewSelect', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should render correctly', () => {
		render(() => <ImagePreviewSelect id='image' onFileSelected={fileSelected} />);

		const input = screen.getByText('Arrastra y suelta aquí o selecciona una imagen');
		expect(input).toBeInTheDocument();
	});

	it('should render delete botton', async () => {
		render(() => <ImagePreviewSelect id='image' onFileSelected={fileSelected} />);

		const file = mockFile('image.png', 1024 * 1024, 'image/png');
		const input = screen.getByLabelText('Arrastra y suelta aquí o selecciona una imagen');

		fireEvent.change(input, { target: { files: [file] } });

		await waitFor(() => {
			const img = screen.getByAltText('Preview');
			expect(img).toBeInTheDocument();
		});

		const removeButton = screen.getByText('Eliminar foto');
		expect(removeButton).toBeInTheDocument();
	});

	it('should select a valid file', async () => {
		render(() => <ImagePreviewSelect id='image' onFileSelected={fileSelected} />);

		const file = mockFile('image.png', 1024 * 1024, 'image/png');
		const input = screen.getByLabelText('Arrastra y suelta aquí o selecciona una imagen');

		fireEvent.change(input, { target: { files: [file] } });

		await waitFor(() => {
			const img = screen.getByAltText('Preview');
			expect(img).toBeInTheDocument();
		});

		expect(fileSelected).toHaveBeenCalledWith(file);
	});

	it('should show error for large file', async () => {
		const toastSpy = vi.spyOn(toast, 'error');

		render(() => <ImagePreviewSelect id='image' onFileSelected={fileSelected} />);

		const file = mockFile('image.png', 1024 * 1024 * 6, 'image/png');
		const input = screen.getByLabelText(/arrastra y suelta aquí o selecciona una imagen/i);
		expect(input).toBeInTheDocument();
		await fireEvent.change(input, { target: { files: [file] } });

		await waitFor(() => {
			expect(toastSpy).toHaveBeenCalledWith('Tamaño máximo permitido es de 5MB.');
		});
		expect(fileSelected).toHaveBeenCalledWith(null);
	});

	it('should show error for invalid file format', async () => {
		const toastSpy = vi.spyOn(toast, 'error');

		render(() => <ImagePreviewSelect id='image' onFileSelected={fileSelected} />);

		const file = mockFile('image.gif', 1024 * 1024, 'image/gif');
		const input = screen.getByLabelText('Arrastra y suelta aquí o selecciona una imagen');

		fireEvent.change(input, { target: { files: [file] } });

		await waitFor(() => {
			expect(toastSpy).toHaveBeenCalledWith('Formatos permitidos: jpeg, jpg, png.');
		});
		expect(fileSelected).toHaveBeenCalledWith(null);
	});

	it('should handle drag and drop valid file', async () => {
		render(() => <ImagePreviewSelect id='image' onFileSelected={fileSelected} />);

		const file = mockFile('image.png', 1024 * 1024, 'image/png');
		const dropZone = screen.getByText('Arrastra y suelta aquí o selecciona una imagen');

		fireEvent.dragOver(dropZone);
		fireEvent.drop(dropZone, {
			dataTransfer: {
				files: [file],
			},
		});

		await waitFor(() => {
			const img = screen.getByAltText('Preview');
			expect(img).toBeInTheDocument();
		});

		expect(fileSelected).toHaveBeenCalledWith(file);
	});

	it('should handle drag and drop invalid file format', async () => {
		const toastSpy = vi.spyOn(toast, 'error');

		render(() => <ImagePreviewSelect id='image' onFileSelected={fileSelected} />);

		const file = mockFile('image.gif', 1024 * 1024, 'image/gif');
		const dropZone = screen.getByText('Arrastra y suelta aquí o selecciona una imagen');

		fireEvent.dragOver(dropZone);
		fireEvent.drop(dropZone, {
			dataTransfer: {
				files: [file],
			},
		});

		await waitFor(() => {
			expect(toastSpy).toHaveBeenCalledWith('Formatos permitidos: jpeg, jpg, png.');
		});
		expect(fileSelected).toHaveBeenCalledWith(null);
	});

	it('should remove selected image', async () => {
		render(() => <ImagePreviewSelect id='image' onFileSelected={fileSelected} />);

		const file = mockFile('image.png', 1024 * 1024, 'image/png');
		const input = screen.getByLabelText('Arrastra y suelta aquí o selecciona una imagen');

		fireEvent.change(input, { target: { files: [file] } });

		await waitFor(() => {
			const img = screen.getByAltText('Preview');
			expect(img).toBeInTheDocument();
		});

		const removeButton = screen.getByText('Eliminar foto');
		fireEvent.click(removeButton);

		expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
		expect(fileSelected).toHaveBeenCalledWith(null);
	});
});
