import { fireEvent, render, screen } from '@solidjs/testing-library'
import '@testing-library/jest-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UserControls from '../UserControls'


// mocks
const setNameFilter = vi.fn();
const setUsernameFilter = vi.fn();
const setStatusFilter = vi.fn();

describe('UserControls', () => {

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders correctly', () => {
        render(() => (
            <UserControls
                setNameFilter={setNameFilter}
                nameFilterValue=""
                setUsernameFilter={setUsernameFilter}
                usernameFilterValue=""
                setStatusFilter={setStatusFilter}
                statusFilterValue=""
            />
        ));

        const nameFilterInput = screen.getByPlaceholderText('Nombre');
        const usernameFilterInput = screen.getByPlaceholderText('Usuario');
        const statusFilterInput = screen.getByText('Estado de usuario');
        const clearFiltersButton = screen.getByText('Limpiar filtros');
        expect(nameFilterInput).toBeInTheDocument();
        expect(usernameFilterInput).toBeInTheDocument();
        expect(statusFilterInput).toBeInTheDocument();
        expect(clearFiltersButton).toBeInTheDocument();
    });

    it('should call setNameFilter when name filter input changes', async () => {
        render(() => (
            <UserControls
                setNameFilter={setNameFilter}
                nameFilterValue=""
                setUsernameFilter={setUsernameFilter}
                usernameFilterValue=""
                setStatusFilter={setStatusFilter}
                statusFilterValue=""
            />
        ));
        fireEvent.input(screen.getByPlaceholderText('Nombre'), { target: { value: 'John' } });
        await new Promise(resolve => setTimeout(resolve, 300));
        expect(setNameFilter).toHaveBeenCalledWith('John');
    });

    it('should call setUsernameFilter when username filter input changes', async () => {
        render(() => (
            <UserControls
                setNameFilter={setNameFilter}
                nameFilterValue=""
                setUsernameFilter={setUsernameFilter}
                usernameFilterValue=""
                setStatusFilter={setStatusFilter}
                statusFilterValue=""
            />
        ));
        fireEvent.input(screen.getByPlaceholderText('Usuario'), { target: { value: 'john123' } });
        await new Promise(resolve => setTimeout(resolve, 300));
        expect(setUsernameFilter).toHaveBeenCalledWith('john123');
    });

    // it('should call setStatusFilter when status filter changes', async () => {
    //     render(() => (
    //         <UserControls
    //             setNameFilter={setNameFilter}
    //             nameFilterValue=""
    //             setUsernameFilter={setUsernameFilter}
    //             usernameFilterValue=""
    //             setStatusFilter={setStatusFilter}
    //             statusFilterValue=""
    //         />
    //     ));

    //     const statusFilterSelect = screen.getByText(/Estado de usuario/i);
    //     fireEvent.click(statusFilterSelect);

    //     const option = await screen.findByText(/Activo/i);
    //     fireEvent.click(option);


    //     await new Promise(resolve => setTimeout(resolve, 300));
    //     expect(setStatusFilter).toHaveBeenCalledWith('activo');

    // });

    it('should clear all filters when clear filters button is clicked', async () => {
        // render with initial filters
        render(() => (
            <UserControls
                setNameFilter={setNameFilter}
                nameFilterValue="Jhon"
                setUsernameFilter={setUsernameFilter}
                usernameFilterValue="perez"
                setStatusFilter={setStatusFilter}
                statusFilterValue="Activo"
            />
        ));

        const clearFiltersButton = screen.getByText('Limpiar filtros');
        fireEvent.click(clearFiltersButton);

        expect(setNameFilter).toHaveBeenCalledWith('');
        expect(setUsernameFilter).toHaveBeenCalledWith('');
        expect(setStatusFilter).toHaveBeenCalledWith('');
    });

    it('should disable clear filters button when no filters are applied', () => {
        render(() => (
            <UserControls
                setNameFilter={setNameFilter}
                nameFilterValue=""
                setUsernameFilter={setUsernameFilter}
                usernameFilterValue=""
                setStatusFilter={setStatusFilter}
                statusFilterValue=""
            />
        ));

        const clearFiltersButton = screen.getByText('Limpiar filtros');
        expect(clearFiltersButton).toBeDisabled();
    });
});