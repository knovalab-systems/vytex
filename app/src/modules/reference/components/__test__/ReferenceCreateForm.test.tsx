import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import * as imageRequest from '~/requests/imageUpload';
import { createPointerEvent, installPointerEvent } from '~/utils/event';
import * as requests from '../../requests/referenceCreate';
import ReferenceCreateForm from '../ReferenceCreateForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

const fileMock = (name: string, size: number, type: string) => {
	const file = new File([new Blob(['a'.repeat(size)])], name, { type });
	Object.defineProperty(file, 'size', { get: () => size });
	return file;
};

window.URL.createObjectURL = vi.fn();

describe('ReferenceCreateForm', () => {
	installPointerEvent();
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => <ReferenceCreateForm colors={[]} fabrics={[]} resources={[]} />);

		const refField = screen.getByText('Código de la referencia');
		const colorField = screen.getByText('Color de la referencia');
		const resourceField = screen.getByText('Insumo/Tela');
		const submitButton = screen.getAllByText('Crear');
		const cancelButton = screen.getAllByText('Cancelar');
		const imageFields = screen.getAllByText('Arrastra y suelta aquí o selecciona un archivo');

		expect(refField).toBeInTheDocument();
		expect(colorField).toBeInTheDocument();
		expect(resourceField).toBeInTheDocument();
		expect(submitButton.length).eq(2);
		expect(cancelButton.length).eq(2);
		expect(imageFields.length).eq(2);
	});

	it('shows required errors correctly', async () => {
		render(() => <ReferenceCreateForm colors={[]} fabrics={[]} resources={[]} />);

		const submitButton = screen.getAllByText('Crear');
		fireEvent.click(submitButton[0]);

		const refFieldErr = await screen.findByText('Ingresa el código de la referencia.');
		const colorFieldErr = screen.getByText('Selecciona un color.');
		const resourceFieldErr = screen.getByText('Selecciona un insumo/tela.');
		const imageFieldsErr = screen.getAllByText('Elije una imagen.');

		expect(refFieldErr).toBeInTheDocument();
		expect(colorFieldErr).toBeInTheDocument();
		expect(resourceFieldErr).toBeInTheDocument();
		expect(imageFieldsErr.length).eq(2);
	});

	it('shows bad type image error', async () => {
		render(() => <ReferenceCreateForm colors={[]} fabrics={[]} resources={[]} />);

		const file = fileMock('image.png', 1024 * 1024, 'image/avi');
		const frontField = screen.getByTitle('Foto frontal');
		const backField = screen.getByTitle('Foto posterior');

		fireEvent.input(frontField, { target: { files: [file] } });
		fireEvent.input(backField, { target: { files: [file] } });

		const submitButton = screen.getAllByText('Crear');
		fireEvent.click(submitButton[0]);

		const imageFieldsErr = await screen.findAllByText('Formatos validos: jpeg, png, jpg, webp.');

		expect(imageFieldsErr.length).eq(2);
	});

	it('shows bad length image error', async () => {
		render(() => <ReferenceCreateForm colors={[]} fabrics={[]} resources={[]} />);

		const file = fileMock('image.png', 1024 * 1024 * 24, 'image/png');
		const frontField = screen.getByTitle('Foto frontal');
		const backField = screen.getByTitle('Foto posterior');

		fireEvent.input(frontField, { target: { files: [file] } });
		fireEvent.input(backField, { target: { files: [file] } });

		const submitButton = screen.getAllByText('Crear');
		fireEvent.click(submitButton[0]);

		const imageFieldsErr = await screen.findAllByText('El tamaño máximo permitido es de 5MB.');

		expect(imageFieldsErr.length).eq(2);
	});

	it('calls submit with pending fabric', async () => {
		render(() => (
			<ReferenceCreateForm
				colors={[{ id: 1, name: 'Blanco', hex: '', deleted_at: '' }]}
				fabrics={[]}
				resources={[{ id: 1, name: 'Insumo 1' }]}
			/>
		));

		const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');

		const file = fileMock('image.png', 1024 * 1024, 'image/png');
		const referenceField = screen.getByPlaceholderText('3453');
		const frontField = screen.getByTitle('Foto frontal');
		const backField = screen.getByTitle('Foto posterior');

		fireEvent.input(referenceField, { target: { value: 1232 } });
		fireEvent.input(frontField, { target: { files: [file] } });
		fireEvent.input(backField, { target: { files: [file] } });

		const colorSelect = screen.getByTitle('Ver colores');

		fireEvent(
			colorSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colorSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxColor = screen.getByRole('listbox');
		const colors = within(listboxColor).getAllByRole('option');

		fireEvent(
			colors[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colors[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const resourcesSelect = screen.getByTitle('Ver insumos y telas');

		fireEvent(
			resourcesSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(resourcesSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxResources = screen.getByRole('listbox');
		const resources = within(listboxResources).getAllByRole('option');

		fireEvent(
			resources[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(resources[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const submitButton = screen.getAllByText('Crear');
		fireEvent.click(submitButton[0]);

		await waitFor(() => expect(toastMock).toHaveBeenCalled());
	});

	it('calls submit with pending resource', async () => {
		render(() => (
			<ReferenceCreateForm
				colors={[{ id: 1, name: 'Blanco', hex: '', deleted_at: '' }]}
				fabrics={[{ id: 1, name: 'Tela 1' }]}
				resources={[]}
			/>
		));

		const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');

		const file = fileMock('image.png', 1024 * 1024, 'image/png');
		const referenceField = screen.getByPlaceholderText('3453');
		const frontField = screen.getByTitle('Foto frontal');
		const backField = screen.getByTitle('Foto posterior');

		fireEvent.input(referenceField, { target: { value: 1232 } });
		fireEvent.input(frontField, { target: { files: [file] } });
		fireEvent.input(backField, { target: { files: [file] } });

		// select color

		const colorSelect = screen.getByTitle('Ver colores');

		fireEvent(
			colorSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colorSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxColor = screen.getByRole('listbox');
		const colors = within(listboxColor).getAllByRole('option');

		fireEvent(
			colors[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colors[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		// select resource

		const resourcesSelect = screen.getByTitle('Ver insumos y telas');

		fireEvent(
			resourcesSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(resourcesSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxResources = screen.getByRole('listbox');
		const resources = within(listboxResources).getAllByRole('option');

		fireEvent(
			resources[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(resources[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const submitButton = screen.getAllByText('Crear');
		fireEvent.click(submitButton[0]);

		await waitFor(() => expect(toastMock).toHaveBeenCalled());
	});

	it('calls submit succesfully', async () => {
		render(() => (
			<ReferenceCreateForm
				colors={[{ id: 1, name: 'Blanco', hex: '', deleted_at: '' }]}
				fabrics={[{ id: 1, name: 'Tela 1' }]}
				resources={[{ id: 1, name: 'Insumo 1' }]}
			/>
		));

		const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');
		const requestMock = vi.spyOn(requests, 'createReferenceRequest').mockResolvedValue({});
		const imageRequestMock = vi.spyOn(imageRequest, 'uploadImagesRequest').mockResolvedValue([{ id: 1 }, { id: 2 }]);

		const file = fileMock('image.png', 1024 * 1024, 'image/png');
		const referenceField = screen.getByPlaceholderText('3453');
		const frontField = screen.getByTitle('Foto frontal');
		const backField = screen.getByTitle('Foto posterior');

		fireEvent.input(referenceField, { target: { value: 1232 } });
		fireEvent.input(frontField, { target: { files: [file] } });
		fireEvent.input(backField, { target: { files: [file] } });

		// color

		const colorSelect = screen.getByTitle('Ver colores');

		fireEvent(
			colorSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colorSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxColor = screen.getByRole('listbox');
		const colors = within(listboxColor).getAllByRole('option');

		fireEvent(
			colors[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colors[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		// resources

		const addResourceButton = screen.getByText('Nuevo insumo/tela');
		fireEvent.click(addResourceButton);

		const resourcesSelect = screen.getAllByTitle('Ver insumos y telas');

		// resource

		fireEvent(
			resourcesSelect[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);

		await Promise.resolve();

		fireEvent(resourcesSelect[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxResources = screen.getByRole('listbox');
		const resources = within(listboxResources).getAllByRole('option');

		fireEvent(
			resources[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(resources[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		// resources 2

		fireEvent(
			resourcesSelect[1],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(resourcesSelect[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxResources2 = screen.getByRole('listbox');
		const resources2 = within(listboxResources2).getAllByRole('option');

		expect(resources2.length).toBe(2);

		fireEvent(
			resources2[1],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(resources2[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const submitButton = screen.getAllByText('Crear');
		fireEvent.click(submitButton[0]);

		await waitFor(() => {
			expect(requestMock).toHaveBeenCalled();
			expect(imageRequestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
		});
	});

	it('calls submit with image request error', async () => {
		render(() => (
			<ReferenceCreateForm
				colors={[{ id: 1, name: 'Blanco', hex: '', deleted_at: '' }]}
				fabrics={[{ id: 1, name: 'Tela 1' }]}
				resources={[{ id: 1, name: 'Insumo 1' }]}
			/>
		));

		const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');
		const requestMock = vi.spyOn(requests, 'createReferenceRequest').mockResolvedValue({});
		const imageRequestMock = vi.spyOn(imageRequest, 'uploadImagesRequest').mockRejectedValue({});

		const file = fileMock('image.png', 1024 * 1024, 'image/png');
		const referenceField = screen.getByPlaceholderText('3453');
		const frontField = screen.getByTitle('Foto frontal');
		const backField = screen.getByTitle('Foto posterior');

		fireEvent.input(referenceField, { target: { value: 1232 } });
		fireEvent.input(frontField, { target: { files: [file] } });
		fireEvent.input(backField, { target: { files: [file] } });

		// color

		const colorSelect = screen.getByTitle('Ver colores');

		fireEvent(
			colorSelect,
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colorSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxColor = screen.getByRole('listbox');
		const colors = within(listboxColor).getAllByRole('option');

		fireEvent(
			colors[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(colors[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		// resources

		const addResourceButton = screen.getByText('Nuevo insumo/tela');
		fireEvent.click(addResourceButton);

		const resourcesSelect = screen.getAllByTitle('Ver insumos y telas');

		// resource

		fireEvent(
			resourcesSelect[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);

		await Promise.resolve();

		fireEvent(resourcesSelect[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxResources = screen.getByRole('listbox');
		const resources = within(listboxResources).getAllByRole('option');

		fireEvent(
			resources[0],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(resources[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		// resources 2

		fireEvent(
			resourcesSelect[1],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(resourcesSelect[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const listboxResources2 = screen.getByRole('listbox');
		const resources2 = within(listboxResources2).getAllByRole('option');

		expect(resources2.length).toBe(2);

		fireEvent(
			resources2[1],
			createPointerEvent('pointerdown', {
				pointerId: 1,
				pointerType: 'mouse',
			}),
		);
		await Promise.resolve();

		fireEvent(resources2[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
		await Promise.resolve();

		const submitButton = screen.getAllByText('Crear');
		fireEvent.click(submitButton[0]);

		await waitFor(() => {
			expect(imageRequestMock).toHaveBeenCalled();
			expect(toastMock).toHaveBeenCalled();
			expect(requestMock).not.toHaveBeenCalled();
		});
	});

	it('calls cancel successfully', async () => {
		render(() => <ReferenceCreateForm colors={[]} fabrics={[]} resources={[]} />);
		const cancelButton = screen.getAllByText('Cancelar');
		fireEvent.click(cancelButton[0]);
		expect(mockNavigate).toHaveBeenCalled();
	});

	const requestsErrors = [
		{
			title: 'calls submit with code exists',
			textExp: 'El código de la referencia "1232" no está disponible. Intente con otro.',
			error: {
				response: {
					status: 409,
				},
			},
		},
		{
			title: 'calls submit with server error',
			textExp: 'Error al crear referencia.',
			error: {
				response: {
					status: 400,
				},
			},
		},
	];

	for (const err of requestsErrors) {
		it(err.title, async () => {
			render(() => (
				<ReferenceCreateForm
					colors={[{ id: 1, name: 'Blanco', hex: '', deleted_at: '' }]}
					fabrics={[{ id: 1, name: 'Tela 1' }]}
					resources={[{ id: 1, name: 'Insumo 1' }]}
				/>
			));
			const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');
			const requestMock = vi.spyOn(requests, 'createReferenceRequest').mockRejectedValue(err.error);
			const imageRequestMock = vi.spyOn(imageRequest, 'uploadImagesRequest').mockResolvedValue([{ id: 1 }, { id: 2 }]);

			const file = fileMock('image.png', 1024 * 1024, 'image/png');
			const referenceField = screen.getByPlaceholderText('3453');
			const frontField = screen.getByTitle('Foto frontal');
			const backField = screen.getByTitle('Foto posterior');

			fireEvent.input(referenceField, { target: { value: 1232 } });
			fireEvent.input(frontField, { target: { files: [file] } });
			fireEvent.input(backField, { target: { files: [file] } });

			// color

			const colorSelect = screen.getByTitle('Ver colores');

			fireEvent(
				colorSelect,
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(colorSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			const listboxColor = screen.getByRole('listbox');
			const colors = within(listboxColor).getAllByRole('option');

			fireEvent(
				colors[0],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(colors[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			// resources

			const addResourceButton = screen.getByText('Nuevo insumo/tela');
			fireEvent.click(addResourceButton);

			const resourcesSelect = screen.getAllByTitle('Ver insumos y telas');

			// resource

			fireEvent(
				resourcesSelect[0],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);

			await Promise.resolve();

			fireEvent(resourcesSelect[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			const listboxResources = screen.getByRole('listbox');
			const resources = within(listboxResources).getAllByRole('option');

			fireEvent(
				resources[0],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(resources[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			// resources 2

			fireEvent(
				resourcesSelect[1],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(resourcesSelect[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			const listboxResources2 = screen.getByRole('listbox');
			const resources2 = within(listboxResources2).getAllByRole('option');

			expect(resources2.length).toBe(2);

			fireEvent(
				resources2[1],
				createPointerEvent('pointerdown', {
					pointerId: 1,
					pointerType: 'mouse',
				}),
			);
			await Promise.resolve();

			fireEvent(resources2[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
			await Promise.resolve();

			const submitButton = screen.getAllByText('Crear');
			fireEvent.click(submitButton[0]);

			await waitFor(() => {
				expect(requestMock).toHaveBeenCalled();
				expect(toastMock).toHaveBeenCalledWith(err.textExp);
				expect(imageRequestMock).toHaveBeenCalled();
			});
		});
	}
});
