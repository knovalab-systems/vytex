import { fireEvent, render, screen, waitFor, within } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import toast from 'solid-toast';
import { createPointerEvent } from '~/utils/event';
import * as requests from '../../requests/supplierUpdate';
import SupplierUpdateForm from '../SupplierUpdateForm';

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
    useNavigate: () => mockNavigate,
}));

describe('SupplierUpdateForm', () => {

    it('renders correctly', () => {
        const supplier = {
            name: 'Jose',
            brand: 'brand',
            code: '2322',
            nit: '111111111',
            deleted_at: null,
        };

        render(() => <SupplierUpdateForm supplier={supplier} />);
        const nameField = screen.getByPlaceholderText('Nombre del proveedor');
        const brandField = screen.getByPlaceholderText('Marca del proveedor');
        const codeField = screen.getByPlaceholderText('2322');
        const nitField = screen.getByPlaceholderText('111111111');
        const status = screen.getByText('Activo');
        const submitButton = screen.getByText('Actualizar');
        const cancelButton = screen.getByText('Cancelar');

        expect(nameField).toBeInTheDocument();
        expect(brandField).toBeInTheDocument();
        expect(codeField).toBeInTheDocument();
        expect(nitField).toBeInTheDocument();
        expect(status).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
    });

    it('check change inputs values ', async () => {
        const supplier = {
            name: 'Jose',
            brand: 'brand',
            code: '2322',
            nit: '111111111',
            deleted_at: null,
        };

        render(() => <SupplierUpdateForm supplier={supplier} />);
        const nameField = screen.getByPlaceholderText('Nombre del proveedor');
        const brandField = screen.getByPlaceholderText('Marca del proveedor');
        const codeField = screen.getByPlaceholderText('2322');
        const nitField = screen.getByPlaceholderText('111111111');
        const statusSelect = screen.getByTitle('Ver estados');

        fireEvent.input(nameField, { target: { value: 'John Doe' } });
        fireEvent.input(brandField, { target: { value: 'Marca' } });
        fireEvent.input(codeField, { target: { value: 1111 } });
        fireEvent.input(nitField, { target: { value: 222222222 } });

        fireEvent(
            statusSelect,
            createPointerEvent('pointerdown', {
                pointerId: 1,
                pointerType: 'mouse',
            }),
        );
        await Promise.resolve();

        fireEvent(statusSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
        await Promise.resolve();

        const listboxStatus = screen.getByRole('listbox');
        const status = within(listboxStatus).getAllByRole('option');

        fireEvent(
            status[1],
            createPointerEvent('pointerdown', {
                pointerId: 1,
                pointerType: 'mouse',
            }),
        );
        await Promise.resolve();

        fireEvent(status[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
        await Promise.resolve();

        expect(nameField).toHaveValue('John Doe');
        expect(brandField).toHaveValue('Marca');
        expect(codeField).toHaveValue(1111);
        expect(nitField).toHaveValue(222222222);
        expect(statusSelect).toHaveTextContent('Inactivo');
    });

    it('show empty fields error message when submit form', async () => {
        const supplier = {
            name: 'Jose',
            brand: 'brand',
            code: '2322',
            nit: '111111111',
            deleted_at: null,
        };

        render(() => <SupplierUpdateForm supplier={supplier} />);

        const nameField = screen.getByPlaceholderText('Nombre del proveedor');
        const brandField = screen.getByPlaceholderText('Marca del proveedor');
        const nitField = screen.getByPlaceholderText('111111111');
        const codeField = screen.getByPlaceholderText('2322');

        fireEvent.input(nameField, { target: { value: '' } });
        fireEvent.input(brandField, { target: { value: '' } });
        fireEvent.input(codeField, { target: { value: '' } });
        fireEvent.input(nitField, { target: { value: '' } });

        const statusSelect = screen.getByTitle('Ver estados');

        fireEvent(
            statusSelect,
            createPointerEvent('pointerdown', {
                pointerId: 1,
                pointerType: 'mouse',
            }),
        );
        await Promise.resolve();

        fireEvent(statusSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
        await Promise.resolve();

        const listboxStatus = screen.getByRole('listbox');
        const status = within(listboxStatus).getAllByRole('option');

        fireEvent(
            status[0],
            createPointerEvent('pointerdown', {
                pointerId: 1,
                pointerType: 'mouse',
            }),
        );
        await Promise.resolve();

        fireEvent(status[0], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
        await Promise.resolve();

        const submitButton = screen.getByText('Actualizar');
        fireEvent.click(submitButton);

        const nameError = await screen.findByText('Ingresa el nombre.');
        const brandError = await screen.findByText('Ingresa la marca.');
        const codeError = await screen.findByText('Ingresa el código.');
        const nitError = await screen.findByText('Ingresa el NIT.');
        const statusError = await screen.findByText('Selecciona un estado.');

        expect(nameError).toBeInTheDocument();
        expect(brandError).toBeInTheDocument();
        expect(codeError).toBeInTheDocument();
        expect(nitError).toBeInTheDocument();
        expect(statusError).toBeInTheDocument();
    });

    it('dont show empty fields error message when submit form', async () => {
        const supplier = {
            name: 'Jose',
            brand: 'brand',
            code: '2322',
            nit: '111111111',
            deleted_at: null,
        };

        render(() => <SupplierUpdateForm supplier={supplier} />);
        const nameField = screen.getByPlaceholderText('Nombre del proveedor');
        const brandField = screen.getByPlaceholderText('Marca del proveedor');
        const codeField = screen.getByPlaceholderText('2322');
        const nitField = screen.getByPlaceholderText('111111111');
        const statusSelect = screen.getByTitle('Ver estados');
        const submitButton = screen.getByText('Actualizar');

        fireEvent.input(nameField, { target: { value: 'John Doe' } });
        fireEvent.input(brandField, { target: { value: 'Marca' } });
        fireEvent.input(codeField, { target: { value: 1111 } });
        fireEvent.input(nitField, { target: { value: 222222222 } });


        fireEvent(
            statusSelect,
            createPointerEvent('pointerdown', {
                pointerId: 1,
                pointerType: 'mouse',
            }),
        );
        await Promise.resolve();

        fireEvent(statusSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
        await Promise.resolve();

        const listboxStatus = screen.getByRole('listbox');
        const status = within(listboxStatus).getAllByRole('option');

        fireEvent(
            status[1],
            createPointerEvent('pointerdown', {
                pointerId: 1,
                pointerType: 'mouse',
            }),
        );
        await Promise.resolve();

        fireEvent(status[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
        await Promise.resolve();

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText('Ingresa el nombre.')).not.toBeInTheDocument();
            expect(screen.queryByText('Ingresa la marca.')).not.toBeInTheDocument();
            expect(screen.queryByText('Ingresa el código.')).not.toBeInTheDocument();
            expect(screen.queryByText('Ingresa el NIT.')).not.toBeInTheDocument();
            expect(screen.queryByText('Selecciona un estado.')).not.toBeInTheDocument();
        });
    });

    it('show bad length error for nit', async () => {
        const supplier = {
            name: 'Jose',
            brand: 'brand',
            code: '2322',
            nit: '111111111',
            deleted_at: null,
        };

        render(() => <SupplierUpdateForm supplier={supplier} />);
        const nitField = screen.getByPlaceholderText('111111111');
        const submitButton = screen.getByText('Actualizar');

        fireEvent.input(nitField, { target: { value: '22222222' } });
        fireEvent.click(submitButton);

        const hexError = await screen.findByText('El NIT debe ser de 9 dígitos');

        expect(hexError).toBeInTheDocument();
    });

    const requestsErrors = [
        {
            title: 'calls submit with code exists',
            textExp: 'El código "1111" no está disponible. Intente con otro.',
            error: {
                errors: {
                    detail: 'Supplier code already exists',
                },
                response: {
                    status: 409,
                },
            },
        },
        {
            title: 'calls submit with nit exists',
            textExp: 'El NIT "222222222" no está disponible. Intente con otro.',
            error: {
                errors: {
                    detail: 'Supplier NIT already exists',
                },
                response: {
                    status: 409,
                },
            },
        },
        {
            title: 'calls submit with code n nit exists',
            textExp: 'El NIT "222222222" y el código "1111" no están disponibles. Intente con otros.',
            error: {
                errors: {
                    detail: 'Any other',
                },
                response: {
                    status: 409,
                },
            },
        },
        {
            title: 'calls submit with server error',
            textExp: 'Error al actualizar proveedor.',
            error: {
                response: {
                    status: 400,
                },
            },
        },
    ];

    for (const err of requestsErrors) {
        it(err.title, async () => {
            const supplier = {
                name: 'Jose',
                brand: 'brand',
                code: '2322',
                nit: '111111111',
                deleted_at: null,
            };

            render(() => <SupplierUpdateForm supplier={supplier} />);
            const toastMock = vi.spyOn(toast, 'error').mockReturnValue('error');
            const requestMock = vi.spyOn(requests, 'updateSupplierRequest').mockRejectedValue(err.error);

            const nameField = screen.getByPlaceholderText('Nombre del proveedor');
            const brandField = screen.getByPlaceholderText('Marca del proveedor');
            const codeField = screen.getByPlaceholderText('2322');
            const nitField = screen.getByPlaceholderText('111111111');
            const submitButton = screen.getByText('Actualizar');

            fireEvent.input(nameField, { target: { value: 'Negro' } });
            fireEvent.input(brandField, { target: { value: 'Marca' } });
            fireEvent.input(codeField, { target: { value: 1111 } });
            fireEvent.input(nitField, { target: { value: 222222222 } });
            fireEvent.click(submitButton);

            await waitFor(() => {
                expect(requestMock).toHaveBeenCalled();
                expect(toastMock).toHaveBeenCalledWith(err.textExp);
            });
        });
    }

    it('calls calcel successfully', async () => {
        const supplier = {
            name: 'Jose',
            brand: 'brand',
            code: '2322',
            nit: '111111111',
            deleted_at: null,
        };

        render(() => <SupplierUpdateForm supplier={supplier} />);

        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);
        expect(mockNavigate).toHaveBeenCalled();
    });

    it('calls submit succesfully', async () => {
        const supplier = {
            name: 'Jose',
            brand: 'brand',
            code: '2322',
            nit: '111111111',
            deleted_at: null,
        };

        render(() => <SupplierUpdateForm supplier={supplier} />);

        const requestMock = vi.spyOn(requests, 'updateSupplierRequest').mockResolvedValue({});
        const toastMock = vi.spyOn(toast, 'success').mockReturnValue('success');

        const nameField = screen.getByPlaceholderText('Nombre del proveedor');
        const brandField = screen.getByPlaceholderText('Marca del proveedor');
        const codeField = screen.getByPlaceholderText('2322');
        const nitField = screen.getByPlaceholderText('111111111');
        const statusSelect = screen.getByTitle('Ver estados');
        const submitButton = screen.getByText('Actualizar');

        fireEvent.input(nameField, { target: { value: 'John Doe' } });
        fireEvent.input(brandField, { target: { value: 'Marca' } });
        fireEvent.input(codeField, { target: { value: 1111 } });
        fireEvent.input(nitField, { target: { value: 222222222 } });

        fireEvent(
            statusSelect,
            createPointerEvent('pointerdown', {
                pointerId: 1,
                pointerType: 'mouse',
            }),
        );
        await Promise.resolve();

        fireEvent(statusSelect, createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
        await Promise.resolve();

        const listboxStatus = screen.getByRole('listbox');
        const status = within(listboxStatus).getAllByRole('option');

        fireEvent(
            status[1],
            createPointerEvent('pointerdown', {
                pointerId: 1,
                pointerType: 'mouse',
            }),
        );
        await Promise.resolve();

        fireEvent(status[1], createPointerEvent('pointerup', { pointerId: 1, pointerType: 'mouse' }));
        await Promise.resolve();


        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(requestMock).toHaveBeenCalled();
            expect(toastMock).toHaveBeenCalledWith('Proveedor actualizado correctamente.');
        });
    })
});