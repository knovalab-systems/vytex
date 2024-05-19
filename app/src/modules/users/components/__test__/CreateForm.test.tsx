import { fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import '@testing-library/jest-dom'
import toast from 'solid-toast';
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as createUserRequests from '~/modules/users/requests/createUserRequests';
import { listRole } from '~/utils/roles';
import CreateForm from '../CreateForm';


vi.mock('~/modules/users/requests/createUserRequests', () => ({
    createUserRequest: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
    useNavigate: () => mockNavigate,
}));

describe('CreateForm', () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders correctly', () => {
        render(() => <CreateForm />)
        const nameField = screen.getByPlaceholderText(/jose perez/i)
        const usernameField = screen.getByPlaceholderText('jperez')
        const passwordField = screen.getByText('Contraseña')
        const confirmpasswordField = screen.getByText(/Confirmar contraseña/i)
        const roleIdFilterInput = screen.getByText('Selecciona un rol');
        const submitButton = screen.getByText('Guardar');
        const cancelButton = screen.getByText('Cancelar');

        expect(nameField).toBeInTheDocument();
        expect(usernameField).toBeInTheDocument();
        expect(passwordField).toBeInTheDocument();
        expect(confirmpasswordField).toBeInTheDocument();
        expect(roleIdFilterInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
    })

    it('check change inputs values ', async () => {
        render(() => <CreateForm />);
        const nameField = screen.getByPlaceholderText(/jose perez/i);
        const usernameField = screen.getByPlaceholderText('jperez');
        const passwordField = screen.getByPlaceholderText('********');
        const confirmpasswordField = screen.getByPlaceholderText('*********');
        const roleIdFilterInput = screen.getByText('Selecciona un rol');


        fireEvent.input(nameField, { target: { value: 'John Doe' } });
        fireEvent.input(usernameField, { target: { value: 'jdoe' } });
        fireEvent.input(passwordField, { target: { value: '12345678' } });
        fireEvent.input(confirmpasswordField, { target: { value: '12345678' } });
        fireEvent.change(roleIdFilterInput, { target: { value: 'admin' } });

        expect(nameField).toHaveValue('John Doe');
        expect(usernameField).toHaveValue('jdoe');
        expect(passwordField).toHaveValue('12345678');
        expect(confirmpasswordField).toHaveValue('12345678');
        expect(roleIdFilterInput).toHaveValue('admin');


    });

    it('show empty fields error message when submit form', async () => {
        render(() => <CreateForm />);
        const submitButton = screen.getByText('Guardar');
        fireEvent.click(submitButton);

        const errorname = await screen.findByText(/Por favor ingresa el nombre./i);
        const errorusername = await screen.findByText(/Por favor ingresa el usuario./i);
        const errorpassword = await screen.findByText(/Por favor ingresa la contraseña./i);

        expect(errorname).toBeInTheDocument();
        expect(errorusername).toBeInTheDocument();
        expect(errorpassword).toBeInTheDocument();
    })

    it('dont show empty fields error message when submit form', async () => {
        render(() => <CreateForm />);
        const nameField = screen.getByPlaceholderText(/jose perez/i);
        const usernameField = screen.getByPlaceholderText('jperez');
        const passwordField = screen.getByPlaceholderText('********');
        const confirmpasswordField = screen.getByPlaceholderText('*********');
        const roleIdFilterInput = screen.getByText('Selecciona un rol');
        const submitButton = screen.getByText('Guardar');

        fireEvent.input(nameField, { target: { value: 'John Doe' } });
        fireEvent.input(usernameField, { target: { value: 'jdoe' } });
        fireEvent.input(passwordField, { target: { value: '12345678' } });
        fireEvent.input(confirmpasswordField, { target: { value: '12345678' } });
        fireEvent.change(roleIdFilterInput, { target: { value: 'admin' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.queryByText(/Por favor ingresa el nombre./i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Por favor ingresa el usuario./i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Por favor ingresa la contraseña./i)).not.toBeInTheDocument();
        });
    });

    it('shows bad length password error', async () => {
        render(() => <CreateForm />);
        const passwordField = screen.getByPlaceholderText('********');
        const submitButton = screen.getByText('Guardar');

        fireEvent.input(passwordField, { target: { value: '1' } });
        fireEvent.click(submitButton);
        const errorPasswordField = await screen.findByText('La contraseña debe ser de mínimo 8 caracteres.');
        expect(errorPasswordField).toBeInTheDocument();
    });

    it('shows password mismatch error', async () => {
        render(() => <CreateForm />);
        const nameField = screen.getByPlaceholderText(/Jose Perez/i);
        const usernameField = screen.getByPlaceholderText('jperez');
        const passwordField = screen.getByPlaceholderText('********');
        const confirmpasswordField = screen.getByPlaceholderText('*********');
        const roleIdFilterInput = screen.getByText('Selecciona un rol');
        const submitButton = screen.getByText('Guardar');


        fireEvent.input(nameField, { target: { value: 'John Doe' } });
        fireEvent.input(usernameField, { target: { value: 'jdoe' } });
        fireEvent.input(passwordField, { target: { value: '12345678' } });
        fireEvent.input(confirmpasswordField, { target: { value: '' } });
        fireEvent.change(roleIdFilterInput, { target: { value: 'admin' } });

        fireEvent.click(submitButton);

        // fail because role is selected, but value is not selected
        const errorPasswordField = await screen.findByText(/Las contraseñas no coinciden./i);
        await waitFor(() => {
            expect(errorPasswordField).toBeInTheDocument();
        });
    });

    it('redirects to users list after successful submit', async () => {
        const createUserRequestSpy = vi.spyOn(createUserRequests, 'createUserRequest').mockResolvedValue({});
        render(() => <CreateForm />);
        const nameField = screen.getByPlaceholderText(/jose perez/i);
        const usernameField = screen.getByPlaceholderText('jperez');
        const passwordField = screen.getByPlaceholderText('********');
        const confirmpasswordField = screen.getByPlaceholderText('*********');
        const roleIdFilterInput = screen.getByText('Selecciona un rol');
        const submitButton = screen.getByText('Guardar');


        fireEvent.input(nameField, { target: { value: 'John Doe' } });
        fireEvent.input(usernameField, { target: { value: 'jdoe' } });
        fireEvent.input(passwordField, { target: { value: '12345678' } });
        fireEvent.input(confirmpasswordField, { target: { value: '12345678' } });
        fireEvent.change(roleIdFilterInput, { target: { value: 'admin' } });
        fireEvent.submit(submitButton);

        // fail because role is selected, but value is not selected o setted
        await waitFor(() => {
            expect(createUserRequestSpy).toHaveBeenCalled();
        });
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/users');
        });
    })

});