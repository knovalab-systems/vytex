import { fireEvent, render, screen } from '@solidjs/testing-library';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserControls from '../UserControls';

// mocks
const setNameFilter = vi.fn();
const setUsernameFilter = vi.fn();
const setStatusFilter = vi.fn();
const setRoleIdFilter = vi.fn();

const mockNavigate = vi.fn();
vi.mock('@solidjs/router', () => ({
	useNavigate: () => mockNavigate,
}));

describe('UserControls', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('renders correctly', () => {
		render(() => (
			<UserControls
				setNameFilter={setNameFilter}
				nameFilterValue=''
				setUsernameFilter={setUsernameFilter}
				usernameFilterValue=''
				setStatusFilter={setStatusFilter}
				statusFilterValue=''
				setRoleIdFilter={setRoleIdFilter}
				roleIdFilterValue=''
			/>
		));

		const nameFilterInput = screen.getByPlaceholderText('Nombre');
		const usernameFilterInput = screen.getByPlaceholderText('Usuario');
		const statusFilterInput = screen.getByText('Estado de usuario');
		const roleIdFilterInput = screen.getByText('Rol de usuario');
		expect(nameFilterInput).toBeInTheDocument();
		expect(usernameFilterInput).toBeInTheDocument();
		expect(statusFilterInput).toBeInTheDocument();
		expect(roleIdFilterInput).toBeInTheDocument();
	});

	it('should call setNameFilter when name filter input changes', async () => {
		render(() => (
			<UserControls
				setNameFilter={setNameFilter}
				nameFilterValue=''
				setUsernameFilter={setUsernameFilter}
				usernameFilterValue=''
				setStatusFilter={setStatusFilter}
				statusFilterValue=''
				setRoleIdFilter={setRoleIdFilter}
				roleIdFilterValue=''
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
				nameFilterValue=''
				setUsernameFilter={setUsernameFilter}
				usernameFilterValue=''
				setStatusFilter={setStatusFilter}
				statusFilterValue=''
				setRoleIdFilter={setRoleIdFilter}
				roleIdFilterValue=''
			/>
		));
		fireEvent.input(screen.getByPlaceholderText('Usuario'), { target: { value: 'john123' } });
		await new Promise(resolve => setTimeout(resolve, 300));
		expect(setUsernameFilter).toHaveBeenCalledWith('john123');
	});

	it('should call setStatusFilter when status filter changes', async () => {
		render(() => (
			<UserControls
				setNameFilter={setNameFilter}
				nameFilterValue=''
				setUsernameFilter={setUsernameFilter}
				usernameFilterValue=''
				setStatusFilter={setStatusFilter}
				statusFilterValue=''
				setRoleIdFilter={setRoleIdFilter}
				roleIdFilterValue=''
			/>
		));

		const select = screen.getByText('Estado de usuario');
		fireEvent.change(select, { target: { value: 'Activo' } });
		expect(setStatusFilter).toHaveBeenCalledWith('Activo');
	});

	it('should call setRoleIdFilter when role id filter changes', async () => {
		render(() => (
			<UserControls
				setNameFilter={setNameFilter}
				nameFilterValue=''
				setUsernameFilter={setUsernameFilter}
				usernameFilterValue=''
				setStatusFilter={setStatusFilter}
				statusFilterValue=''
				setRoleIdFilter={setRoleIdFilter}
				roleIdFilterValue=''
			/>
		));

		const select = screen.getByText('Rol de usuario');
		fireEvent.change(select, { target: { value: '1' } });
		expect(setRoleIdFilter).toHaveBeenCalledWith('1');
	});

	it('should clear all filters when clear filters button is clicked', async () => {
		// render with initial filters
		render(() => (
			<UserControls
				setNameFilter={setNameFilter}
				nameFilterValue='aa'
				setUsernameFilter={setUsernameFilter}
				usernameFilterValue='bb'
				setStatusFilter={setStatusFilter}
				statusFilterValue='1'
				setRoleIdFilter={setRoleIdFilter}
				roleIdFilterValue=''
			/>
		));

		const clearFiltersButton = screen.getByText('Limpiar filtros');
		fireEvent.click(clearFiltersButton);

		expect(setNameFilter).toHaveBeenCalledWith('');
		expect(setUsernameFilter).toHaveBeenCalledWith('');
		expect(setStatusFilter).toHaveBeenCalledWith('');
	});

	it('Should not be button there when there are no filters. ', () => {
		render(() => (
			<UserControls
				setNameFilter={setNameFilter}
				nameFilterValue=''
				setUsernameFilter={setUsernameFilter}
				usernameFilterValue=''
				setStatusFilter={setStatusFilter}
				statusFilterValue=''
				setRoleIdFilter={setRoleIdFilter}
				roleIdFilterValue=''
			/>
		));

		const clearFiltersButton = screen.queryByText('Limpiar filtros');
		expect(clearFiltersButton).not.toBeInTheDocument();
	});
});
